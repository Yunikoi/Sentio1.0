import { Tabs } from 'expo-router';
import { onValue, ref, update } from "firebase/database";
import React, { useEffect, useState } from 'react';
import { Linking, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig';

export default function ChildLayout() {
  // 使用 any 避开严格的类型检查，解决 lastLocation 报错
  const [alertData, setAlertData] = useState<any>(null);

  useEffect(() => {
    const parentRef = ref(db, 'users/parent01');
    return onValue(parentRef, (snapshot) => {
      const data = snapshot.val();
      setAlertData(data); 
    });
  }, []);

  const openMap = () => {
    if (alertData?.lastLocation) {
      const { latitude, longitude } = alertData.lastLocation;
      // Web 端使用 Google Maps 链接，手机端调用原生地图
      const url = Platform.OS === 'web' 
        ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
        : Platform.select({
            ios: `maps:0,0?q=父母位置@${latitude},${longitude}`,
            android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(父母位置)`
          });
      if (url) Linking.openURL(url);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{ headerShown: false }} />

      {/* 使用 !! 强制转换为布尔值，确保 Modal 正常触发 */}
      <Modal visible={!!alertData?.isAlerting} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.alertCard}>
            <Text style={styles.emoji}>🚨</Text>
            <Text style={styles.title}>紧急警报：父母可能摔倒！</Text>
            
            {alertData?.lastLocation ? (
              <TouchableOpacity style={styles.locationBox} onPress={openMap}>
                <Text style={styles.locationText}>📍 点击在地图中查看位置</Text>
                <Text style={styles.coords}>
                  ({Number(alertData.lastLocation.latitude).toFixed(4)}, {Number(alertData.lastLocation.longitude).toFixed(4)})
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noLocation}>正在尝试获取定位...</Text>
            )}

            <TouchableOpacity style={styles.btn} onPress={() => update(ref(db, 'users/parent01'), { isAlerting: false })}>
              <Text style={styles.btnText}>确认并关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  alertCard: { backgroundColor: '#fff', padding: 25, borderRadius: 20, alignItems: 'center', width: '85%' },
  emoji: { fontSize: 50 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#ff4d4f', marginVertical: 15, textAlign: 'center' },
  locationBox: { backgroundColor: '#f1f1f1', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  locationText: { color: '#007AFF', fontWeight: 'bold' },
  coords: { fontSize: 12, color: '#999', marginTop: 5 },
  noLocation: { color: '#999', padding: 10 },
  btn: { backgroundColor: '#ff4d4f', padding: 15, borderRadius: 10, marginTop: 20, width: '100%' },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});