import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {

    const router = useRouter();

    const [isHidden, setHide] = useState(true);
    const [isConHidden, setConHide] = useState(true);

    const [userId, setuserId] = useState<string | undefined>();
    const [userMobile, setUserMobile] = useState<string | undefined>();
    const [userMobile2, setUserMobile2] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const [conpassword, setConPassword] = useState("");
    const [password2, setPassword2] = useState<string | undefined>();

    useEffect(() => {

        async function getUser() {

            const userString = await AsyncStorage.getItem("user");

            if (userString) {

                const userObj = JSON.parse(userString);
                setuserId(userObj.user_ID);
                setUserMobile2(userObj.Mobile_number);
                // setUserPFP(userObj.Profile_Image);
                // setDescription(userObj.Description);
                setPassword2(userObj.Password);

                // console.log(userObj);

            }

        }

        getUser();

    }, []);


    const updateUserProfile = async (newDetails: { status: any, details: any; }) => {
        try {
            // 1. Get the current user from storage
            const existingData = await AsyncStorage.getItem("user");

            if (!existingData) {
                console.log("No user found in storage!");
                return;
            }

            // 2. Parse the old data into a JavaScript object
            const parsedUser = JSON.parse(existingData);

            // 3. Merge the old data with your new updates
            // This keeps user_ID, Mobile_number, and Password safe!

            let updatedUser = parsedUser;
            if (newDetails.status === "mobile") {
                updatedUser = {
                    ...parsedUser,
                    Mobile_number: newDetails.details,
                };
            } else if (newDetails.status === "password") {
                updatedUser = {
                    ...parsedUser,
                    Password: newDetails.details,
                };
            }

            // 4. Save it back (this automatically overwrites the old one)
            await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

            console.log("User profile updated successfully!");
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };

    const logoutUser = async () => {
        try {
            // 1. Delete ONLY the "user" key from storage
            await AsyncStorage.removeItem("user");

            alert("User Logout has successfull.")
            router.push("/")

            // 2. (CRITICAL) Navigate user back to Login screen
            // If you're using React Navigation:
            // navigation.reset({ index: 0, routes: [{ name: 'Login' }] });

            // If you're using a state management like Redux/Zustand, clear that state here too!
            // e.g., dispatch(setUser(null));

        } catch (error) {
            console.error("Logout failed:", error);
            // Optionally show an alert to the user that logout failed
        }
    };


    async function updateMobile() {

        if (userMobile) {
            if (userMobile.length === 10) {

                const data = {
                    userId: userId,
                    mobile: userMobile,
                }

                // console.log(userMobile)

                try {

                    const response = await fetch("http://10.61.191.126:3000/security/mobile",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(data),
                        }
                    );

                    if (response.ok) {
                        const data = await response.json();
                        console.log(data.msg);
                        alert(data.msg);
                        console.log(data.user)

                        // Usage: Update only the name and age
                        await updateUserProfile({
                            status: "mobile",
                            details: userMobile, // Your new nickname
                        });

                    } else {
                        const data = await response.json();
                        console.log("we fucked up");
                        alert(data.msg)
                    }

                } catch (err) {
                    console.error(err);
                    alert("Network error or server is unreachable. Please check your connection.");
                }


            } else {
                alert("Please Enter Correct Creditial to continue");
            }

        } else {
            alert("Please Enter Creditial to continue");
        }

    }

    async function updatePassword() {

        if (password && conpassword) {
            if (password === conpassword) {

                const data = {
                    userId: userId,
                    password: password,
                }

                // console.log(userMobile2)

                try {

                    const response = await fetch("http://10.61.191.126:3000/security/password",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(data),
                        }
                    );

                    if (response.ok) {
                        const data = await response.json();
                        console.log(data.msg);
                        alert(data.msg);
                        console.log(data.user)

                        // Usage: Update only the name and age
                        await updateUserProfile({
                            status: "password",
                            details: password, // Your new nickname
                        });

                    } else {
                        const data = await response.json();
                        // console.log("we fucked up");
                        alert(data.msg)
                    }

                } catch (err) {
                    console.error(err);
                    alert("Network error or server is unreachable. Please check your connection.");
                }


            } else {
                alert("Please Enter Correct Creditial to continue");
            }

        } else {
            alert("Please Enter Creditial to continue");
        }

    }


    const [fontLoaded] = useFonts({
        "Playwrite": require("../../assets/fonts/Playwritet.ttf"),
    });

    if (!fontLoaded) {
        console.warn("Font not loaded yet");
        return null;
    }


    return (
        <SafeAreaView style={styles.safearea}>

            <KeyboardAvoidingView style={{ flex: 1, width: "100%" }} behavior={Platform.OS === "ios" ? "padding" : "height"}>


                <View style={styles.headerView}>
                    <View style={styles.headerViewbox}>
                        <Pressable style={{ alignItems: "flex-start", width: "10%" }} onPress={() => { router.back(); }}>
                            <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
                        </Pressable>
                        <View style={{ flexDirection: "row", justifyContent: "center", width: "80%" }}>
                            <Text style={{ fontSize: 25, color: "#480000" }}>Security Updates.</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "flex-end", width: "10%" }}>
                            {/* <Entypo name="dots-three-vertical" size={24} color="black" style={{ marginTop: 2 }} /> */}
                        </View>
                    </View>
                </View>


                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>




                    <View style={styles.topbox}>

                        <View style={styles.notice}>
                            <MaterialCommunityIcons name="shield-lock" size={80} color="black" />
                            <View style={styles.textnotice} >
                                <Text style={{ fontSize: 20 }}>Please Be aware what you do in the security updating;</Text>
                                <Text style={{ fontSize: 15, color: "#6e0000" }}>This will affect to your Account.</Text>
                            </View>
                        </View>


                        <View style={styles.boxes}>

                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                <FontAwesome name="phone" size={20} color="black" />
                                <Text style={styles.inputtext}>Mobile Number</Text>
                            </View>
                            <TextInput placeholder="07X-XXX-XXXX" style={styles.input}
                                onChangeText={setUserMobile}
                                keyboardType='numeric'
                            />




                            <Pressable
                                onPress={updateMobile}
                                // onPress={() => {console.log(mobile, password)}}
                                style={({ pressed }) => [
                                    styles.btn,
                                    { backgroundColor: pressed ? "#3d6095" : "#24355d" }
                                ]}

                            >
                                <Text style={{ color: "white", fontSize: 16 }}>Update Mobile Number.</Text>
                            </Pressable>

                        </View>

                        <View style={styles.boxes}>

                            {/* <View style={styles.orview}>
                                <View style={{ flex: 1, height: 2, backgroundColor: "#000000", marginTop: -50 }} />
                            </View> */}

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
                                        source={isHidden ? require("../../assets/images/eye.png") : require("../../assets/images/hidden.png")}
                                    />
                                </Pressable>

                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                <MaterialIcons name="password" size={24} color="black" />
                                <Text style={styles.inputtext}>Confirm Password</Text>
                            </View>

                            <View style={styles.passwordbox}>

                                <TextInput placeholder="XXX-XXX-XXX" style={styles.passwordinput}
                                    onChangeText={setConPassword}
                                    secureTextEntry={isConHidden}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <Pressable onPress={() => { setConHide(!isConHidden) }}>
                                    <Image style={styles.passwordicon}
                                        source={isConHidden ? require("../../assets/images/eye.png") : require("../../assets/images/hidden.png")}
                                    />
                                </Pressable>

                            </View>

                            <Pressable
                                onPress={updatePassword}
                                // onPress={() => {console.log(mobile, password)}}
                                style={({ pressed }) => [
                                    styles.btn,
                                    { backgroundColor: pressed ? "#43953d" : "#245d29" }
                                ]}

                            >
                                <Text style={{ color: "white", fontSize: 16 }}>Update Password.</Text>
                            </Pressable>

                        </View>

                        <View>

                            <View style={styles.orview}>
                                <View style={{ flex: 1, height: 2, backgroundColor: "#000000", marginTop: -50 }} />
                            </View>


                            <Pressable
                                onPress={logoutUser}
                                // onPress={() => { console.log(userMobile2, password2) }}
                                style={({ pressed }) => [
                                    styles.btn,
                                    { backgroundColor: pressed ? "#953d3d" : "#4b0000" }
                                ]}

                            >
                                <Text style={{ color: "white", fontSize: 16 }}>Log Out.</Text>
                            </Pressable>

                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView >
    );
}

const styles = StyleSheet.create({

    safearea: {
        flex: 1,
        backgroundColor: "#dfd5c4",
        alignItems: "center"
    },

    headerView: {
        flexDirection: "row",
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',

        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        zIndex: 1000,
        paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,

    },

    headerViewbox: {
        flexDirection: "row",
        width: "95%",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -35,
        backgroundColor: '#7d8242',
        borderRadius: 40,
        padding: 10
    },

    container: {
        flexGrow: 1,
        alignItems: "center",
        // justifyContent: "center",
        backgroundColor: "#dfd5c4",
        marginTop: 50
    },

    headerViewMain: {
        // flexDirection: "row",
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
        gap: 40,
        padding: 20,
        marginTop: 50,
        flex: 1,
        // justifyContent: "center"
    },

    boxes: {
        gap: 10
    },

    notice: {
        // flex: 1,
        flexDirection: "row",
        width: "78%"
    },

    textnotice: {
        marginTop: 10,
        flexDirection: "column",
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
