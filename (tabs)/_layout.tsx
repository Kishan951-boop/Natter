import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="home" options={{
                tabBarLabel: "Chat",
                tabBarIcon: ({ color, size }) => {
                    return (
                        <MaterialCommunityIcons name="message-reply-text-outline" size={size} color={color} />
                    );
                }
            }} />
            <Tabs.Screen name="groups"
                options={{
                    tabBarLabel: "Groups",
                    tabBarIcon: ({ color, size }) => {
                        return (
                            <FontAwesome name="group" size={size} color={color} />
                        );
                    }
                }} />
            <Tabs.Screen name="story"
                options={{
                    tabBarLabel: "Story",
                    tabBarIcon: ({ color, size }) => {
                        return (
                            <MaterialCommunityIcons name="face-man-profile" size={size} color={color} />
                        );
                    }
                }} />
        </Tabs >
    );
}



































