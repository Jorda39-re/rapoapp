import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert, Animated, Dimensions, Linking, Modal, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';

const { width } = Dimensions.get('window');

interface Vizit {
  id: string; non: string; adres: string; tel: string; sijeTePale: string; sijePralPale: string; jouTounen: string; kantite: number; dat?: string;
}
interface Etid {
  id: string; non: string; liv: string; tel: string; sijeTePale: string; sijePralPale: string; jouTounen: string; kantite: number; dat?: string;
}

export default function ElurixRapo() {
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-width))[0];
  const [tabAktif, setTabAktif] = useState('home');

  const [mwaChwazi, setMwaChwazi] = useState('Janvye');
  const [jouChwazi, setJouChwazi] = useState('Lendi');
  const [leTotalMwa, setLeTotalMwa] = useState(0);
  const [notSèvis, setNotSèvis] = useState('');

  const [modalAjouteLe, setModalAjouteLe] = useState(false);
  const [leManyelHè, setLeManyelHè] = useState('');
  const [leManyelMin, setLeManyelMin] = useState('');

  const [lisVizit, setLisVizit] = useState<Vizit[]>([]);
  const [lisEtid, setLisEtid] = useState<Etid[]>([]);

  const [nouvoVizit, setNouvoVizit] = useState({ non: '', adres: '', tel: '', sijeTePale: '', sijePralPale: '', jouTounen: '' });
  const [nouvoEtid, setNouvoEtid] = useState({ non: '', liv: '', tel: '', sijeTePale: '', sijePralPale: '', jouTounen: '' });
  const [montreFòmVizit, setMontreFòmVizit] = useState(true);
  const [montreFòmEtid, setMontreFòmEtid] = useState(true);
  const [dènyeVizit, setDènyeVizit] = useState<string | null>(null);
  const [dènyeEtid, setDènyeEtid] = useState<string | null>(null);

  const [gadeIstorikVizit, setGadeIstorikVizit] = useState(false);
  const [gadeIstorikEtid, setGadeIstorikEtid] = useState(false);

  const [segond, setSegond] = useState(0);
  const [kouri, setKouri] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const chacheDone = async () => {
      try {
        const t = await AsyncStorage.getItem('@total_minit');
        const v = await AsyncStorage.getItem('@lis_vizit');
        const e = await AsyncStorage.getItem('@lis_etid');
        const n = await AsyncStorage.getItem('@not_sevis');
        const m = await AsyncStorage.getItem('@mwa_chwazi');
        const j = await AsyncStorage.getItem('@jou_chwazi');
        const s = await AsyncStorage.getItem('@cron_segond');
        const k = await AsyncStorage.getItem('@cron_kouri');
        if (t !== null) setLeTotalMwa(parseInt(t, 10));
        if (v) setLisVizit(JSON.parse(v));
        if (e) setLisEtid(JSON.parse(e));
        if (n) setNotSèvis(n);
        if (m) setMwaChwazi(m);
        if (j) setJouChwazi(j);
        if (s) setSegond(parseInt(s, 10));
        if (k === 'true') setKouri(true);
      } catch { console.log('Erè chajman done'); }
    };
    chacheDone();
  }, []);

  useEffect(() => { AsyncStorage.setItem('@total_minit', leTotalMwa.toString()); }, [leTotalMwa]);
  useEffect(() => { AsyncStorage.setItem('@lis_vizit', JSON.stringify(lisVizit)); }, [lisVizit]);
  useEffect(() => { AsyncStorage.setItem('@lis_etid', JSON.stringify(lisEtid)); }, [lisEtid]);
  useEffect(() => { AsyncStorage.setItem('@not_sevis', notSèvis); }, [notSèvis]);
  useEffect(() => { AsyncStorage.setItem('@mwa_chwazi', mwaChwazi); }, [mwaChwazi]);
  useEffect(() => { AsyncStorage.setItem('@jou_chwazi', jouChwazi); }, [jouChwazi]);
  useEffect(() => { AsyncStorage.setItem('@cron_segond', segond.toString()); }, [segond]);
  useEffect(() => { AsyncStorage.setItem('@cron_kouri', kouri.toString()); }, [kouri]);

  useEffect(() => {
    if (kouri) {
      intervalRef.current = setInterval(() => { setSegond(s => s + 1); }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [kouri]);

  const manyenStopSave = () => {
    setKouri(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const minit = Math.floor(segond / 60);
    if (minit < 1) {
      Alert.alert('Pa Ase Tan', 'Kwonomèt la pa rive 1 minit ankò.');
      setSegond(0);
      return;
    }
    const he = Math.floor(minit / 60);
    const min = minit % 60;
    const texte = he > 0 ? (he + 'h ' + min + 'min') : (min + 'min');
    Alert.alert('Tan Sove!', 'Ou fe ' + texte + ' jodi a. Li ajoute otomatikman nan total mwa a!', [{
      text: 'Ok', onPress: () => { setLeTotalMwa(prev => prev + minit); setSegond(0); }
    }]);
  };

  const konfimeAjouteLeManyel = () => {
    const h = parseInt(leManyelHè || '0', 10);
    const m = parseInt(leManyelMin || '0', 10);
    if (isNaN(h) || isNaN(m) || (h === 0 && m === 0)) {
      Alert.alert('Atansyon', 'Antre omwen 1 minit.');
      return;
    }
    const totalMin = h * 60 + m;
    setLeTotalMwa(prev => prev + totalMin);
    setLeManyelHè('');
    setLeManyelMin('');
    setModalAjouteLe(false);
    Alert.alert('Ajoute!', (h > 0 ? h + 'h ' : '') + (m > 0 ? m + 'min' : '') + ' ajoute nan total la.');
  };

  const retirerLe = () => {
    Alert.alert('Efase Total', 'Ou sèten ou vle mete total le a a 0?', [
      { text: 'Anile', style: 'cancel' },
      { text: 'Wi, Efase', style: 'destructive', onPress: () => setLeTotalMwa(0) }
    ]);
  };

  const siprimeVizit = (id: string, non: string) => {
    Alert.alert('Siprime Revizit', 'Ou sèten ou vle siprime «' + non + '»?', [
      { text: 'Anile', style: 'cancel' },
      { text: 'Siprime', style: 'destructive', onPress: () => setLisVizit(prev => prev.filter(i => i.id !== id)) }
    ]);
  };

  const siprimeEtid = (id: string, non: string) => {
    Alert.alert('Siprime Etidyan', 'Ou sèten ou vle siprime «' + non + '»?', [
      { text: 'Anile', style: 'cancel' },
      { text: 'Siprime', style: 'destructive', onPress: () => setLisEtid(prev => prev.filter(i => i.id !== id)) }
    ]);
  };

  const fomatTan = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
  };

  const fomatTotal = (minit: number) => {
    const h = Math.floor(minit / 60);
    const m = minit % 60;
    if (h === 0) return m + ' min';
    if (m === 0) return h + ' h';
    return h + ' h ' + m + ' min';
  };

  const chanjeKteVizit = (id: string, aksyon: 'plus' | 'minus') => {
    setLisVizit(prev => prev.map(item => {
      if (item.id === id) { const n = aksyon === 'plus' ? item.kantite + 1 : item.kantite - 1; return { ...item, kantite: n < 1 ? 1 : n }; }
      return item;
    }));
  };

  const chanjeKteEtid = (id: string, aksyon: 'plus' | 'minus') => {
    setLisEtid(prev => prev.map(item => {
      if (item.id === id) { const n = aksyon === 'plus' ? item.kantite + 1 : item.kantite - 1; return { ...item, kantite: n < 1 ? 1 : n }; }
      return item;
    }));
  };

  const ajouteVizit = () => {
    if (!nouvoVizit.non.trim()) { Alert.alert('Atansyon', 'Tanpri antre non moun nan.'); return; }
    const dat = jouChwazi + ' - ' + mwaChwazi;
    setLisVizit(prev => [...prev, { id: Date.now().toString(), ...nouvoVizit, kantite: 1, dat }]);
    setDènyeVizit(nouvoVizit.non);
    setNouvoVizit({ non: '', adres: '', tel: '', sijeTePale: '', sijePralPale: '', jouTounen: '' });
    setMontreFòmVizit(false);
  };

  const ajouteEtid = () => {
    if (!nouvoEtid.non.trim()) { Alert.alert('Atansyon', 'Tanpri antre non etidyan an.'); return; }
    const dat = jouChwazi + ' - ' + mwaChwazi;
    setLisEtid(prev => [...prev, { id: Date.now().toString(), ...nouvoEtid, kantite: 1, dat }]);
    setDènyeEtid(nouvoEtid.non);
    setNouvoEtid({ non: '', liv: '', tel: '', sijeTePale: '', sijePralPale: '', jouTounen: '' });
    setMontreFòmEtid(false);
  };

  const voyeRapòWhatsApp = () => {
    const vizitYo = lisVizit.map(v =>
      '   - ' + v.non + ' (' + v.kantite + ' vizit)' + (v.adres ? ' [' + v.adres + ']' : '') +
      '\n     Tel: ' + (v.tel || '-') + '\n     Sije: ' + (v.sijeTePale || '-') +
      '\n     Pwochen: ' + (v.sijePralPale || '-') + '\n     Retou: ' + (v.jouTounen || '-')
    ).join('\n\n');
    const etidYo = lisEtid.map(e =>
      '   - ' + e.non + ' (' + e.kantite + ' leson)' + (e.liv ? ' — ' + e.liv : '') +
      '\n     Tel: ' + (e.tel || '-') + '\n     Sije: ' + (e.sijeTePale || '-') +
      '\n     Pwochen: ' + (e.sijePralPale || '-') + '\n     Retou: ' + (e.jouTounen || '-')
    ).join('\n\n');
    const mesaj =
      '*RAPO SEVIS - ' + mwaChwazi.toUpperCase() + '*\n\n' +
      'Total Le: ' + fomatTotal(leTotalMwa) + '\n\n' +
      'Revizit (' + lisVizit.length + '):\n' + (vizitYo || '   -') + '\n\n' +
      'Etid Biblik (' + lisEtid.length + '):\n' + (etidYo || '   -') + '\n\n' +
      'Not: ' + (notSèvis || '-') + '\n\n' +
      '_Elurix Tec — Tout dwa rezeve_';
    Linking.openURL('whatsapp://send?text=' + encodeURIComponent(mesaj));
  };

  const toggleMenu = () => {
    Animated.timing(slideAnim, { toValue: menuOpen ? -width : 0, duration: 300, useNativeDriver: false }).start(() => setMenuOpen(!menuOpen));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F2F5' }}>

      <Modal visible={modalAjouteLe} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Ajoute Le Manyelman</Text>
            <Text style={styles.modalSub}>Antre kantite le ou fe a:</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Ze (h)</Text>
                <TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={leManyelHè} onChangeText={setLeManyelHè} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Minit (min)</Text>
                <TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={leManyelMin} onChangeText={setLeManyelMin} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#EEE' }]} onPress={() => { setModalAjouteLe(false); setLeManyelHè(''); setLeManyelMin(''); }}>
                <Text style={{ color: '#2D3436', fontWeight: 'bold' }}>Anile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#0984E3', flex: 2 }]} onPress={konfimeAjouteLeManyel}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Konfime</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Animated.View style={[styles.drawer, { left: slideAnim }]}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Elurix Tec</Text>
          <TouchableOpacity onPress={toggleMenu}><Ionicons name="close" size={30} color="white" /></TouchableOpacity>
        </View>
        <ScrollView style={styles.manualBox} showsVerticalScrollIndicator={false}>
          <Text style={styles.manualHeader}>Kijan App la travay?</Text>
          <Text style={styles.manualStep}>1. Dat ak Jou: Chwazi mwa ak jou w ap travay la an premye.</Text>
          <Text style={styles.manualStep}>2. Kwonomet: Peze Komanse le w nan sevis. Peze Save pou ajoute tan sa a otomatikman nan total la.</Text>
          <Text style={styles.manualStep}>3. Ajoute Le Direkteman: Peze bouton Ajoute Le pou mete le manyelman san kwonomet.</Text>
          <Text style={styles.manualStep}>4. Revizit ak Etid: Antre enfòmasyon moun nan.</Text>
          <Text style={styles.manualStep}>5. Siprime: Selman ou ka siprime yon moun — app la mande konfirmasyon anvan.</Text>
          <Text style={styles.manualStep}>6. Done Pèsistan: Tout done yo rete entak le w soti sou app la.</Text>
          <Text style={styles.manualStep}>7. Voye Rapo: Peze bouton vèt la pou voye rapo fòmate sou WhatsApp.</Text>
        </ScrollView>
        <View style={styles.devBox}>
          <Text style={styles.devText}>App sa kreye pa</Text>
          <Text style={styles.devName}>ELURIX TEC</Text>
          <Text style={styles.devCeo}>CEO: Jordany Elusma (Jordany Dev)</Text>
          <Text style={styles.devCopy}>Tout dwa rezeve</Text>
        </View>
      </Animated.View>

      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleMenu}><Ionicons name="menu" size={30} color="white" /></TouchableOpacity>
        <Text style={styles.topBarTitle}>Elurix Rapo v4</Text>
        <View style={{ width: 30 }} />
      </View>

      {tabAktif === 'home' && (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dat ak Jou</Text>
            <Text style={styles.label}>Chwazi Mwa:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {['Janvye','Fevriye','Mas','Avril','Me','Jen','Jiye','Out','Septanm','Oktob','Novanm','Desanm'].map(m => (
                <TouchableOpacity key={m} style={[styles.pill, mwaChwazi === m && styles.pillActive]} onPress={() => setMwaChwazi(m)}>
                  <Text style={[styles.pillText, mwaChwazi === m && styles.pillTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.label}>Chwazi Jou:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Dimanch','Lendi','Madi','Mekredi','Jedi','Vandredi','Samdi'].map(j => (
                <TouchableOpacity key={j} style={[styles.pill, jouChwazi === j && styles.pillActiveJou]} onPress={() => setJouChwazi(j)}>
                  <Text style={[styles.pillText, jouChwazi === j && styles.pillTextActive]}>{j}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={[styles.card, { backgroundColor: '#E3FAFB' }]}>
            <Text style={styles.cardTitle}>Kontwole Tan w</Text>
            <Text style={styles.timerText}>{fomatTan(segond)}</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={[styles.btnActionTimer, { flex: 2, backgroundColor: kouri ? '#FF9F43' : '#00B894' }]} onPress={() => setKouri(!kouri)}>
                <Text style={styles.btnText}>{kouri ? 'Poz (Pause)' : 'Komanse'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnActionTimer, { flex: 1, backgroundColor: '#D63031' }]} onPress={manyenStopSave}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.timerHint}>Peze Save — tan an ajoute otomatikman nan total la</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total Mwa a</Text>
            <View style={styles.totalDisplay}>
              <Text style={styles.totalDisplayText}>{fomatTotal(leTotalMwa)}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <TouchableOpacity style={[styles.btnTotalAksyon, { backgroundColor: '#0984E3', flex: 2 }]} onPress={() => setModalAjouteLe(true)}>
                <Ionicons name="add-circle-outline" size={18} color="white" />
                <Text style={[styles.btnText, { marginLeft: 6 }]}>Ajoute Le</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnTotalAksyon, { backgroundColor: '#D63031', flex: 1 }]} onPress={retirerLe}>
                <Ionicons name="trash-outline" size={18} color="white" />
                <Text style={[styles.btnText, { marginLeft: 4 }]}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {tabAktif === 'rapo' && (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.cardTitle}>Revizit ({lisVizit.length})</Text>
              <TouchableOpacity style={styles.btnHistoryToggle} onPress={() => setGadeIstorikVizit(!gadeIstorikVizit)}>
                <Text style={styles.btnHistoryToggleText}>{gadeIstorikVizit ? 'Kache' : 'Istorik'}</Text>
              </TouchableOpacity>
            </View>
            {gadeIstorikVizit && (
              <View style={styles.historyContainer}>
                {lisVizit.length === 0 ? <Text style={styles.emptyText}>Pa gen revizit ankò.</Text> : null}
                {lisVizit.map(v => (
                  <View key={v.id} style={styles.historyItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.listName}>{v.non}</Text>
                      <Text style={styles.listSub}>Tel: {v.tel || '-'} | Adr: {v.adres || '-'}</Text>
                      <Text style={styles.listSubText}>Te pale: {v.sijeTePale || '-'}</Text>
                      <Text style={styles.listSubText}>Pral pale: {v.sijePralPale || '-'}</Text>
                      <Text style={styles.listSubText}>Tounen: <Text style={{ fontWeight: 'bold', color: '#E17055' }}>{v.jouTounen || '-'}</Text></Text>
                    </View>
                    <View style={styles.counterBox}>
                      <TouchableOpacity onPress={() => chanjeKteVizit(v.id, 'minus')} style={styles.counterBtn}><Text style={styles.counterBtnText}>-</Text></TouchableOpacity>
                      <Text style={styles.counterValue}>{v.kantite}</Text>
                      <TouchableOpacity onPress={() => chanjeKteVizit(v.id, 'plus')} style={styles.counterBtn}><Text style={styles.counterBtnText}>+</Text></TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => siprimeVizit(v.id, v.non)} style={{ marginLeft: 10 }}>
                      <Ionicons name="trash-outline" size={22} color="#D63031" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            {!montreFòmVizit && dènyeVizit && (
              <View style={styles.successBox}>
                <View style={styles.successRow}>
                  <Ionicons name="checkmark-circle" size={22} color="#00B894" />
                  <Text style={styles.successText}> {dènyeVizit} ajoute!</Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.btnLot} onPress={() => { setDènyeVizit(null); setMontreFòmVizit(true); }}>
                    <Text style={styles.btnLotText}>Ajoute yon lot</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnFini} onPress={() => { setDènyeVizit(null); setGadeIstorikVizit(true); }}>
                    <Text style={styles.btnFiniText}>Fini</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {montreFòmVizit && (
              <View style={styles.fomBox}>
                <TextInput style={styles.input} placeholder="Nom moun nan *" value={nouvoVizit.non} onChangeText={t => setNouvoVizit({ ...nouvoVizit, non: t })} />
                <TextInput style={styles.input} placeholder="Adres moun nan" value={nouvoVizit.adres} onChangeText={t => setNouvoVizit({ ...nouvoVizit, adres: t })} />
                <TextInput style={styles.input} placeholder="Tel moun nan" keyboardType="phone-pad" value={nouvoVizit.tel} onChangeText={t => setNouvoVizit({ ...nouvoVizit, tel: t })} />
                <TextInput style={styles.input} placeholder="Sije nou te pale" value={nouvoVizit.sijeTePale} onChangeText={t => setNouvoVizit({ ...nouvoVizit, sijeTePale: t })} />
                <TextInput style={styles.input} placeholder="Sije nou pral pale" value={nouvoVizit.sijePralPale} onChangeText={t => setNouvoVizit({ ...nouvoVizit, sijePralPale: t })} />
                <TextInput style={styles.input} placeholder="Ki jou nou ap tounen" value={nouvoVizit.jouTounen} onChangeText={t => setNouvoVizit({ ...nouvoVizit, jouTounen: t })} />
                <TouchableOpacity style={styles.btnAjoute} onPress={ajouteVizit}>
                  <Text style={styles.btnText}>AJOUTE REVIZIT LA</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.cardTitle}>Etid Biblik ({lisEtid.length})</Text>
              <TouchableOpacity style={[styles.btnHistoryToggle, { borderColor: '#6C5CE7' }]} onPress={() => setGadeIstorikEtid(!gadeIstorikEtid)}>
                <Text style={[styles.btnHistoryToggleText, { color: '#6C5CE7' }]}>{gadeIstorikEtid ? 'Kache' : 'Istorik'}</Text>
              </TouchableOpacity>
            </View>
            {gadeIstorikEtid && (
              <View style={styles.historyContainer}>
                {lisEtid.length === 0 ? <Text style={styles.emptyText}>Pa gen etidyan ankò.</Text> : null}
                {lisEtid.map(e => (
                  <View key={e.id} style={styles.historyItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.listName}>{e.non}</Text>
                      <Text style={styles.listSub}>Tel: {e.tel || '-'} | Liv: {e.liv || '-'}</Text>
                      <Text style={styles.listSubText}>Te pale: {e.sijeTePale || '-'}</Text>
                      <Text style={styles.listSubText}>Pral pale: {e.sijePralPale || '-'}</Text>
                      <Text style={styles.listSubText}>Tounen: <Text style={{ fontWeight: 'bold', color: '#6C5CE7' }}>{e.jouTounen || '-'}</Text></Text>
                    </View>
                    <View style={styles.counterBox}>
                      <TouchableOpacity onPress={() => chanjeKteEtid(e.id, 'minus')} style={styles.counterBtn}><Text style={styles.counterBtnText}>-</Text></TouchableOpacity>
                      <Text style={styles.counterValue}>{e.kantite}</Text>
                      <TouchableOpacity onPress={() => chanjeKteEtid(e.id, 'plus')} style={styles.counterBtn}><Text style={styles.counterBtnText}>+</Text></TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => siprimeEtid(e.id, e.non)} style={{ marginLeft: 10 }}>
                      <Ionicons name="trash-outline" size={22} color="#D63031" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            {!montreFòmEtid && dènyeEtid && (
              <View style={[styles.successBox, { borderColor: '#6C5CE7' }]}>
                <View style={styles.successRow}>
                  <Ionicons name="checkmark-circle" size={22} color="#6C5CE7" />
                  <Text style={[styles.successText, { color: '#6C5CE7' }]}> {dènyeEtid} ajoute!</Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={[styles.btnLot, { backgroundColor: '#6C5CE7' }]} onPress={() => { setDènyeEtid(null); setMontreFòmEtid(true); }}>
                    <Text style={styles.btnLotText}>Ajoute yon lot</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnFini} onPress={() => { setDènyeEtid(null); setGadeIstorikEtid(true); }}>
                    <Text style={styles.btnFiniText}>Fini</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {montreFòmEtid && (
              <View style={styles.fomBox}>
                <TextInput style={styles.input} placeholder="Non etidyan an *" value={nouvoEtid.non} onChangeText={t => setNouvoEtid({ ...nouvoEtid, non: t })} />
                <TextInput style={styles.input} placeholder="Liv (opsyonel)" value={nouvoEtid.liv} onChangeText={t => setNouvoEtid({ ...nouvoEtid, liv: t })} />
                <TextInput style={styles.input} placeholder="Tel etidyan an" keyboardType="phone-pad" value={nouvoEtid.tel} onChangeText={t => setNouvoEtid({ ...nouvoEtid, tel: t })} />
                <TextInput style={styles.input} placeholder="Sije nou te pale" value={nouvoEtid.sijeTePale} onChangeText={t => setNouvoEtid({ ...nouvoEtid, sijeTePale: t })} />
                <TextInput style={styles.input} placeholder="Sije nou pral pale" value={nouvoEtid.sijePralPale} onChangeText={t => setNouvoEtid({ ...nouvoEtid, sijePralPale: t })} />
                <TextInput style={styles.input} placeholder="Ki jou nou ap tounen" value={nouvoEtid.jouTounen} onChangeText={t => setNouvoEtid({ ...nouvoEtid, jouTounen: t })} />
                <TouchableOpacity style={[styles.btnAjoute, { backgroundColor: '#6C5CE7' }]} onPress={ajouteEtid}>
                  <Text style={styles.btnText}>AJOUTE ETIDYAN AN</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Not pou mwa a</Text>
            <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} multiline placeholder="Ekri not ou isit la..." value={notSèvis} onChangeText={setNotSèvis} />
          </View>

          <TouchableOpacity style={styles.btnWhatsapp} onPress={voyeRapòWhatsApp}>
            <Ionicons name="logo-whatsapp" size={24} color="white" />
            <Text style={styles.btnTextWhatsApp}> VOYE RAPO KOMPLET</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={[styles.tabButton, tabAktif === 'home' && styles.tabButtonActive]} onPress={() => setTabAktif('home')}>
          <Ionicons name="home" size={24} color={tabAktif === 'home' ? '#0984E3' : '#636E72'} />
          <Text style={[styles.tabButtonText, tabAktif === 'home' && { color: '#0984E3' }]}>Prensipal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, tabAktif === 'rapo' && styles.tabButtonActive]} onPress={() => setTabAktif('rapo')}>
          <Ionicons name="document-text" size={24} color={tabAktif === 'rapo' ? '#0984E3' : '#636E72'} />
          <Text style={[styles.tabButtonText, tabAktif === 'rapo' && { color: '#0984E3' }]}>Rapo & Moun</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container:            { flex: 1, padding: 15, marginBottom: 65 },
  topBar:               { backgroundColor: '#0984E3', height: 100, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' },
  topBarTitle:          { color: 'white', fontSize: 20, fontWeight: 'bold' },
  drawer:               { position: 'absolute', top: 0, bottom: 0, width: width * 0.8, backgroundColor: 'white', zIndex: 100, padding: 20, paddingTop: 60 },
  drawerHeader:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, backgroundColor: '#0984E3', margin: -20, padding: 20 },
  drawerTitle:          { color: 'white', fontSize: 22, fontWeight: 'bold' },
  manualBox:            { flex: 1, marginTop: 10, paddingHorizontal: 5 },
  manualHeader:         { fontSize: 16, fontWeight: 'bold', color: '#2D3436', marginBottom: 12 },
  manualStep:           { fontSize: 13, color: '#636E72', marginBottom: 10, lineHeight: 18 },
  devBox:               { padding: 15, backgroundColor: '#F0F2F5', borderRadius: 10, alignItems: 'center', marginTop: 10 },
  devText:              { fontSize: 13, color: '#636E72' },
  devName:              { fontSize: 17, fontWeight: 'bold', color: '#0984E3', marginTop: 2 },
  devCeo:               { fontSize: 12, color: '#636E72', marginTop: 4, textAlign: 'center' },
  devCopy:              { fontSize: 11, color: '#B2BEC3', marginTop: 3 },
  card:                 { backgroundColor: '#FFF', borderRadius: 15, padding: 18, marginBottom: 15, elevation: 3 },
  cardTitle:            { fontSize: 17, fontWeight: 'bold', marginBottom: 12 },
  headerRow:            { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  btnHistoryToggle:     { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E17055' },
  btnHistoryToggleText: { fontSize: 12, color: '#E17055', fontWeight: 'bold' },
  historyContainer:     { marginTop: 5, marginBottom: 15, backgroundColor: '#F9F9F9', borderRadius: 10, padding: 10 },
  historyItem:          { borderBottomWidth: 1, borderBottomColor: '#EEE', paddingVertical: 12, flexDirection: 'row', alignItems: 'center' },
  emptyText:            { color: '#636E72', textAlign: 'center', fontStyle: 'italic', padding: 10 },
  counterBox:           { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEE', borderRadius: 8, overflow: 'hidden' },
  counterBtn:           { backgroundColor: '#DDD', paddingHorizontal: 10, paddingVertical: 5 },
  counterBtnText:       { fontSize: 16, fontWeight: 'bold', color: '#2D3436' },
  counterValue:         { paddingHorizontal: 10, fontSize: 14, fontWeight: 'bold', color: '#2D3436' },
  input:                { backgroundColor: '#F9F9F9', padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#EEE' },
  fomBox:               { marginTop: 8 },
  btnAjoute:            { backgroundColor: '#E17055', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 5, flexDirection: 'row', justifyContent: 'center' },
  btnText:              { color: '#FFF', fontWeight: 'bold' },
  listName:             { fontSize: 16, color: '#2D3436', fontWeight: 'bold' },
  listSub:              { fontSize: 12, color: '#2D3436', marginTop: 3, fontWeight: '500' },
  listSubText:          { fontSize: 12, color: '#636E72', marginTop: 2 },
  successBox:           { marginTop: 12, padding: 14, backgroundColor: '#F0FDF8', borderRadius: 12, borderWidth: 1.5, borderColor: '#00B894' },
  successRow:           { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  successText:          { fontSize: 16, fontWeight: 'bold', color: '#00B894' },
  actionRow:            { flexDirection: 'row', gap: 10 },
  btnLot:               { flex: 1, backgroundColor: '#00B894', padding: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnLotText:           { color: 'white', fontWeight: 'bold', fontSize: 14 },
  btnFini:              { paddingHorizontal: 18, padding: 12, borderRadius: 10, backgroundColor: '#EEE', alignItems: 'center', justifyContent: 'center' },
  btnFiniText:          { color: '#2D3436', fontWeight: 'bold' },
  totalDisplay:         { backgroundColor: '#0984E3', padding: 18, borderRadius: 12, alignItems: 'center' },
  totalDisplayText:     { color: 'white', fontSize: 34, fontWeight: 'bold' },
  btnTotalAksyon:       { padding: 13, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnWhatsapp:          { backgroundColor: '#25D366', padding: 18, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  btnTextWhatsApp:      { color: 'white', fontSize: 18, fontWeight: 'bold' },
  timerText:            { fontSize: 48, fontWeight: 'bold', textAlign: 'center', marginVertical: 10, color: '#2D3436' },
  timerHint:            { textAlign: 'center', color: '#636E72', fontSize: 12, marginTop: 8 },
  btnActionTimer:       { padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  label:                { fontSize: 14, color: '#636E72', marginBottom: 5, fontWeight: 'bold' },
  pill:                 { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#E1E8EE', marginRight: 8 },
  pillActive:           { backgroundColor: '#0984E3' },
  pillActiveJou:        { backgroundColor: '#6C5CE7' },
  pillText:             { color: '#2D3436', fontWeight: '600' },
  pillTextActive:       { color: '#FFF' },
  bottomTabBar:         { position: 'absolute', bottom: 0, left: 0, right: 0, height: 65, backgroundColor: 'white', flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#E1E8EE', justifyContent: 'space-around', alignItems: 'center', elevation: 10 },
  tabButton:            { alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%' },
  tabButtonActive:      { borderTopWidth: 2, borderTopColor: '#0984E3' },
  tabButtonText:        { fontSize: 11, color: '#636E72', marginTop: 3, fontWeight: '600' },
  modalOverlay:         { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox:             { backgroundColor: 'white', borderRadius: 16, padding: 24, width: '100%' },
  modalTitle:           { fontSize: 18, fontWeight: 'bold', color: '#2D3436', marginBottom: 6 },
  modalSub:             { fontSize: 14, color: '#636E72', marginBottom: 16 },
  modalBtn:             { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
});