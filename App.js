import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import {
  Alert, Animated, Dimensions, Linking, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';

const { width } = Dimensions.get('window');

const MWA = ['Janvye', 'Fevriye', 'Mas', 'Avril', 'Me', 'Jen', 'Jiyè', 'Out', 'Septanm', 'Oktòb', 'Novanm', 'Desanm'];
const JOU = Array.from({ length: 31 }, (_, i) => i + 1);

export default function RapoApp() {
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  // Done ki dwe sove
  const [mwaChwazi, setMwaChwazi] = useState(MWA[new Date().getMonth()]);
  const [jouChwazi, setJouChwazi] = useState(new Date().getDate());
  const [leTotalMwa, setLeTotalMwa] = useState('0');
  const [notSevis, setNotSevis] = useState('');
  const [lisVizit, setLisVizit] = useState([]);
  const [lisEtid, setLisEtid] = useState([]);

  // Pou evite sove anvan done yo chaje
  const [chaje, setChaje] = useState(false);

  // Champ pou nouvo moun (yo sove tou)
  const [nonVizit, setNonVizit] = useState('');
  const [adresVizit, setAdresVizit] = useState('');
  const [nonEtid, setNonEtid] = useState('');
  const [livEtid, setLivEtid] = useState('');

  const inputVizitRef = useRef(null);
  const inputEtidRef = useRef(null);

  // CHACHE DONE (yon sèl fwa)
  useEffect(() => {
    const load = async () => {
      try {
        const rezilta = await AsyncStorage.multiGet([
          '@total_le', '@lis_vizit', '@lis_etid', '@not_sevis', '@mwa', '@jou',
          '@d_non_vizit', '@d_adres_vizit', '@d_non_etid', '@d_liv_etid'
        ]);
        const d = Object.fromEntries(rezilta);
        if (d['@total_le'] !== null) setLeTotalMwa(d['@total_le']);
        if (d['@lis_vizit']) setLisVizit(JSON.parse(d['@lis_vizit']));
        if (d['@lis_etid']) setLisEtid(JSON.parse(d['@lis_etid']));
        if (d['@not_sevis'] !== null) setNotSevis(d['@not_sevis']);
        if (d['@mwa']) setMwaChwazi(d['@mwa']);
        if (d['@jou']) setJouChwazi(parseInt(d['@jou'], 10));
        if (d['@d_non_vizit']) setNonVizit(d['@d_non_vizit']);
        if (d['@d_adres_vizit']) setAdresVizit(d['@d_adres_vizit']);
        if (d['@d_non_etid']) setNonEtid(d['@d_non_etid']);
        if (d['@d_liv_etid']) setLivEtid(d['@d_liv_etid']);
      } catch (err) {
        console.log('Ere chajman', err);
      } finally {
        setChaje(true);
      }
    };
    load();
  }, []);

  // SEVE DONE (sèlman apre chajman fini)
  useEffect(() => {
    if (!chaje) return;
    AsyncStorage.multiSet([
      ['@total_le', String(leTotalMwa)],
      ['@lis_vizit', JSON.stringify(lisVizit)],
      ['@lis_etid', JSON.stringify(lisEtid)],
      ['@not_sevis', notSevis],
      ['@mwa', mwaChwazi],
      ['@jou', String(jouChwazi)],
      ['@d_non_vizit', nonVizit],
      ['@d_adres_vizit', adresVizit],
      ['@d_non_etid', nonEtid],
      ['@d_liv_etid', livEtid],
    ]).catch(() => console.log('Ere sovgad'));
  }, [chaje, leTotalMwa, lisVizit, lisEtid, notSevis, mwaChwazi, jouChwazi,
      nonVizit, adresVizit, nonEtid, livEtid]);

  // MENI
  const openMenu = () => {
    setMenuOpen(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: false }).start();
  };
  const closeMenu = () => {
    Animated.timing(slideAnim, { toValue: -width, duration: 300, useNativeDriver: false }).start(() => setMenuOpen(false));
  };

  // AJOUTE VIZIT
  const ajouteVizit = () => {
    if (nonVizit.trim() === '') {
      Alert.alert('Atansyon', 'Antre non moun nan.');
      return;
    }
    setLisVizit(prev => [...prev, {
      id: Date.now().toString(),
      non: nonVizit.trim(),
      adres: adresVizit.trim()
    }]);
    setNonVizit('');
    setAdresVizit('');
    setTimeout(() => inputVizitRef.current && inputVizitRef.current.focus(), 100);
  };

  // AJOUTE ETIDYAN
  const ajouteEtid = () => {
    if (nonEtid.trim() === '') {
      Alert.alert('Atansyon', 'Antre non etidyan an.');
      return;
    }
    setLisEtid(prev => [...prev, {
      id: Date.now().toString(),
      non: nonEtid.trim(),
      liv: livEtid.trim()
    }]);
    setNonEtid('');
    setLivEtid('');
    setTimeout(() => inputEtidRef.current && inputEtidRef.current.focus(), 100);
  };

  // EFASE (sèlman lè ou konfime)
  const efaseVizit = (id) => {
    Alert.alert('Efase?', 'Ou vle efase moun sa?', [
      { text: 'Non', style: 'cancel' },
      { text: 'Wi', style: 'destructive', onPress: () => setLisVizit(prev => prev.filter(i => i.id !== id)) }
    ]);
  };
  const efaseEtid = (id) => {
    Alert.alert('Efase?', 'Ou vle efase etidyan sa?', [
      { text: 'Non', style: 'cancel' },
      { text: 'Wi', style: 'destructive', onPress: () => setLisEtid(prev => prev.filter(i => i.id !== id)) }
    ]);
  };

  // WHATSAPP
  const voyeRapo = () => {
    const etidYo = lisEtid.map(e => '   * ' + e.non + (e.liv ? ' - ' + e.liv : '')).join('\n');
    const vizitYo = lisVizit.map(v => '   * ' + v.non + (v.adres ? ' (' + v.adres + ')' : '')).join('\n');
    const mesaj =
      '*RAPO SEVIS - ' + mwaChwazi.toUpperCase() + '*\n' +
      'Dat: ' + jouChwazi + ' ' + mwaChwazi + '\n\n' +
      'Total Le: ' + leTotalMwa + ' h\n\n' +
      'Revizit (' + lisVizit.length + '):\n' + (vizitYo || '   -') + '\n\n' +
      'Etid Biblik (' + lisEtid.length + '):\n' + (etidYo || '   -') + '\n\n' +
      'Not: ' + (notSevis || '-') + '\n\n' +
      'App kreye pa Jordany Dev';
    Linking.openURL('whatsapp://send?text=' + encodeURIComponent(mesaj))
      .catch(() => Alert.alert('Ere', 'WhatsApp pa enstale sou telefòn nan.'));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F2F5' }}>

      {/* SIDEBAR */}
      <Animated.View style={[styles.drawer, { left: slideAnim }]}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Jordany Dev</Text>
          <TouchableOpacity onPress={closeMenu}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.devBox}>
          <Text style={styles.devText}>Devlope Ofisyel:</Text>
          <Text style={styles.devName}>JORDANY DEV</Text>
        </View>
        <View style={{ marginTop: 30, alignItems: 'center' }}>
          <Text style={{ color: '#636E72', fontSize: 13 }}>RapoApp Pro v2.5</Text>
          <Text style={{ color: '#00B894', fontSize: 12, marginTop: 5 }}>Done sove otomatikman</Text>
        </View>
      </Animated.View>

      {menuOpen && (
        <TouchableOpacity style={styles.overlay} onPress={closeMenu} activeOpacity={1} />
      )}

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={openMenu}>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>RapoApp Pro</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

        {/* MWA AK JOU */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="calendar" size={20} color="#0984E3" /> {jouChwazi} {mwaChwazi}
          </Text>

          <Text style={styles.lisTit}>Chwazi mwa a:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {MWA.map(m => (
              <TouchableOpacity
                key={m}
                onPress={() => setMwaChwazi(m)}
                style={[styles.chip, mwaChwazi === m && styles.chipAktif]}
              >
                <Text style={[styles.chipTeks, mwaChwazi === m && styles.chipTeksAktif]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.lisTit}>Chwazi jou a:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {JOU.map(j => (
              <TouchableOpacity
                key={j}
                onPress={() => setJouChwazi(j)}
                style={[styles.chipJou, jouChwazi === j && styles.chipAktif]}
              >
                <Text style={[styles.chipTeks, jouChwazi === j && styles.chipTeksAktif]}>{j}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* TOTAL */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="time" size={20} color="#0984E3" /> Total Mwa a
          </Text>
          <View style={styles.totalDisplay}>
            <Text style={styles.totalDisplayText}>{leTotalMwa} h</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Modifye le total"
            keyboardType="numeric"
            value={leTotalMwa}
            onChangeText={setLeTotalMwa}
          />
        </View>

        {/* REVIZIT */}
        <View style={styles.card}>
          <View style={styles.seksyonTit}>
            <View style={styles.seksyonGoch}>
              <Ionicons name="people" size={22} color="#E17055" />
              <Text style={styles.seksyonTeks}> Revizit</Text>
            </View>
            <View style={styles.badgeRouj}>
              <Text style={styles.badgeTeks}>{lisVizit.length} moun</Text>
            </View>
          </View>

          <View style={styles.fomBox}>
            <TextInput
              ref={inputVizitRef}
              style={styles.input}
              placeholder="Non moun nan *"
              value={nonVizit}
              onChangeText={setNonVizit}
              returnKeyType="next"
              onSubmitEditing={ajouteVizit}
              blurOnSubmit={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Adres (opsyonel)"
              value={adresVizit}
              onChangeText={setAdresVizit}
              returnKeyType="done"
              onSubmitEditing={ajouteVizit}
              blurOnSubmit={false}
            />
            <TouchableOpacity style={styles.btnAjoute} onPress={ajouteVizit}>
              <Ionicons name="person-add" size={18} color="white" />
              <Text style={styles.btnAjouteTeks}>  AJOUTE + KONTINYE</Text>
            </TouchableOpacity>
          </View>

          {lisVizit.length > 0 && (
            <View style={styles.lisBox}>
              <Text style={styles.lisTit}>Lis moun ou ajoute yo:</Text>
              {lisVizit.map((v, index) => (
                <View key={v.id} style={styles.listItem}>
                  <View style={styles.numBadge}>
                    <Text style={styles.numTeks}>{index + 1}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.listName}>{v.non}</Text>
                    {v.adres ? <Text style={styles.listSub}>{v.adres}</Text> : null}
                  </View>
                  <TouchableOpacity onPress={() => efaseVizit(v.id)} style={styles.trashBtn}>
                    <Ionicons name="trash-outline" size={18} color="#D63031" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ETID BIBLIK */}
        <View style={styles.card}>
          <View style={styles.seksyonTit}>
            <View style={styles.seksyonGoch}>
              <Ionicons name="book" size={22} color="#6C5CE7" />
              <Text style={[styles.seksyonTeks, { color: '#6C5CE7' }]}> Etid Biblik</Text>
            </View>
            <View style={[styles.badgeRouj, { backgroundColor: '#6C5CE7' }]}>
              <Text style={styles.badgeTeks}>{lisEtid.length} moun</Text>
            </View>
          </View>

          <View style={styles.fomBox}>
            <TextInput
              ref={inputEtidRef}
              style={styles.input}
              placeholder="Non etidyan an *"
              value={nonEtid}
              onChangeText={setNonEtid}
              returnKeyType="next"
              onSubmitEditing={ajouteEtid}
              blurOnSubmit={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Liv n ap etidye (opsyonel)"
              value={livEtid}
              onChangeText={setLivEtid}
              returnKeyType="done"
              onSubmitEditing={ajouteEtid}
              blurOnSubmit={false}
            />
            <TouchableOpacity style={[styles.btnAjoute, { backgroundColor: '#6C5CE7' }]} onPress={ajouteEtid}>
              <Ionicons name="person-add" size={18} color="white" />
              <Text style={styles.btnAjouteTeks}>  AJOUTE + KONTINYE</Text>
            </TouchableOpacity>
          </View>

          {lisEtid.length > 0 && (
            <View style={styles.lisBox}>
              <Text style={styles.lisTit}>Lis etidyan ou ajoute yo:</Text>
              {lisEtid.map((e, index) => (
                <View key={e.id} style={styles.listItem}>
                  <View style={[styles.numBadge, { backgroundColor: '#6C5CE7' }]}>
                    <Text style={styles.numTeks}>{index + 1}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.listName}>{e.non}</Text>
                    {e.liv ? <Text style={styles.listSub}>{e.liv}</Text> : null}
                  </View>
                  <TouchableOpacity onPress={() => efaseEtid(e.id)} style={styles.trashBtn}>
                    <Ionicons name="trash-outline" size={18} color="#D63031" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* NOT */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="create" size={20} color="#00B894" /> Not pou mwa a
          </Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            multiline
            placeholder="Ekri not ou isit la..."
            value={notSevis}
            onChangeText={setNotSevis}
          />
        </View>

        {/* WHATSAPP */}
        <TouchableOpacity style={styles.btnWhatsapp} onPress={voyeRapo}>
          <Ionicons name="logo-whatsapp" size={24} color="white" />
          <Text style={styles.btnTextWhatsApp}> VOYE RAPO KONPLE</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  topBar: { backgroundColor: '#0984E3', height: 100, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' },
  topBarTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  drawer: { position: 'absolute', top: 0, bottom: 0, width: width * 0.75, backgroundColor: 'white', zIndex: 200, padding: 20, paddingTop: 60, elevation: 20 },
  drawerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, backgroundColor: '#0984E3', margin: -20, padding: 20 },
  drawerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  overlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 150 },
  devBox: { marginTop: 20, padding: 15, backgroundColor: '#F0F2F5', borderRadius: 10, alignItems: 'center' },
  devText: { fontSize: 14, color: '#636E72' },
  devName: { fontSize: 16, fontWeight: 'bold', color: '#0984E3' },

  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 18, marginBottom: 15, elevation: 3 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 15 },

  // Mwa / jou
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F2F5', marginRight: 8 },
  chipJou: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F2F5', marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  chipAktif: { backgroundColor: '#0984E3' },
  chipTeks: { color: '#2D3436', fontWeight: '600' },
  chipTeksAktif: { color: 'white' },

  seksyonTit: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  seksyonGoch: { flexDirection: 'row', alignItems: 'center' },
  seksyonTeks: { fontSize: 18, fontWeight: 'bold', color: '#E17055' },
  badgeRouj: { backgroundColor: '#E17055', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  badgeTeks: { color: 'white', fontWeight: 'bold', fontSize: 13 },

  fomBox: { backgroundColor: '#FFF8F6', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#FFD8CC' },
  input: { backgroundColor: '#F9F9F9', padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#EEE', fontSize: 15 },
  btnAjoute: { backgroundColor: '#E17055', padding: 14, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnAjouteTeks: { color: 'white', fontWeight: 'bold', fontSize: 15 },

  lisBox: { marginTop: 5, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 12 },
  lisTit: { fontSize: 13, color: '#636E72', marginBottom: 8, fontWeight: '600' },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  numBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E17055', alignItems: 'center', justifyContent: 'center' },
  numTeks: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  listName: { fontSize: 15, color: '#2D3436', fontWeight: '600' },
  listSub: { fontSize: 12, color: '#636E72', marginTop: 2 },
  trashBtn: { padding: 5 },

  totalDisplay: { backgroundColor: '#0984E3', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  totalDisplayText: { color: 'white', fontSize: 30, fontWeight: 'bold' },

  btnWhatsapp: { backgroundColor: '#25D366', padding: 18, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  btnTextWhatsApp: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});