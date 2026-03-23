import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 首页：即你的控制台选择页 */}
      <Stack.Screen name="index" options={{ title: '控制台' }} />
      
      {/* 分组路由：它们内部自带自己的 Tab，这里只需要隐藏外部边框 */}
      <Stack.Screen name="(childTab)" />
      <Stack.Screen name="(parentTab)" />
    </Stack>
  );
}