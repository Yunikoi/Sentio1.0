import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCnLF3LaC0xDS35xQFT2PwDU3CifsPveeU",
  authDomain: "dualcare-efe4a.firebaseapp.com",
  // 必须是新加坡地址
  databaseURL: "https://dualcare-efe4a-default-rtdb.asia-southeast1.firebasedatabase.app", 
  projectId: "dualcare-efe4a",
  storageBucket: "dualcare-efe4a.firebasestorage.app",
  messagingSenderId: "850821143653",
  appId: "1:850821143653:web:c1fd546db2f6fccfafa8c"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// 修复 Route missing default export 警告
export default function FirebaseStub() { return null; }