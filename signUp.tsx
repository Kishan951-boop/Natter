// import { Petemoss } from "@expo-google-fonts/Petemoss";
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFonts } from "expo-font";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {

    const [isHidden, setHide] = useState(true);
    const [isConHidden, setConHide] = useState(true);
    const [nickName, setnickName] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [conpassword, setConPassword] = useState("");
    const apiURL = process.env.EXPO_PUBLIC_API_URL;

    const [image, setImage] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);

    const router = useRouter();

    const [fontLoaded] = useFonts({
        "Playwrite": require("../assets/fonts/Playwritet.ttf"),
    });

    if (!fontLoaded) {
        console.warn("Font not loaded yet");
        return null;
    }

    async function signUp() {

        if (nickName === "" && mobile === "" && password === "" && conpassword === "") {
            alert("Please Enter Creditial to continue");
        } else {
            if (mobile.length < 10) {
                alert("Mobile number should be include 10 Numbers");
            } else {
                if (password !== conpassword) {
                    alert("Password should be equal to confirm password");
                } else {

                    const data = {
                        nickName: nickName,
                        mobile: mobile,
                        password: password,
                        profileImage: imageBase64
                    }

                    // console.log(nickName, mobile, password, conpassword)

                    try {

                        const response = await fetch(apiURL + "/user/signUp",
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(data),
                            }
                        );

                        if (response.ok) {
                            const data = await response.json();
                            // console.log(data.msg);
                            alert(data.msg);
                            router.push("/")
                        } else {
                            const data = await response.json();
                            // console.log("we fucked up");
                            alert(data.msg)
                        }

                    } catch (err) {
                        console.error(err);
                        alert("Network error or server is unreachable. Please check your connection.");
                    }


                }
            }
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library.
        // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
        // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
        // so the app users aren't surprised by a system dialog after picking a video.
        // See "Invoke permissions for videos" sub section for more details.
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
            base64: true,
        });

        console.log(result);
        // const data = await result.json();
        // console.log(data.msg);

        if (!result.canceled) {
            // setImage(result.assets[0].uri);
            // setImageBase64(result.assets[0].base64);

            const asset = result.assets[0];

            setImage(asset.uri ?? null);
            setImageBase64(asset.base64 ?? null);
            // console.log("Base64 length:", result.assets[0].base64.length);

        }
    };


    return (
        <SafeAreaView style={styles.safearea} >
            <KeyboardAvoidingView style={{ flex: 1, width: "100%" }} behavior={Platform.OS === "ios" ? "padding" : "height"}>

                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>


                    <View style={styles.headerMain}>
                        <View style={{ marginTop: 50 }}>
                            <Image style={styles.imagelogo}
                                source={require("../assets/images/natter.png")}
                            />
                        </View>
                        <View>
                            <Text style={styles.header}>Create an Account</Text>
                            <Text style={{}}>Join Natter and connect with your friends and family.</Text>
                        </View>
                    </View>


                    <View style={{ marginTop: 40 }}>
                        <Pressable onPress={pickImage}>
                            {image ?
                                <Image style={styles.image}
                                    source={{
                                        uri: image
                                    }} />
                                : (<Image style={styles.image}
                                    source={{
                                        uri: "https://i.pinimg.com/736x/68/31/12/68311248ba2f6e0ba94ff6da62eac9f6.jpg"
                                    }} />
                                )
                            }
                        </Pressable>
                        <Pressable style={styles.cambox} onPress={pickImage}>
                            <Entypo name="camera" size={24} color="black" />
                            {/* <View style={styles.container}>
                                <Button title="Pick an image from camera roll" onPress={pickImage} />
                                {image && <Image source={{ uri: image }} style={styles.image} />}
                            </View> */}
                        </Pressable>
                    </View>

                    <View style={styles.topbox}>




                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <Feather name="user" size={24} color="black" />
                            <Text style={styles.inputtext}>Nick Name</Text>
                        </View>
                        <TextInput placeholder="User_John" style={styles.input} onChangeText={setnickName} />
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
                                    source={isConHidden ? require("../assets/images/eye.png") : require("../assets/images/hidden.png")}
                                />
                            </Pressable>

                        </View>





                        <Pressable onPress={signUp} style={styles.btn}>
                            <Text style={{ color: "white", fontSize: 16 }}>Sign Up.</Text>
                        </Pressable>
                        <View style={styles.partbox}>
                            <Text style={styles.parttxt} onPress={() => { router.back() }}>Already have an account? Sign In.</Text>
                        </View>


                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
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

    headerMain: {
        flexDirection: "row",
        alignItems: "flex-start",
        width: "90%",
        // marginTop: 20,
        alignContent: "center",
        gap: 10,
    },

    imagelogo: {
        width: 50,
        height: 50,
        padding: 10,
    },

    header: {
        fontSize: 30,
        fontFamily: "Playwrite",
        marginTop: 40,
    },

    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        padding: 20,
        borderWidth: 1,
        borderColor: "#000000",
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


    cambox: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#ccc",
        borderRadius: 100,
        padding: 5,
        borderWidth: 1,
    },

    topbox: {
        width: "90%",
        gap: 10,
        padding: 20,
        marginTop: 10,
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
        justifyContent: "center",
        marginTop: 5,
        width: "95%",
    },

    parttxt: {
        color: "#555",
        fontSize: 16,
    }

})
























