import { Stack } from "expo-router";

export default function UserLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="profile" />
            <Stack.Screen name="Settings" />
            <Stack.Screen name="security" />
            {/* <Stack.Screen name="(tabs)" />
            <Stack.Screen name="chat"/> */}
        </Stack>
    );
}



































