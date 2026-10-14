//=============================================================================
// DebugInfo.js
//=============================================================================

/*:
 * @plugindesc On-screen debug info so a screenshot tells you exactly where and what was happening. F7 toggles.
 *
 * @param Playtest Only
 * @desc true = only in Playtest. false = also in real builds (still hidden until F7 if Start Visible is false).
 * @type boolean
 * @default true
 *
 * @param Start Visible
 * @desc Show the overlay as soon as the game starts.
 * @type boolean
 * @default true
 *
 * @param Recent Changes
 * @desc How many recent switch/variable changes to list.
 * @type number
 * @default 6
 *
 * @help
 * F7 shows / hides the overlay (top-right corner, doesn't take clicks).
 *
 * What it shows:
 *   clock time, play time, frame count, current scene
 *   map id + editor name + display name, player x,y, facing, region, terrain tag
 *   the event the player is standing on and the one in front (id, name, page)
 *   the running event: event id, line number in its list, command type,
 *     and the common event chain it's inside
 *   running parallel common events
 *   whether a message / choice is open
 *   party: level, HP, MP, state ids; gold, steps, saves
 *   in battle: troop id, turn, each enemy's HP and states
 *   the last few switch / variable changes, with their names
 *
 * Line numbers are 1-based, counting every line in the event's command list
 * (the same order you see in the editor, including "When..." / "End" lines).
 */

(function() {
    var params = PluginManager.parameters('DebugInfo');
    if (params['Playtest Only'] !== 'false' && !Utils.isOptionValid('test')) return;
    var visible = params['Start Visible'] !== 'false';
    var RECENT = Number(params['Recent Changes'] || 6);

    var DIRS = { 2: 'down', 4: 'left', 6: 'right', 8: 'up' };
    var CODES = {
        101: 'Show Text', 401: 'Show Text', 102: 'Show Choices', 402: 'When', 403: 'When Cancel',
        103: 'Input Number', 104: 'Select Item', 105: 'Scrolling Text', 108: 'Comment', 408: 'Comment',
        111: 'If', 411: 'Else', 412: 'End', 112: 'Loop', 413: 'Repeat', 113: 'Break Loop',
        115: 'Exit Event', 117: 'Common Event', 118: 'Label', 119: 'Jump to Label',
        121: 'Control Switches', 122: 'Control Variables', 123: 'Self Switch', 124: 'Timer',
        125: 'Change Gold', 126: 'Change Items', 127: 'Change Weapons', 128: 'Change Armors',
        129: 'Change Party', 201: 'Transfer', 202: 'Set Vehicle', 203: 'Set Event Location',
        204: 'Scroll Map', 205: 'Move Route', 505: 'Move Route', 211: 'Transparency',
        212: 'Show Animation', 213: 'Show Balloon', 214: 'Erase Event', 221: 'Fadeout',
        222: 'Fadein', 223: 'Tint Screen', 224: 'Flash', 225: 'Shake', 230: 'Wait',
        231: 'Show Picture', 232: 'Move Picture', 235: 'Erase Picture', 241: 'Play BGM',
        245: 'Play BGS', 249: 'Play ME', 250: 'Play SE', 261: 'Movie', 301: 'Battle',
        601: 'If Win', 602: 'If Escape', 603: 'If Lose', 302: 'Shop', 303: 'Name Input',
        311: 'Change HP', 312: 'Change MP', 313: 'Change State', 314: 'Recover All',
        315: 'Change EXP', 316: 'Change Level', 317: 'Change Parameter', 318: 'Change Skill',
        319: 'Change Equipment', 321: 'Change Class', 331: 'Enemy HP', 333: 'Enemy State',
        336: 'Enemy Transform', 339: 'Force Action', 340: 'Abort Battle', 351: 'Open Menu',
        352: 'Open Save', 353: 'Game Over', 354: 'Title Screen', 355: 'Script', 655: 'Script',
        356: 'Plugin Command', 0: '(end)'
    };

    //-------------------------------------------------------------------------
    // Recent switch / variable changes

    var recent = [];
    function remember(text) {
        recent.unshift(text);
        if (recent.length > RECENT) recent.length = RECENT;
    }
    function nameOf(list, id) {
        var name = $dataSystem && list[id];
        return name ? ' ' + name : '';
    }

    var _Switches_setValue = Game_Switches.prototype.setValue;
    Game_Switches.prototype.setValue = function(id, value) {
        var before = this.value(id);
        _Switches_setValue.call(this, id, value);
        if (before !== this.value(id)) {
            remember('S' + id + nameOf($dataSystem.switches, id) + ' = ' + (value ? 'ON' : 'OFF'));
        }
    };

    var _Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function(id, value) {
        var before = this.value(id);
        _Variables_setValue.call(this, id, value);
        if (before !== this.value(id)) {
            remember('V' + id + nameOf($dataSystem.variables, id) + ' = ' + this.value(id) + ' (was ' + before + ')');
        }
    };

    var _SelfSwitches_setValue = Game_SelfSwitches.prototype.setValue;
    Game_SelfSwitches.prototype.setValue = function(key, value) {
        var before = this.value(key);
        _SelfSwitches_setValue.call(this, key, value);
        if (before !== this.value(key)) {
            remember('self ' + key[2] + ' map' + key[0] + ' ev' + key[1] + ' = ' + (value ? 'ON' : 'OFF'));
        }
    };

    // A new game or a loaded save starts the list over.
    var _setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        recent = [];
        _setupNewGame.call(this);
    };
    var _extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        recent = [];
        _extractSaveContents.call(this, contents);
    };

    //-------------------------------------------------------------------------
    // Info gathering

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function clock() {
        var d = new Date();
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
               pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    }

    function eventLabel(event) {
        var data = event.event();
        return 'ev' + event.eventId() + ' "' + (data ? data.name : '?') + '" p' + (event._pageIndex + 1);
    }

    function eventsAt(x, y) {
        return $gameMap.eventsXy(x, y).map(eventLabel).join(', ');
    }

    function commandText(list, index) {
        var cmd = list && list[index];
        if (!cmd) return 'line ' + (index + 1) + ' (end)';
        var text = 'line ' + (index + 1) + ' ' + (CODES[cmd.code] || 'code ' + cmd.code);
        if (cmd.code === 117) text += ' ' + cmd.parameters[0];
        if (cmd.code === 230) text += ' ' + cmd.parameters[0];
        if (cmd.code === 356) text += ' ' + cmd.parameters[0];
        if (cmd.code === 401) text += ' "' + String(cmd.parameters[0]).slice(0, 24) + '"';
        return text;
    }

    // Common events don't record their own id, so match the list against the database.
    function commonEventId(list) {
        for (var i = 1; i < $dataCommonEvents.length; i++) {
            if ($dataCommonEvents[i] && $dataCommonEvents[i].list === list) return i;
        }
        return 0;
    }

    function interpreterLines(interpreter, label) {
        var lines = [];
        var depth = 0;
        while (interpreter && interpreter.isRunning()) {
            var ce = commonEventId(interpreter._list);
            var who = ce ? 'CE' + ce + ' ' + $dataCommonEvents[ce].name :
                      interpreter._eventId ? 'ev' + interpreter._eventId : (depth ? 'child' : 'event');
            lines.push((depth ? '  '.repeat(depth) + '> ' : label) + who + '  ' +
                       commandText(interpreter._list, interpreter._index) +
                       (interpreter._waitMode ? '  wait:' + interpreter._waitMode : ''));
            interpreter = interpreter._childInterpreter;
            depth++;
        }
        return lines;
    }

    function battlerLine(b, name) {
        var states = b.states().map(function(s) { return s.id; });
        return name + ' HP ' + b.hp + '/' + b.mhp + ' MP ' + b.mp + '/' + b.mmp +
               (states.length ? ' st[' + states.join(',') + ']' : '') + (b.isDead() ? ' DEAD' : '');
    }

    function bufferState(buffer) {
        if (!buffer) return '-';
        var name = decodeURIComponent((buffer.url || '').split('/').pop());
        return name + ' ' + (buffer.isError() ? 'ERROR' : buffer.isReady() ? (buffer.isPlaying() ? 'playing' : 'ready') : 'loading');
    }

    function audioLines() {
        var context = WebAudio._context;
        return ['audio ' + (context ? context.state : 'NO CONTEXT') + '  ' + AudioManager.audioFileExt() +
                '  ' + (Utils.isMobileDevice() ? 'mobile' : 'desktop') + '  vol ' + AudioManager.bgmVolume,
                'bgm ' + bufferState(AudioManager._bgmBuffer) + '  bgs ' + bufferState(AudioManager._bgsBuffer)];
    }

    function buildLines() {
        var scene = SceneManager._scene;
        var lines = [];
        lines.push(clock() + '  frame ' + Graphics.frameCount +
                   '  ' + (scene ? scene.constructor.name : '-'));
        lines = lines.concat(audioLines());
        if (!$gameSystem || !$gameMap || !$dataMap) return lines;

        lines.push('play ' + $gameSystem.playtimeText() + '  saves ' + $gameSystem.saveCount() +
                   '  gold ' + $gameParty.gold() + '  steps ' + $gameParty.steps());

        var mapId = $gameMap.mapId();
        var info = $dataMapInfos[mapId];
        lines.push('MAP ' + mapId + ' "' + (info ? info.name : '?') + '"' +
                   ($gameMap.displayName() ? ' (' + $gameMap.displayName() + ')' : ''));

        var p = $gamePlayer;
        var x = p.x, y = p.y, d = p.direction();
        lines.push('player ' + x + ',' + y + ' ' + DIRS[d] + '  region ' + $gameMap.regionId(x, y) +
                   '  terrain ' + $gameMap.terrainTag(x, y) +
                   (p.isInVehicle() ? '  vehicle ' + p._vehicleType : '') +
                   (p.isTransferring() ? '  -> map ' + p._newMapId + ' ' + p._newX + ',' + p._newY : ''));
        var under = eventsAt(x, y);
        if (under) lines.push('on    ' + under);
        var front = eventsAt($gameMap.roundXWithDirection(x, d), $gameMap.roundYWithDirection(y, d));
        if (front) lines.push('front ' + front);

        var running = $gameParty.inBattle() ? $gameTroop._interpreter : $gameMap._interpreter;
        lines = lines.concat(interpreterLines(running, 'RUN '));

        $gameMap._commonEvents.forEach(function(ce) {
            if (ce.isActive() && ce._interpreter) {
                lines = lines.concat(interpreterLines(ce._interpreter, 'PAR '));
            }
        });
        $gameMap.events().forEach(function(ev) {
            if (ev._interpreter && ev._interpreter.isRunning()) {
                lines = lines.concat(interpreterLines(ev._interpreter, 'PAR '));
            }
        });

        if ($gameMessage.isBusy()) {
            lines.push('message' + ($gameMessage.faceName() ? ' face ' + $gameMessage.faceName() + ':' +
                       $gameMessage.faceIndex() : '') + ($gameMessage.isChoice() ? '  choices' : ''));
        }

        $gameParty.members().forEach(function(a) {
            lines.push(battlerLine(a, a.name() + ' Lv' + a.level));
        });

        if ($gameParty.inBattle()) {
            lines.push('BATTLE troop ' + $gameTroop._troopId + '  turn ' + $gameTroop.turnCount() +
                       '  phase ' + BattleManager._phase);
            $gameTroop.members().forEach(function(e) {
                lines.push(battlerLine(e, '  ' + e.name() + ' (id' + e.enemyId() + ')'));
            });
        }

        if (recent.length) {
            lines.push('recent:');
            recent.forEach(function(text) { lines.push('  ' + text); });
        }
        return lines;
    }

    //-------------------------------------------------------------------------
    // Overlay

    var overlay = null;

    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 118) { // F7
            visible = !visible;
            event.preventDefault();
        }
    });

    function update() {
        requestAnimationFrame(update);
        if (!overlay) {
            if (!document.body) return;
            overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;z-index:101;pointer-events:none;' +
                'font-family:monospace;line-height:1.3;color:#fff;background:rgba(0,0,0,0.65);padding:3px 6px;' +
                'white-space:pre;overflow:hidden;';
            document.body.appendChild(overlay);
        }
        overlay.style.display = visible ? '' : 'none';
        if (!visible) return;
        // Stick to the game screen's top-right corner (not the window's, which is off in
        // the black bars when fullscreen), and scale with the game.
        if (Graphics._canvas) {
            var rect = Graphics._canvas.getBoundingClientRect();
            var scale = rect.width / Graphics.width || 1;
            overlay.style.right = (window.innerWidth - rect.right + 4) + 'px';
            overlay.style.top = (rect.top + 4) + 'px';
            overlay.style.fontSize = Math.round(12 * scale) + 'px';
            overlay.style.maxWidth = (rect.width * 0.6) + 'px';
            overlay.style.maxHeight = (rect.height - 8) + 'px';
        }
        var text;
        try {
            text = buildLines().join('\n');
        } catch (e) {
            text = 'DebugInfo error: ' + e.message;
        }
        if (overlay.textContent !== text) overlay.textContent = text;
    }
    requestAnimationFrame(update);
})();
