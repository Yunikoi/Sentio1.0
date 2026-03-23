import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { db } from '../firebaseConfig';

export default function ChildHome() {
  const [heartRate, setHeartRate] = useState('--');

  useEffect(() => {
    const hrRef = ref(db, 'users/parent01/heartRate');
    return onValue(hrRef, (snapshot) => {
      if (snapshot.exists()) setHeartRate(snapshot.val());
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>父母当前心率</Text>
      <Text style={styles.hrText}>{heartRate}</Text>
      <Text style={styles.unit}>BPM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  label: { color: '#888', fontSize: 18 },
  hrText: { color: '#2196F3', fontSize: 100, fontWeight: 'bold' },
  unit: { color: '#2196F3', fontSize: 20 }
});