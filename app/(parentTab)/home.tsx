import * as Location from 'expo-location'; // 1. 引入定位库
import { Accelerometer } from 'expo-sensors';
import { ref, update } from "firebase/database"; // 改用 update 以免覆盖其他数据
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, StyleSheet, Switch, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { db } from '../firebaseConfig';

export default function ParentHome() {
  const [heartRate, setHeartRate] = useState(72);
  const [isAlerting, setIsAlerting] = useState(false);
  const [isSportMode, setIsSportMode] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState<any>(null); // 存储位置状态
  const heartScale = useRef(new Animated.Value(1)).current;

  // 1. 核心修改：报警时获取位置并同步到云端
  useEffect(() => {
    const syncData = async () => {
      let currentLoc = location;

      // 如果进入报警状态且还没有位置，立刻抓取一次
      if (isAlerting && !currentLoc) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
          currentLoc = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setLocation(currentLoc);
        }
      }

      // 统一推送到 Firebase
      update(ref(db, 'users/parent01'), {
        heartRate,
        isAlerting,
        countdown,
        lastLocation: currentLoc, // 将 GPS 发送给子女端
        lastUpdate: Date.now()
      });
    };

    syncData();
  }, [heartRate, isAlerting, countdown]);

  // 2. 模拟心跳跳动 (保持不变)
  useEffect(() => {
    const timer = setInterval(() => {
      const nextHR = isSportMode ? 115 + Math.floor(Math.random()*10) : 72 + Math.floor(Math.random()*5);
      setHeartRate(nextHR);
      Animated.sequence([
        Animated.timing(heartScale, { toValue: 1.2, duration: 150, useNativeDriver: true }),
        Animated.timing(heartScale, { toValue: 1, duration: 400, useNativeDriver: true })
      ]).start();
    }, 1200);
    return () => clearInterval(timer);
  }, [isSportMode]);

  // 3. 跌倒检测 (加速度传感器)
  useEffect(() => {
    const sub = Accelerometer.addListener(data => {
      const g = Math.sqrt(data.x**2 + data.y**2 + data.z**2);
      // 降低阈值方便你甩动手机测试 (4.0 -> 3.0)
      if (g > 3.0 && !isAlerting && !isSportMode) {
        setIsAlerting(true);
        setCountdown(5);
        Vibration.vibrate([500, 500, 500]);
      }
    });
    return () => sub.remove();
  }, [isAlerting, isSportMode]);

  // 4. 倒计时逻辑 (保持不变)
  useEffect(() => {
    let t: any;
    if (isAlerting && countdown > 0) {
      t = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [isAlerting, countdown]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{color: '#666'}}>当前模式: {isSportMode ? '户外运动' : '居家静息'}</Text>
        <Switch value={isSportMode} onValueChange={setIsSportMode} />
      </View>
      
      <View style={styles.hrCircle}>
        <Animated.Text style={{fontSize: 40, transform: [{scale: heartScale}]}}>❤️</Animated.Text>
        <Text style={styles.hrText}>{heartRate}</Text>
        <Text style={{color: '#444'}}>BPM</Text>
      </View>

      <Modal visible={isAlerting} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>检测到剧烈冲击！</Text>
            <Text style={styles.alertSub}>正在发送您的位置至子女端...</Text>
            <Text style={styles.countText}>{countdown}</Text>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => {
              setIsAlerting(false);
              setLocation(null); // 取消后重置位置状态
            }}>
              <Text style={{fontWeight: 'bold', color: '#666'}}>我没事，取消报警</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  header: { position: 'absolute', top: 50, flexDirection: 'row', alignItems: 'center', width: '80%', justifyContent: 'space-between' },
  hrCircle: { width: 240, height: 240, borderRadius: 120, borderWidth: 3, borderColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  hrText: { color: '#fff', fontSize: 70, fontWeight: '900' },
  modalBg: { flex: 1, backgroundColor: 'rgba(255,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  alertCard: { backgroundColor: '#fff', padding: 40, borderRadius: 30, alignItems: 'center', width: '85%' },
  alertTitle: { fontSize: 22, fontWeight: 'bold', color: '#ff4d4f' },
  alertSub: { fontSize: 14, color: '#999', marginTop: 10 },
  countText: { fontSize: 100, fontWeight: '900', marginVertical: 20, color: '#000' },
  cancelBtn: { backgroundColor: '#eee', padding: 20, borderRadius: 15, width: '100%', alignItems: 'center' }
});