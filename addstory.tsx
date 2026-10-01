// import { Petemoss } from "@expo-google-fonts/Petemoss";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { useFonts } from "expo-font";
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddGroup() {

    const params = useLocalSearchParams();
    const userId = params.userId;

    const [caption, setCaption] = useState("");
    const [Description, setDescription] = useState("");

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

    async function add() {

        if (image === "" && Description === "") {
            alert("Please Enter Creditial to continue");
        } else {
            const data = {
                userId: userId,
                image: imageBase64,
                caption: caption,
            }

            // console.log(userId)

            try {

                const response = await fetch("http://10.61.191.126:3000/story/addnew",
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
                    router.back();
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

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            // aspect: [4, 4],
            quality: 1,
            allowsMultipleSelection: false,
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

    function remove() {
        setImage(null);
        setImageBase64(null)

        console.log("hello")
    }


    return (
        <SafeAreaView style={styles.safearea} >
            <KeyboardAvoidingView style={{ flex: 1, width: "100%" }} behavior={Platform.OS === "ios" ? "padding" : "height"}>

                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                    <View style={{ marginTop: 40 }}>
                        <Pressable onPress={pickImage}>
                            <Modal
                                visible={true}
                                transparent={true}
                                animationType="fade"
                            // onRequestClose={() => setSelectedImage(null)}  // For Android back button
                            >
                                <TouchableOpacity
                                    style={styles.fullScreenOverlay}
                                    activeOpacity={1}
                                // onPress={() => setSelectedImage(null)}
                                >

                                    <View style={styles.headerView}>
                                        <View style={styles.headerViewbox}>
                                            <Pressable style={{ alignItems: "flex-start", width: "100%", flexDirection: "row", }}>
                                                <Pressable style={{ width: "85%" }} onPress={
                                                    () => { router.back(); }
                                                }>
                                                    <MaterialIcons name="arrow-back-ios-new" size={44} color="white" />
                                                </Pressable>
                                                <Pressable style={{ width: "10%" }} onPress={
                                                    remove
                                                }>
                                                    <FontAwesome name="close" size={44} color="white" />
                                                </Pressable>
                                            </Pressable>
                                        </View>
                                    </View>
                                    {image ? (
                                        <Image
                                            source={{ uri: image || undefined }}
                                            style={styles.fullScreenImage}
                                            resizeMode="contain"
                                        />
                                    ) : (
                                        <Pressable style={styles.cambox} onPress={pickImage}>
                                            <Entypo name="camera" size={54} color="white" />
                                            <Text style={{ fontSize: 30, color: "white" }}>Add a Image</Text>
                                        </Pressable>
                                    )}

                                    <View style={styles.caption}>
                                        <TextInput style={{ color: "white" }} placeholder='Caption' placeholderTextColor={"white"} value={caption} onChangeText={setCaption} />
                                    </View>

                                    <Pressable onPress={add} style={styles.btn}>
                                        <Text style={{ color: "white", fontSize: 16 }}>Add To my Story.</Text>
                                    </Pressable>


                                </TouchableOpacity>
                            </Modal>
                        </Pressable>
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
        top: -40,
        backgroundColor: "#dfd5c4"
    },

    headerMain: {
        flexDirection: "row",
        alignItems: "flex-start",
        width: "100%",
        // marginTop: 20,
        alignContent: "center",
        gap: 10,
    },

    header: {
        fontSize: 30,
        fontFamily: "Playwrite",
        // marginTop: 40,
    },

    image: {
        width: 350,
        height: 650,
        borderRadius: 20,
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
        flex: 1,
        borderRadius: 100,
        width: "100%",
        padding: 10,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center"
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
        backgroundColor: "#00347d",
        paddingHorizontal: 16,
        paddingVertical: 10,
        bottom: 30,
        alignItems: "center",
        width: "80%"
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
    },

    desInput: {
        width: "100%",
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        height: 80,
        textAlignVertical: "top"
    },

    headerView: {
        flexDirection: "row",
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',

        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        height: 60,
        zIndex: 1000,
        // paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,

    },

    headerViewbox: {
        flexDirection: "row",
        width: "100%",
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: -35,
        borderRadius: 40,
        padding: 10
    },

    fullScreenOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    fullScreenImage: {
        width: '100%',
        height: '100%',
    },

    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    caption: {
        position: 'absolute',
        bottom: 90,
        alignSelf: "center",
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: "80%"
    },

    closeText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },




})









































