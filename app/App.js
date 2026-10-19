import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert, Animated, Dimensions, Linking, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function RapoApp() {
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-width))[0];

  const [mwaChwazi, setMwaChwazi] = useState('Janvye');
  const [leTotalMwa, setLeTotalMwa] = useState('0');
  const [notSèvis, setNotSèvis] = useState('');

  const [lisVizit, setLisVizit] = useState([]);
  const [lisEtid, setLisEtid] = useState([]);

  const [nouvoVizit, setNouvoVizit] = useState({ non: '', adres: '' });
  const [nouvoEtid, setNouvoEtid] = useState({ non: '', liv: '' });

  const [montreFòmVizit, setMontreFòmVizit] = useState(true);
  const [montreFòmEtid, setMontreFòmEtid] = useState(true);

  const [dènyeVizit, setDènyeVizit] = useState(null);
  const [dènyeEtid, setDènyeEtid] = useState(null);

  // CHACHE DONE
  useEffect(() => {
    const chacheDone = async () => {
      try {
        const t = await AsyncStorage.getItem('@total_le');
        const v = await AsyncStorage.getItem('@lis_vizit');
        const e = await AsyncStorage.getItem('@lis_etid');
        const n = await AsyncStorage.getItem('@not_sevis');
        if (t) setLeTotalMwa(t);
        if (v) setLisVizit(JSON.parse(v));
        if (e) setLisEtid(JSON.parse(e));
        if (n) setNotSèvis(n);
      } catch (err) { console.log("Erè chajman"); }
    };
    chacheDone();
  }, []);

  // SEVE DONE
  useEffect(() => {
    AsyncStorage.setItem('@total_le', leTotalMwa);
    AsyncStorage.setItem('@lis_vizit', JSON.stringify(lisVizit));
    AsyncStorage.setItem('@lis_etid', JSON.stringify(lisEtid));
    AsyncStorage.setItem('@not_sevis', notSèvis);
  }, [leTotalMwa, lisVizit, lisEtid, notSèvis]);

  // AJOUTE VIZIT
  const ajouteVizit = () => {
    if (nouvoVizit.non.trim() === '') {
      Alert.alert('Atansyon', 'Tanpri antre non moun nan.');
      return;
    }
    setLisVizit(prev => [...prev, { id: Date.now().toString(), ...nouvoVizit }]);
    setDènyeVizit(nouvoVizit.non);
    setNouvoVizit({ non: '', adres: '' });
    setMontreFòmVizit(false);
  };

  const ajouteLotVizit = () => {
    setDènyeVizit(null);
    setMontreFòmVizit(true);
  };

  // AJOUTE ETID
  const ajouteEtid = () => {
    if (nouvoEtid.non.trim() === '') {
      Alert.alert('Atansyon', 'Tanpri antre non etidyan an.');
      return;
    }
    setLisEtid(prev => [...prev, { id: Date.now().toString(), ...nouvoEtid }]);
    setDènyeEtid(nouvoEtid.non);
    setNouvoEtid({ non: '', liv: '' });
    setMontreFòmEtid(false);
  };

  const ajouteLotEtid = () => {
    setDènyeEtid(null);
    setMontreFòmEtid(true);
  };

  // WHATSAPP
  const voyeRapòWhatsApp = () => {
    const etidyanYo = lisEtid.map(e => `   • ${e.non}${e.liv ? ` — ${e.liv}` : ''}`).join('\n');
    const vizitYo = lisVizit.map(v => `   • ${v.non}${v.adres ? ` (${v.adres})` : ''}`).join('\n');
    const mesaj =
      `*RAPÒ SÈVIS - ${mwaChwazi.toUpperCase()}*\n\n` +
      `⏱️ *Total Lè:* ${leTotalMwa} h\n\n` +
      `👥 *Revizit (${lisVizit.length}):*\n${vizitYo || '   —'}\n\n` +
      `📖 *Etid Biblik (${lisEtid.length}):*\n${etidyanYo || '   —'}\n\n` +
      `📝 *Nòt:* ${notSèvis || '—'}\n\n` +
      `_App kreye pa Jordany Dev_`;
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(mesaj)}`);
  };

  const toggleMenu = () => {
    Animated.timing(slideAnim, {
      toValue: menuOpen ? -width : 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setMenuOpen(!menuOpen));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F2F5' }}>

      {/* SIDEBAR */}
      <Animated.View style={[styles.drawer, { left: slideAnim }]}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Jordany Dev</Text>
          <TouchableOpacity onPress={toggleMenu}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.devBox}>
          <Text style={styles.devText}>Devlopè Ofisyèl:</Text>
          <Text style={styles.devName}>JORDANY DEV</Text>
        </View>
      </Animated.View>

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>RapoApp Pro</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

        {/* LÈ TOTAL */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="time" size={20} color="#0984E3" /> Total Mwa a
          </Text>
          <View style={styles.totalDisplay}>
            <Text style={styles.totalDisplayText}>{leTotalMwa} h</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Modifye lè total"
            keyboardType="numeric"
            value={leTotalMwa}
            onChangeText={setLeTotalMwa}
          />
        </View>

        {/* ══ SEKSYON REVIZIT ══ */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="people" size={20} color="#E17055" /> Revizit ({lisVizit.length})
          </Text>

          {lisVizit.map((v) => (
            <View key={v.id} style={styles.listItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listName}>{v.non}</Text>
                {v.adres ? <Text style={styles.listSub}>{v.adres}</Text> : null}
              </View>
              <TouchableOpacity onPress={() => setLisVizit(lisVizit.filter(i => i.id !== v.id))}>
                <Ionicons name="trash-outline" size={20} color="#D63031" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Konfirmasyon */}
          {!montreFòmVizit && dènyeVizit && (
            <View style={styles.successBox}>
              <View style={styles.successRow}>
                <Ionicons name="checkmark-circle" size={22} color="#00B894" />
                <Text style={styles.successText}> «{dènyeVizit}» ajoute!</Text>
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.btnLot} onPress={ajouteLotVizit}>
                  <Ionicons name="person-add" size={16} color="white" />
                  <Text style={styles.btnLotText}>  Ajoute yon lòt</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnFini} onPress={() => setDènyeVizit(null)}>
                  <Text style={styles.btnFiniText}>Fini ✓</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Fòm */}
          {montreFòmVizit && (
            <View style={styles.fòmBox}>
              <TextInput
                style={styles.input}
                placeholder="Non moun nan"
                value={nouvoVizit.non}
                onChangeText={(t) => setNouvoVizit({ ...nouvoVizit, non: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Adrès (opsyonèl)"
                value={nouvoVizit.adres}
                onChangeText={(t) => setNouvoVizit({ ...nouvoVizit, adres: t })}
              />
              <TouchableOpacity style={styles.btnAjoute} onPress={ajouteVizit}>
                <Ionicons name="person-add" size={18} color="white" />
                <Text style={[styles.btnText, { marginLeft: 8 }]}>AJOUTE MOUN NAN</Text>
              </TouchableOpacity>
            </View>
          )}

          {!montreFòmVizit && !dènyeVizit && (
            <TouchableOpacity style={styles.btnPlus} onPress={ajouteLotVizit}>
              <Ionicons name="add-circle-outline" size={20} color="#E17055" />
              <Text style={styles.btnPlusText}>  Ajoute yon lòt revizit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ══ SEKSYON ETID BIBLIK ══ */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="book" size={20} color="#6C5CE7" /> Etid Biblik ({lisEtid.length})
          </Text>

          {lisEtid.map((e) => (
            <View key={e.id} style={styles.listItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listName}>{e.non}</Text>
                {e.liv ? <Text style={styles.listSub}>{e.liv}</Text> : null}
              </View>
              <TouchableOpacity onPress={() => setLisEtid(lisEtid.filter(i => i.id !== e.id))}>
                <Ionicons name="trash-outline" size={20} color="#D63031" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Konfirmasyon */}
          {!montreFòmEtid && dènyeEtid && (
            <View style={[styles.successBox, { borderColor: '#6C5CE7' }]}>
              <View style={styles.successRow}>
                <Ionicons name="checkmark-circle" size={22} color="#6C5CE7" />
                <Text style={[styles.successText, { color: '#6C5CE7' }]}> «{dènyeEtid}» ajoute!</Text>
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.btnLot, { backgroundColor: '#6C5CE7' }]} onPress={ajouteLotEtid}>
                  <Ionicons name="person-add" size={16} color="white" />
                  <Text style={styles.btnLotText}>  Ajoute yon lòt</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnFini} onPress={() => setDènyeEtid(null)}>
                  <Text style={styles.btnFiniText}>Fini ✓</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Fòm */}
          {montreFòmEtid && (
            <View style={styles.fòmBox}>
              <TextInput
                style={styles.input}
                placeholder="Non etidyan an"
                value={nouvoEtid.non}
                onChangeText={(t) => setNouvoEtid({ ...nouvoEtid, non: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Liv (opsyonèl)"
                value={nouvoEtid.liv}
                onChangeText={(t) => setNouvoEtid({ ...nouvoEtid, liv: t })}
              />
              <TouchableOpacity style={[styles.btnAjoute, { backgroundColor: '#6C5CE7' }]} onPress={ajouteEtid}>
                <Ionicons name="book" size={18} color="white" />
                <Text style={[styles.btnText, { marginLeft: 8 }]}>AJOUTE ETIDYAN AN</Text>
              </TouchableOpacity>
            </View>
          )}

          {!montreFòmEtid && !dènyeEtid && (
            <TouchableOpacity style={[styles.btnPlus, { borderColor: '#6C5CE7' }]} onPress={ajouteLotEtid}>
              <Ionicons name="add-circle-outline" size={20} color="#6C5CE7" />
              <Text style={[styles.btnPlusText, { color: '#6C5CE7' }]}>  Ajoute yon lòt etidyan</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* NÒT SÈVIS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="create" size={20} color="#00B894" /> Nòt pou mwa a
          </Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            multiline
            placeholder="Ekri nòt ou isit la..."
            value={notSèvis}
            onChangeText={setNotSèvis}
          />
        </View>

        {/* WHATSAPP */}
        <TouchableOpacity style={styles.btnWhatsapp} onPress={voyeRapòWhatsApp}>
          <Ionicons name="logo-whatsapp" size={24} color="white" />
          <Text style={styles.btnTextWhatsApp}> VOYE RAPÒ KONPLÈ</Text>
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
  drawer: { position: 'absolute', top: 0, bottom: 0, width: width * 0.75, backgroundColor: 'white', zIndex: 100, padding: 20, paddingTop: 60 },
  drawerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, backgroundColor: '#0984E3', margin: -20, padding: 20 },
  drawerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  devBox: { marginTop: 20, padding: 15, backgroundColor: '#F0F2F5', borderRadius: 10, alignItems: 'center' },
  devText: { fontSize: 14, color: '#636E72' },
  devName: { fontSize: 16, fontWeight: 'bold', color: '#0984E3' },
  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 18, marginBottom: 15, elevation: 3 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 15 },
  input: { backgroundColor: '#F9F9F9', padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#EEE' },
  fòmBox: { marginTop: 8 },
  btnAjoute: { backgroundColor: '#E17055', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 5, flexDirection: 'row', justifyContent: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  listName: { fontSize: 16, color: '#2D3436', fontWeight: '600' },
  listSub: { fontSize: 13, color: '#636E72', marginTop: 2 },
  successBox: { marginTop: 12, padding: 14, backgroundColor: '#F0FDF8', borderRadius: 12, borderWidth: 1.5, borderColor: '#00B894' },
  successRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  successText: { fontSize: 16, fontWeight: 'bold', color: '#00B894' },
  actionRow: { flexDirection: 'row', gap: 10 },
  btnLot: { flex: 1, backgroundColor: '#00B894', padding: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnLotText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  btnFini: { paddingHorizontal: 18, padding: 12, borderRadius: 10, backgroundColor: '#EEE', alignItems: 'center', justifyContent: 'center' },
  btnFiniText: { color: '#2D3436', fontWeight: 'bold' },
  btnPlus: { marginTop: 12, padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#E17055', borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnPlusText: { color: '#E17055', fontWeight: 'bold', fontSize: 15 },
  totalDisplay: { backgroundColor: '#0984E3', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  totalDisplayText: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  btnWhatsapp: { backgroundColor: '#25D366', padding: 18, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  btnTextWhatsApp: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});