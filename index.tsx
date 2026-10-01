// import { Petemoss } from "@expo-google-fonts/Petemoss";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

    const router = useRouter();

    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [isHidden, setHide] = useState(true);
    const [isLoading, setLoading] = useState(true);
    const apiURL = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {

        async function checkUser() {
            const user = await AsyncStorage.getItem("user")

            if (user) {
                router.replace("/(tabs)/home")
            } else {

                setLoading(false);

            }

        }

        checkUser();

    }, [router]);

    const [fontLoaded] = useFonts({
        "Playwrite": require("../assets/fonts/Playwritet.ttf"),
    });

    if (!fontLoaded) {
        console.warn("Font not loaded yet");
        return null;
    }

    async function signin() {

        if (mobile !== "" && password !== "") {

            const loginData = {
                mobile: mobile,
                password: password
            };

            try {

                const response = await fetch(apiURL + "/user/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData),
                });

                if (response.ok) {
                    const data = await response.json();
                    // console.log(data.user);
                    await AsyncStorage.setItem("user", JSON.stringify(data.user));
                    alert("Login Successful");
                    router.push("/(tabs)/home")
                } else {


                    const data = await response.json();
                    // console.log(data.msg);
                    alert(data.msg);


                }

            } catch (err) {
                console.error(err);
            }
        } else {
            alert("Please enter the creditial to continue!")
        }

    }


    return (
        <SafeAreaView style={styles.safearea} >
            <KeyboardAvoidingView style={{ flex: 1, width: "100%" }} behavior={Platform.OS === "ios" ? "padding" : "height"}>

                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                    <View style={styles.headerViewMain}>
                        <View style={styles.headerView}>
                            <Text style={styles.headertxt}>Login Account.</Text>
                            <View style={{ padding: 10 }}>
                                <FontAwesome5 name="user" size={24} color="black" />
                            </View>
                        </View>
                        <View>
                            <Text style={{}}>Well come back, Enjoy time with you friends.</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 50 }}>
                        <Image style={styles.image}
                            source={require("../assets/images/natter.png")}
                        />
                    </View>
                    <Text style={styles.header}>Natter.</Text>

                    <View style={styles.topbox}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <FontAwesome name="phone" size={20} color="black" />
                            <Text style={styles.inputtext}>Mobile Number</Text>
                        </View>
                        <TextInput placeholder="07X-XXX-XXXX" style={styles.input} onChangeText={setMobile}
                            keyboardType='numeric'
                        />
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <MaterialIcons name="password" size={24} color="black" />
                            <Text style={styles.inputtext}>Password</Text>
                        </View>

                        <View style={styles.passwordbox}>

                            <TextInput placeholder="XXX-XXX-XXX" style={styles.passwordinput}
                                onChangeText={setPassword}
                                secureTextEntry={isHidden}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <Pressable style={({ pressed }) => { }} onPress={() => { setHide(!isHidden) }}>
                                <Image style={styles.passwordicon}
                                    source={isHidden ? require("../assets/images/eye.png") : require("../assets/images/hidden.png")}
                                />
                            </Pressable>

                        </View>

                        <View style={styles.partbox}>
                            {/* <Text style={styles.parttxt} onPress={() => { router.push("/forgotpw") }}>Forgot Password?</Text> */}
                            {/* <Text style={styles.parttxt} onPress={() => { router.push("/Logins/signUp") }}>Sign Up</Text> */}
                        </View>
                        <Pressable
                            onPress={signin}
                            // onPress={() => {console.log(mobile, password)}}
                            style={({ pressed }) => [
                                styles.btn,
                                { backgroundColor: pressed ? "#95953d" : "#5d5d24" }
                            ]}

                        >
                            <Text style={{ color: "white", fontSize: 16 }}>Sign In.</Text>
                        </Pressable>

                        <View style={styles.orview}>
                            <View style={{ flex: 1, height: 2, backgroundColor: "#000000" }} />
                            <Text style={{ marginHorizontal: 10, color: "#555" }}>OR</Text>
                            <View style={{ flex: 1, height: 2, backgroundColor: "#000000" }} />

                        </View>

                        <Pressable onPress={() => { router.push("/signUp") }}
                            style={({ pressed }) => [
                                styles.btncreate,
                                { backgroundColor: pressed ? "#583104" : "#2a1905" }
                            ]}
                        >
                            <Text style={{ color: "white", fontSize: 16 }}>Create Account.</Text>
                        </Pressable>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({

    safearea: {
        flex: 1,
        backgroundColor: "#dfd5c4"
    },

    container: {
        flexGrow: 1,
        alignItems: "center",
        // justifyContent: "center",
        backgroundColor: "#dfd5c4"
    },

    headerViewMain: {
        // flexDirection: "row",
        alignItems: "flex-start",
        width: "90%",
        marginTop: 20,
    },

    headerView: {
        flexDirection: "row",
        alignItems: "flex-start",
        width: "90%",
        marginTop: 20,
    },

    headertxt: {
        fontSize: 35,
    },

    header: {
        fontSize: 30,
        fontFamily: "Playwrite",
        // marginTop: 50,
    },

    image: {
        width: 100,
        height: 100,
        // borderRadius: 50,
        padding: 20,
        // borderWidth: 1,
        // borderColor: "#000000",
    },

    topbox: {
        width: "90%",
        gap: 10,
        padding: 20,
        marginTop: 20,
    },

    inputtext: {
        fontSize: 16,
    },

    input: {
        width: "100%",
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },

    passwordbox: {
        flexDirection: "row",
        width: "100%",
        borderWidth: 1,
        // padding: 10,
        borderRadius: 10,
        height: 40,
        justifyContent: "center"
    },

    passwordinput: {
        width: "87%",
        fontSize: 15,
        paddingVertical: 5
    },

    passwordicon: {
        width: 26,
        height: 26,
        marginTop: 6
    },

    btn: {
        borderRadius: 8,
        backgroundColor: "#5d5d24",
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginTop: 10,
        alignItems: "center",
    },

    partbox: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
        width: "95%"
    },

    parttxt: {
        color: "#555",
        fontSize: 14
    },

    orview: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 20,

    },

    btncreate: {
        borderRadius: 8,
        backgroundColor: "#2a1905",
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 20,
    }

})





















