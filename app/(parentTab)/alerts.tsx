import { limitToLast, onValue, push, query, ref, serverTimestamp } from "firebase/database";
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Keyboard,
    StyleSheet,
    Text,
    TextInput, TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { db } from '../firebaseConfig'; // 确保路径正确

export default function FinalMoments() {
  const [text, setText] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  // 时间格式化函数：将时间戳转为 "03-23 19:42" 格式
  const formatTime = (timestamp: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${m}-${d} ${h}:${min}`;
  };

  useEffect(() => {
    const q = query(ref(db, 'moments'), limitToLast(20));
    return onValue(q, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.keys(data).map(key => ({ 
          id: key, 
          ...data[key],
          // 处理评论数据：Object 转 Array
          comments: data[key].comments ? Object.entries(data[key].comments).map(([id, c]: any) => ({ id, ...c })) : []
        })).reverse();
        setList(arr);
      }
    });
  }, []);

  const handlePublish = () => {
    if (!text.trim()) return;
    push(ref(db, 'moments'), {
      text: text,
      userName: "家庭成员", 
      time: serverTimestamp(), // 写入云端服务器时间
    });
    setText('');
    Keyboard.dismiss(); 
  };

  const handleComment = (postId: string) => {
    const content = commentText[postId];
    if (!content?.trim()) return;

    push(ref(db, `moments/${postId}/comments`), {
      text: content,
      userName: "回复",
      time: serverTimestamp() // 评论也记录时间
    }).then(() => {
      setCommentText({ ...commentText, [postId]: '' });
      Keyboard.dismiss();
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* 发布区 */}
        <View style={styles.headerInput}>
          <TextInput 
            style={styles.mainInput}
            placeholder="分享这一刻..."
            placeholderTextColor="#555"
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity style={styles.publishBtn} onPress={handlePublish}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>发布</Text>
          </TouchableOpacity>
        </View>

        <FlatList 
          data={list}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.postMain}>
                <View style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.uName}>{item.userName}</Text>
                  <Text style={styles.uText}>{item.text}</Text>
                  {/* 显示发布时间 */}
                  <Text style={styles.timeText}>{formatTime(item.time)}</Text>
                </View>
              </View>

              {item.comments.length > 0 && (
                <View style={styles.commentList}>
                  {item.comments.map((c: any) => (
                    <View key={c.id} style={styles.cItemRow}>
                      <Text style={styles.cUser}>{c.userName}: </Text>
                      <Text style={styles.cContent}>{c.text}</Text>
                      <Text style={styles.cTime}>{formatTime(c.time)}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.commentInputArea}>
                <TextInput 
                  style={styles.miniInput}
                  placeholder="评论..."
                  placeholderTextColor="#444"
                  value={commentText[item.id] || ''}
                  onChangeText={(v) => setCommentText({ ...commentText, [item.id]: v })}
                />
                <TouchableOpacity onPress={() => handleComment(item.id)}>
                  <Text style={styles.sendLink}>发送</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' }, // 全黑背景
  headerInput: { flexDirection: 'row', padding: 15, borderBottomWidth: 0.5, borderColor: '#222', alignItems: 'flex-end' },
  mainInput: { flex: 1, backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 8, padding: 12, minHeight: 45 },
  publishBtn: { backgroundColor: '#07C160', padding: 12, borderRadius: 8, marginLeft: 10 },
  card: { padding: 15, borderBottomWidth: 0.5, borderColor: '#222' },
  postMain: { flexDirection: 'row' },
  avatar: { width: 45, height: 45, backgroundColor: '#333', borderRadius: 5, marginRight: 12 },
  uName: { color: '#576B95', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  uText: { color: '#ccc', fontSize: 16 },
  // 动态时间样式
  timeText: { color: '#555', fontSize: 12, marginTop: 8 },
  commentList: { backgroundColor: '#0a0a0a', marginLeft: 57, marginTop: 10, padding: 8, borderRadius: 4 },
  cItemRow: { flexDirection: 'row', marginBottom: 4, flexWrap: 'wrap', alignItems: 'center' },
  cUser: { color: '#576B95', fontWeight: 'bold', fontSize: 13 },
  cContent: { color: '#888', fontSize: 13, flex: 1 },
  // 评论时间样式
  cTime: { color: '#333', fontSize: 10, marginLeft: 5 },
  commentInputArea: { flexDirection: 'row', marginLeft: 57, marginTop: 10, alignItems: 'center' },
  miniInput: { flex: 1, backgroundColor: '#151515', color: '#fff', padding: 8, borderRadius: 4, marginRight: 10, height: 35 },
  sendLink: { color: '#576B95', fontWeight: 'bold' }
});