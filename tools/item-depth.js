// Reports how many map transfers from the start map each item source sits.
// Usage: node tools/item-depth.js [--paths] [--maps] [--json]
//   --paths  print the shortest map route to each item's nearest source
//   --maps   print every map with its depth, then the maps spawn can't reach
//   --json   dump everything as JSON instead of text
const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'data');
const load = f => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
const args = new Set(process.argv.slice(2));

const system = load('System.json');
const infos = load('MapInfos.json');
const commonEvents = load('CommonEvents.json');
const troops = load('Troops.json');
const enemies = load('Enemies.json');
const actors = load('Actors.json');
const db = [load('Items.json'), load('Weapons.json'), load('Armors.json')];
const KIND = ['item', 'weapon', 'armor'];

const mapLabel = id => `${(infos[id] || {}).name || 'Map' + id} (${id})`;
const itemName = (k, id) => (db[k][id] || {}).name || `#${id}`;
const itemKey = (k, id) => `${k}:${id}`;

// Walks an event command list, following Common Event calls (code 117).
function walk(list, visit, seenCE = new Set()) {
  for (const c of list || []) {
    visit(c);
    if (c.code === 117 && !seenCE.has(c.parameters[0])) {
      seenCE.add(c.parameters[0]);
      const ce = commonEvents[c.parameters[0]];
      if (ce) walk(ce.list, visit, seenCE);
    }
  }
}

// Per map: outgoing transfers and item sources.
const maps = {};
for (const f of fs.readdirSync(DATA).filter(f => /^Map\d+\.json$/.test(f))) {
  const id = +f.slice(3, 6);
  const m = load(f);
  const node = { id, edges: [], sources: [] };
  maps[id] = node;
  const troopIds = new Set();
  for (const ev of m.events || []) {
    if (!ev) continue;
    const where = `${ev.name} @${ev.x},${ev.y}`;
    for (const page of ev.pages) {
      walk(page.list, c => {
        const p = c.parameters;
        if (c.code === 201 && p[0] === 0) node.edges.push({ to: p[1], via: where });
        if ([126, 127, 128].includes(c.code) && p[1] === 0) {
          const k = c.code - 126;
          node.sources.push({ k, id: p[0], how: 'event', where });
        }
        if (c.code === 302 || c.code === 605) {
          node.sources.push({ k: p[0], id: p[1], how: 'shop', where });
        }
        if (c.code === 301 && p[0] === 0) troopIds.add(p[1]);
      });
    }
  }
  for (const e of m.encounterList || []) troopIds.add(e.troopId);
  for (const t of troopIds) {
    for (const mem of (troops[t] || { members: [] }).members) {
      const en = enemies[mem.enemyId];
      for (const d of en.dropItems) {
        if (d.kind) node.sources.push({ k: d.kind - 1, id: d.dataId, how: `drop 1/${d.denominator}`, where: `${en.name}, troop ${t}` });
      }
    }
  }
}

// Breadth-first search from the start map; depth = number of transfers.
const depth = { [system.startMapId]: 0 };
const parent = {};
const queue = [system.startMapId];
while (queue.length) {
  const cur = queue.shift();
  for (const e of (maps[cur] || { edges: [] }).edges) {
    if (e.to in depth) continue;
    depth[e.to] = depth[cur] + 1;
    parent[e.to] = { from: cur, via: e.via };
    queue.push(e.to);
  }
}
const route = id => {
  const steps = [];
  for (let at = id; at in parent; at = parent[at].from) steps.unshift(`${mapLabel(parent[at].from)} -[${parent[at].via}]-> `);
  return steps.join('') + mapLabel(id);
};

// Collect every source of every item, then pick the shallowest.
const items = {};
const add = (k, id, src) => {
  const key = itemKey(k, id);
  (items[key] = items[key] || { kind: KIND[k], name: itemName(k, id), sources: [] }).sources.push(src);
};
for (const actorId of system.partyMembers) {
  const a = actors[actorId];
  a.equips.forEach((e, slot) => e && add(slot === 0 ? 1 : 2, e, { how: 'starting equip', where: a.name, map: null, depth: 0 }));
}
for (const node of Object.values(maps)) {
  for (const s of node.sources) {
    add(s.k, s.id, { how: s.how, where: s.where, map: node.id, depth: node.id in depth ? depth[node.id] : null });
  }
}
// Items and skills that run a Common Event (effect 44) that grants items.
const ceGrants = id => {
  const out = [];
  walk((commonEvents[id] || {}).list, c => {
    if ([126, 127, 128].includes(c.code) && c.parameters[1] === 0) out.push([c.code - 126, c.parameters[0]]);
  }, new Set([id]));
  return out;
};
const triggers = [];
db[0].forEach((x, id) => x && x.effects.forEach(e => e.code === 44 && triggers.push({ by: itemKey(0, id), label: `use ${x.name}`, ce: e.dataId })));
load('Skills.json').forEach(x => x && x.effects.forEach(e => e.code === 44 && triggers.push({ by: null, label: `skill ${x.name}`, ce: e.dataId })));
for (const t of triggers) {
  for (const [k, id] of ceGrants(t.ce)) {
    add(k, id, { how: t.label, where: `CE ${t.ce} ${commonEvents[t.ce].name}`, map: null, depth: null, by: t.by });
  }
}
// A use-item source is as deep as the item that triggers it; repeat until nothing changes.
const best = it => Math.min(...it.sources.map(s => s.depth ?? Infinity));
for (let changed = true; changed;) {
  changed = false;
  for (const it of Object.values(items)) {
    for (const s of it.sources) {
      if (!s.by || !items[s.by]) continue;
      const d = best(items[s.by]);
      if (d !== Infinity && s.depth !== d) { s.depth = d; changed = true; }
    }
  }
}
for (const it of Object.values(items)) {
  it.sources.sort((a, b) => (a.depth ?? Infinity) - (b.depth ?? Infinity));
  it.depth = it.sources[0].depth;
}
db.forEach((table, k) => table.forEach((x, id) => {
  if (x && x.name && !items[itemKey(k, id)]) items[itemKey(k, id)] = { kind: KIND[k], name: x.name, sources: [], depth: null };
}));
const sorted = Object.values(items).sort((a, b) => (a.depth ?? Infinity) - (b.depth ?? Infinity) || a.name.localeCompare(b.name));

if (args.has('--mermaid')) {
  // Shortest-route tree from spawn, one column per depth, each map listing what it gives.
  const tag = { event: 'pickup', shop: 'shop' };
  const lines = ['%%{init: {"flowchart": {"useMaxWidth": false}}}%%', 'flowchart LR'];
  const byDepth = {};
  for (const [id, d] of Object.entries(depth)) (byDepth[d] = byDepth[d] || []).push(+id);
  for (const [d, ids] of Object.entries(byDepth)) {
    lines.push(`  subgraph D${d}["depth ${d}"]`, '    direction TB');
    for (const id of ids.sort((a, b) => a - b)) {
      const groups = {};
      for (const s of (maps[id] || { sources: [] }).sources) {
        const g = tag[s.how] || 'drop';
        const label = `${'IWA'[s.k]} ${itemName(s.k, s.id)}${g === 'drop' ? ' ' + s.how.slice(5) : ''}`;
        (groups[g] = groups[g] || new Set()).add(label);
      }
      const body = Object.entries(groups).map(([g, set]) => `<b>${g}</b><br/>${[...set].join('<br/>')}`).join('<br/>');
      const name = mapLabel(id).replace(/"/g, "'");
      lines.push(`    m${id}["<b>${name}</b>${body ? '<br/>' + body.replace(/"/g, "'") : ''}"]`);
      lines.push(`    class m${id} ${body ? 'loot' : 'empty'}`);
    }
    lines.push('  end');
  }
  for (const [to, p] of Object.entries(parent)) lines.push(`  m${p.from} --> m${to}`);
  lines.push(`  class m${system.startMapId} spawn`);
  lines.push('  classDef loot stroke-width:2px', '  classDef empty opacity:0.55', '  classDef spawn stroke-width:3px');
  console.log(lines.join('\n'));
  process.exit(0);
}

if (args.has('--json')) {
  console.log(JSON.stringify({ start: system.startMapId, mapDepth: depth, items: sorted }, null, 2));
  process.exit(0);
}

console.log(`Start: ${mapLabel(system.startMapId)}   depth = map transfers from spawn\n`);
for (const it of sorted) {
  const d = it.depth === null ? (it.sources.length ? 'unreachable' : 'no source') : `d${it.depth}`;
  const best = it.sources[0];
  const at = best ? `${best.how} · ${best.map ? mapLabel(best.map) + ' · ' : ''}${best.where}` : '';
  const more = it.sources.length > 1 ? `  (+${it.sources.length - 1} more)` : '';
  console.log(`${d.padEnd(12)} ${it.kind.padEnd(7)} ${it.name.padEnd(22)} ${at}${more}`);
  if (args.has('--paths') && best && best.map && best.depth !== null) console.log(`${' '.repeat(21)}route: ${route(best.map)}`);
}

if (args.has('--maps')) {
  console.log('\nMap depths:');
  Object.entries(depth).sort((a, b) => a[1] - b[1]).forEach(([id, d]) => console.log(`  d${d}  ${mapLabel(+id)}`));
  const cut = Object.keys(maps).filter(id => !(id in depth)).map(id => mapLabel(+id));
  console.log(`\nNot reachable by transfers from spawn (${cut.length}): ${cut.join(', ')}`);
}
