// import { Petemoss } from "@expo-google-fonts/Petemoss";
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { useFonts } from "expo-font";
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddGroup() {

    const params = useLocalSearchParams();
    const userId = params.userId;

    const [Groupname, setgroupName] = useState("");
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

        if (Groupname === "" && Description === "") {
            alert("Please Enter Creditial to continue");
        } else {
            const data = {
                Groupname: Groupname,
                Description: Description,
                image: imageBase64,
                userId: userId
            }

            console.log(userId)

            try {

                const response = await fetch("http://10.61.191.126:3000/group/addnewgroup",
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
                    router.back();
                } else {
                    const data = await response.json();
                    console.log("we fucked up");
                    alert(data.msg)
                }

            } catch (err) {
                console.error(err);
                alert("Network error or server is unreachable. Please check your connection.");
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


                <View style={styles.headerView}>
                    <View style={styles.headerViewbox}>
                        <Pressable style={{ alignItems: "flex-start", width: "10%" }} onPress={() => { router.back(); }}>
                            <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
                        </Pressable>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                    <View style={{ marginTop: 40 }}>
                        <Pressable onPress={pickImage}>
                            {image ?
                                <Image style={styles.image}
                                    source={{
                                        uri: image
                                    }} />
                                : (<Image style={styles.image}
                                    source={{
                                        uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfIFwG8Lmyit54lzsWhUNZu8PslyoQ3nKmM1sNVLRuJw&s=10"
                                    }} />
                                )
                            }
                        </Pressable>
                        <Pressable style={styles.cambox} onPress={pickImage}>
                            <Entypo name="camera" size={34} color="black" />
                        </Pressable>
                    </View>

                    <View style={styles.topbox}>




                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <FontAwesome name="group" size={20} color="black" />
                            <Text style={styles.inputtext}>Group Name</Text>
                        </View>
                        <TextInput placeholder="Family meet" style={styles.input} onChangeText={setgroupName} value={Groupname} />
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <AntDesign name="exclamation-circle" size={20} color="black" />
                            <Text style={styles.inputtext}>Group description.</Text>
                        </View>
                        <TextInput
                            placeholder="" style={styles.desInput}
                            value={Description}
                            onChangeText={setDescription}
                            multiline={true}
                            numberOfLines={4}
                            blurOnSubmit={false}
                            maxLength={100}
                        />




                        <Pressable onPress={add} style={styles.btn}>
                            <Text style={{ color: "white", fontSize: 16 }}>Create group.</Text>
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
        top: 50,
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
        width: 250,
        height: 250,
        borderRadius: 150,
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
        bottom: 8,
        right: 10,
        backgroundColor: "#ccc",
        borderRadius: 100,
        padding: 10,
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
        width: "95%",
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: -35,
        borderRadius: 40,
        padding: 10
    },

})
















































