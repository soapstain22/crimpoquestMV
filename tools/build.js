// Builds the game into Steam ContentBuilder's content folder, and optionally uploads it.
// Usage: node tools/build.js [--playtest] [--upload --user <steam login>] [--itch] [--content <dir>] [--desc "<text>"] [--keep-unused]
//
// Only content/www is replaced. The NW.js runtime next to it (Game.exe, nw.dll, root
// package.json, ...) is left alone.
// --upload runs steamcmd with the login you give. It never takes a password: log in once
// by hand with `steamcmd +login <user>` so the credentials are cached, then builds reuse them.
// Builds target the released game unless --playtest is given; the shipped plugins.js gets that app's ID.
const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const STEAM = 'C:\\Users\\pooper\\Downloads\\STEAMTOOLS\\sdk\\tools\\ContentBuilder';
const RELEASE = { app: '4192470', depot: '4192471' }; // CRIMPO QUEST (Windows depot)
const PLAYTEST = { app: '4773020', depot: '4773021' }; // CRIMPO QUEST Playtest
const BUTLER = process.env.BUTLER || 'C:\\Users\\pooper\\butler\\butler.exe';
const ITCH_TARGET = 'superpizza/crimpo-quest:html5';

const argv = process.argv.slice(2);
const TARGET = argv.includes('--playtest') ? PLAYTEST : RELEASE;
const APP_ID = TARGET.app;
const DEPOT_ID = TARGET.depot;
const opt = name => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
const CONTENT = path.resolve(opt('--content') || process.env.CRIMPO_CONTENT || path.join(STEAM, 'content'));
const WWW = path.join(CONTENT, 'www');

// What the game loads at runtime, relative to the project root.
const SHIP = ['index.html', 'package.json', 'greenworks.js', 'audio', 'data', 'fonts', 'icon', 'img', 'js', 'lib', 'movies'];
const SKIP_NAMES = new Set(['.DS_Store', 'Thumbs.db', 'desktop.ini', '.idea', '.gitignore', 'jsconfig.json']);
const SKIP_EXT = ['.aseprite', '.ase', '.psd', '.d.ts', '.lib'];
const SKIP_PATHS = [/^data[\\/]_[^\\/]*\.txt$/]; // editor logs like data/_log.txt

const problems = [];
const fail = msg => problems.push(msg);
const step = msg => console.log(`\n> ${msg}`);

// 1. Preflight: the editor rewrites data files on save, so don't build while it's open.
step('Preflight');
try {
  if (/RPGMV\.exe/i.test(execSync('tasklist', { encoding: 'utf8' }))) fail('RPG Maker MV is open. Save and close it first, or data may be half-written.');
} catch (e) { /* tasklist unavailable; skip */ }
if (!fs.existsSync(path.join(CONTENT, 'Game.exe'))) fail(`No Game.exe in ${CONTENT}. Is that the ContentBuilder content folder?`);
if (!fs.existsSync(path.join(CONTENT, 'package.json'))) fail(`No root package.json in ${CONTENT}; NW.js won't find www/index.html.`);

// 2. Validate data and plugins so a broken build never reaches Steam.
step('Checking data and plugins');
for (const f of fs.readdirSync(path.join(ROOT, 'data')).filter(f => f.endsWith('.json'))) {
  try { JSON.parse(fs.readFileSync(path.join(ROOT, 'data', f), 'utf8')); } catch (e) { fail(`data/${f} is not valid JSON: ${e.message}`); }
}
const pluginsSrc = fs.readFileSync(path.join(ROOT, 'js', 'plugins.js'), 'utf8');
const plugins = new Function(pluginsSrc + '\nreturn $plugins;')();
for (const p of plugins.filter(p => p.status)) {
  if (!fs.existsSync(path.join(ROOT, 'js', 'plugins', p.name + '.js'))) fail(`Plugin ${p.name} is enabled but js/plugins/${p.name}.js is missing.`);
}
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
for (const [, src] of html.matchAll(/src="([^"]+)"/g)) {
  if (!fs.existsSync(path.join(ROOT, src))) fail(`index.html loads ${src}, which doesn't exist.`);
}
console.log(`  ${plugins.filter(p => p.status).length} enabled plugins: ${plugins.filter(p => p.status).map(p => p.name).join(', ')}`);

// Assets count as used if their name appears anywhere in the data, the plugin list or an
// enabled plugin's code. Names built at runtime (e.g. 'toy' + n) won't be found, so check
// the "left out" list, or pass --keep-unused to ship everything.
const KEEP_UNUSED = argv.includes('--keep-unused');
const ASSET_DIRS = /^(audio|img|movies)[\\/]/;
const ALWAYS_KEEP = /^img[\\/]system[\\/]/; // the engine loads these by hard-coded names
const refs = [
  ...fs.readdirSync(path.join(ROOT, 'data')).filter(f => f.endsWith('.json')).map(f => path.join(ROOT, 'data', f)),
  ...plugins.filter(p => p.status).map(p => path.join(ROOT, 'js', 'plugins', p.name + '.js')),
  path.join(ROOT, 'js', 'plugins.js'),
  path.join(ROOT, 'index.html'),
].map(f => fs.readFileSync(f, 'utf8')).join('\n').toLowerCase();
const isUnused = rel => !KEEP_UNUSED && ASSET_DIRS.test(rel) && !ALWAYS_KEEP.test(rel)
  && !refs.includes(path.basename(rel, path.extname(rel)).toLowerCase());

if (problems.length) {
  console.error('\nBuild stopped:\n' + problems.map(p => '  - ' + p).join('\n'));
  process.exit(1);
}

// 3. Replace content/www with a fresh copy.
step(`Copying game to ${WWW}`);
if (path.basename(WWW) !== 'www' || !fs.existsSync(path.join(CONTENT, 'Game.exe'))) throw new Error('Refusing to delete ' + WWW);
fs.rmSync(WWW, { recursive: true, force: true });
let files = 0, bytes = 0;
const skipped = [], unused = [];
let unusedBytes = 0;
for (const entry of SHIP) {
  const src = path.join(ROOT, entry);
  if (!fs.existsSync(src)) continue;
  fs.cpSync(src, path.join(WWW, entry), {
    recursive: true,
    filter: from => {
      const rel = path.relative(ROOT, from);
      const name = path.basename(from);
      if (SKIP_NAMES.has(name) || SKIP_EXT.some(ext => name.endsWith(ext)) || SKIP_PATHS.some(re => re.test(rel))) {
        skipped.push(rel);
        return false;
      }
      const st = fs.statSync(from);
      if (st.isFile() && isUnused(rel)) {
        unused.push(rel);
        unusedBytes += st.size;
        return false;
      }
      if (st.isFile()) { files++; bytes += st.size; }
      return true;
    },
  });
}
// The Steamworks plugin's AppID has to match the app the build is uploaded to.
const appIdSetting = /("Steam AppID":")\d*(")/;
if (!appIdSetting.test(pluginsSrc)) throw new Error('No Steam AppID setting in js/plugins.js');
fs.writeFileSync(path.join(WWW, 'js', 'plugins.js'), pluginsSrc.replace(appIdSetting, '$1' + APP_ID + '$2'));
console.log(`  Target: app ${APP_ID}, depot ${DEPOT_ID}${TARGET === PLAYTEST ? ' (Playtest)' : ''}`);
console.log(`  ${files} files, ${(bytes / 1048576).toFixed(1)} MB (left out ${skipped.length} dev files)`);
if (unused.length) {
  console.log(`  Left out ${unused.length} unused assets (${(unusedBytes / 1048576).toFixed(1)} MB). --keep-unused ships them:`);
  for (const rel of unused) console.log('    ' + rel);
}

// 4. Label the build with the git commit.
let rev = 'unknown';
try {
  rev = execSync('git rev-parse --short HEAD', { cwd: ROOT, encoding: 'utf8' }).trim();
  const dirty = execSync('git status --porcelain -- data js img audio index.html', { cwd: ROOT, encoding: 'utf8' }).trim();
  if (dirty) { rev += '-dirty'; console.log('  Note: building uncommitted changes to game files.'); }
} catch (e) { /* not a git checkout */ }
const stamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
const desc = opt('--desc') || `crimpoquest ${rev} ${stamp}`;
fs.writeFileSync(path.join(WWW, 'build.txt'), `${desc}\n`);
console.log(`  Build: ${desc}`);


// 5. Optional uploads.
const toSteam = argv.includes('--upload'), toItch = argv.includes('--itch');
if (!toSteam && !toItch) {
  console.log(`\nDone. Content is ready in ${CONTENT}\nTo upload: node tools/build.js --upload --user <steam login> and/or --itch`);
  process.exit(0);
}
if (toSteam) {
  const user = opt('--user') || process.env.STEAM_USER;
  if (!user) { console.error('\n--upload needs --user <steam login> (or STEAM_USER).'); process.exit(1); }
  step('Uploading to Steam with steamcmd');
  const vdf = path.join(STEAM, 'scripts', 'crimpo_pipeline.vdf');
  fs.writeFileSync(vdf, `"AppBuild"
{
	"AppID" "${APP_ID}"
	"Desc" "${desc.replace(/"/g, "'")}"
	"verbose" "0"
	"preview" "0"
	"ContentRoot" "${CONTENT}\\"
	"BuildOutput" "..\\output\\"
	"Depots"
	{
		"${DEPOT_ID}"
		{
			"FileMapping"
			{
				"LocalPath" "*"
				"DepotPath" "."
				"recursive" "1"
			}
			"FileExclusion" "chromedriver.exe"
			"FileExclusion" "nwjc.exe"
		}
	}
}
`);
  const r = spawnSync(path.join(STEAM, 'builder', 'steamcmd.exe'), ['+login', user, '+run_app_build', vdf, '+quit'], { stdio: 'inherit' });
  if (r.status !== 0) { console.error(`\nsteamcmd exited with ${r.status}. Check ${path.join(STEAM, 'output')} for logs.`); process.exit(r.status || 1); }
  console.log('\nUploaded to Steam. The build is not live until you set it on a branch in Steamworks > Builds.');
}
// --itch pushes the same www folder as the browser version on itch.io. butler only sends
// what changed. Log in once with `butler login`.
if (toItch) {
  step(`Uploading to itch.io (${ITCH_TARGET}) with butler`);
  const r = spawnSync(BUTLER, ['push', WWW, ITCH_TARGET, '--userversion', rev], { stdio: 'inherit' });
  if (r.status !== 0) { console.error(`\nbutler exited with ${r.status}.`); process.exit(r.status || 1); }
  console.log('\nUploaded to itch.io. It goes live on the page once itch finishes processing it.');
}