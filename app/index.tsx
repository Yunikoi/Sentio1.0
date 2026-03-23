import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ManualGate() {
  const router = useRouter(); // 声明一个路由“遥控器”

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sentio 系统控制台</Text>
      
      {/* 按钮：前往父母端 */}
      <TouchableOpacity 
        style={[styles.btn, {backgroundColor: '#FF5252'}]} 
        onPress={() => router.push('/(parentTab)/home')} // 注意这里指向你改名后的 home
      >
        <Text style={styles.btnText}>进入父母端 (SOS)</Text>
      </TouchableOpacity>

      {/* 按钮：前往子女端 */}
      <TouchableOpacity 
        style={[styles.btn, {backgroundColor: '#448AFF'}]} 
        onPress={() => router.push('/(childTab)/home')} // 指向子女端的 home
      >
        <Text style={styles.btnText}>进入子女端 (数据看板)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, color: '#333' },
  btn: { width: '80%', padding: 20, borderRadius: 12, marginVertical: 10, alignItems: 'center', elevation: 3 },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});