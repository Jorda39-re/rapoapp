var fs = require('fs');
var path = require('path');
var FICHYE = path.join(__dirname, 'index.tsx');
var kode = fs.readFileSync(FICHYE, 'utf8');
var ok = 0, erer = 0;
function cheke(kondisyon, msg) {
  if (kondisyon) { console.log('[OK] ' + msg); ok++; }
  else { console.log('[ERER] Manke: ' + msg); erer++; }
}
cheke(kode.indexOf('ElurixRapo') >= 0, 'ElurixRapo');
cheke(kode.indexOf('Elurix Tec') >= 0, 'Elurix Tec');
cheke(kode.indexOf('Jordany Elusma') >= 0, 'Jordany Elusma');
cheke(kode.indexOf('useRef') >= 0, 'useRef');
cheke(kode.indexOf('Modal') >= 0, 'Modal');
cheke(kode.indexOf('intervalRef') >= 0, 'intervalRef');
cheke(kode.indexOf('@total_minit') >= 0, '@total_minit');
cheke(kode.indexOf('@lis_vizit') >= 0, '@lis_vizit');
cheke(kode.indexOf('manyenStopSave') >= 0, 'manyenStopSave');
cheke(kode.indexOf('siprimeVizit') >= 0, 'siprimeVizit');
cheke(kode.indexOf('fomatTotal') >= 0, 'fomatTotal');
cheke(kode.indexOf("tabAktif === 'home'") >= 0, "tabAktif home");
cheke(kode.indexOf("tabAktif === 'rapo'") >= 0, "tabAktif rapo");
cheke(kode.indexOf('Tout dwa rezeve') >= 0, 'Tout dwa rezeve');
console.log('\nREZIME: ' + ok + ' OK | ' + erer + ' ERER');
if (erer === 0) console.log('KOD LA PRE POU APK!');
