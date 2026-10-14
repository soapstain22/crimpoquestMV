//=============================================================================
// MobileAudioFix.js
//=============================================================================

/*:
 * @plugindesc Gets sound working in iPhone / iPad Safari, where MV 1.6.2's audio unlock no longer works.
 *
 * @help
 * No settings. Put it anywhere in the plugin list.
 *
 * iOS only lets a web page start audio from inside a tap. MV tries to unlock audio
 * by playing an empty sound on touchstart (before the audio is resumed) and only
 * resumes on touchend, and it never recovers from Safari's "interrupted" state
 * (after a call, locking the phone, switching apps). On current iOS that leaves the
 * game silent.
 *
 * This plugin, on every tap / click / key press while audio isn't running:
 *   - resumes the audio context
 *   - plays a real one-sample silent sound, which is what actually unlocks iOS
 * It also asks iOS to treat the game as media playback, so it isn't muted by the
 * ringer switch (Safari 17+).
 *
 * Sound effects and MEs are decoded once and reused instead of being downloaded
 * and decoded on every play, which made them come in late on phones. Battle
 * animation sounds and the victory / defeat / game over MEs are preloaded on the
 * title screen.
 *
 * Does nothing in the desktop (NW.js) build, where audio is never locked.
 */

(function() {
    if (Utils.isNwjs()) return;

    if (navigator.audioSession) {
        try { navigator.audioSession.type = 'playback'; } catch (e) { /* older Safari */ }
    }

    function unlock() {
        var context = WebAudio._context;
        if (!context || context.state === 'running') return;
        if (typeof context.resume === 'function') context.resume();
        var source = context.createBufferSource();
        source.buffer = context.createBuffer(1, 1, 22050);
        source.connect(context.destination);
        source.start(0);
    }

    ['touchstart', 'touchend', 'pointerdown', 'pointerup', 'mousedown', 'click', 'keydown'].forEach(function(type) {
        document.addEventListener(type, unlock, true);
    });

    // Coming back to the tab after Safari interrupted the audio.
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) unlock();
    });

    //-------------------------------------------------------------------------
    // Sound effect cache
    //
    // MV downloads and decodes a sound effect again every time it plays. Phones
    // decode slowly, so sounds came in late. Sound effects and MEs are decoded
    // once and reused. BGM/BGS aren't cached: they're long, and a decoded minute
    // of music takes ~20 MB.

    //
    // A file that's missing or won't decode stays "loading" forever, the same as in
    // plain MV: marking it as an error would make MV stop with "Failed to load".

    var CACHED = /\/(se|me)\//;
    var cache = {};    // url -> { buffer, loopStart, loopLength } (seconds)
    var missing = {};  // url -> true once it 404'd or failed to decode
    var waiting = {};  // url -> callbacks(entry, networkError)

    function apply(audio, entry) {
        audio._buffer = entry.buffer;
        audio._totalTime = entry.buffer.duration;
        audio._loopStart = entry.loopStart;
        audio._loopLength = entry.loopLength;
    }

    function finish(url, entry, networkError) {
        var list = waiting[url] || [];
        delete waiting[url];
        if (entry) cache[url] = entry;
        else if (!networkError) missing[url] = true;
        list.forEach(function(callback) { callback(entry, networkError); });
    }

    // Loads url into the cache once; callback(entry, networkError) when it's done.
    function fetchSound(url, callback) {
        if (cache[url]) return callback(cache[url], false);
        if (missing[url]) return callback(null, false);
        if (waiting[url]) return waiting[url].push(callback);
        waiting[url] = [callback];
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
            if (xhr.status >= 400) return finish(url, null, false);
            var probe = Object.create(WebAudio.prototype);  // only used to read the loop tags
            probe._loopStart = probe._loopLength = probe._sampleRate = 0;
            probe._readLoopComments(new Uint8Array(xhr.response));
            WebAudio._context.decodeAudioData(xhr.response, function(buffer) {
                var loopStart = 0, loopLength = buffer.duration;
                if (probe._loopLength > 0 && probe._sampleRate > 0) {
                    loopStart = probe._loopStart / probe._sampleRate;
                    loopLength = probe._loopLength / probe._sampleRate;
                }
                finish(url, { buffer: buffer, loopStart: loopStart, loopLength: loopLength }, false);
            }, function() { finish(url, null, false); });
        };
        xhr.onerror = function() { finish(url, null, true); };
        xhr.send();
    }

    var _WebAudio_load = WebAudio.prototype._load;
    WebAudio.prototype._load = function(url) {
        if (!WebAudio._context || Decrypter.hasEncryptedAudio || !CACHED.test(url)) {
            return _WebAudio_load.call(this, url);
        }
        var audio = this, sync = true;
        fetchSound(url, function(entry, networkError) {
            if (entry) {
                apply(audio, entry);           // when cached this runs right away,
                if (!sync) audio._onLoad();    // so play() starts immediately
            } else if (networkError) {
                if (audio._loader) audio._loader();  // MV's own retry, then its error screen
                else audio._hasError = true;
            }
        });
        sync = false;
    };

    // Warm the cache on the title screen with the sounds battles use, a few at a time.
    var preloaded = false;
    function preload() {
        if (preloaded || !WebAudio._context) return;
        preloaded = true;
        var urls = {};
        var add = function(folder, name) {
            if (name) urls[AudioManager._path + folder + '/' + encodeURIComponent(name) + AudioManager.audioFileExt()] = true;
        };
        $dataAnimations.forEach(function(animation) {
            if (animation) animation.timings.forEach(function(timing) { if (timing.se) add('se', timing.se.name); });
        });
        [$dataSystem.victoryMe, $dataSystem.defeatMe, $dataSystem.gameoverMe].forEach(function(me) {
            if (me) add('me', me.name);
        });
        var queue = Object.keys(urls);
        var next = function() {
            var url = queue.shift();
            if (url) fetchSound(url, next);
        };
        for (var i = 0; i < 4; i++) next();
    }

    var _Scene_Title_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        _Scene_Title_start.call(this);
        preload();
    };
})();