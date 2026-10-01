import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="signUp" />
            <Stack.Screen name="forgotpw" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="chat" />
            <Stack.Screen name="user" />
            <Stack.Screen name="addchat" />
            <Stack.Screen name="groupChat" />
            <Stack.Screen name="groupprofile" />
            <Stack.Screen name="groupEdit" />
            <Stack.Screen name="addMem" />
            <Stack.Screen name="addgroup" />
            <Stack.Screen name="addstory" />
        </Stack>
    );
}




























