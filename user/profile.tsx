import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Profile() {

    const router = useRouter();

    const [isValid, setIsValid] = useState(true);
    const [userName, setNameUser] = useState<string | undefined>();
    const [userId, setUserId] = useState<string | undefined>();
    const [userPFP, setUserPFP] = useState<string | undefined>();
    const [description, setDescription] = useState<string | undefined>();
    // const [description, setDescription] = useState('');
    // const [password, setPassword] = useState<string | undefined>();
    const [email, setEmail] = useState<string | undefined>();
    const [image, setImage] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);

    const descLength = description?.length ?? 0;


    useEffect(() => {

        async function getUser() {

            const userString = await AsyncStorage.getItem("user");

            if (userString) {

                const userObj = JSON.parse(userString);
                setNameUser(userObj.nick_name);
                // setUserMobile(userObj.Mobile_number);
                setUserPFP(userObj.Profile_Image);
                setDescription(userObj.Description);
                setEmail(userObj.Email);
                setUserId(userObj.user_ID);

                // console.log(userObj);

            }

        }

        getUser();

    }, []);

    const [fontLoaded] = useFonts({
        "Playwrite": require("../../assets/fonts/Playwritet.ttf"),
    });

    if (!fontLoaded) {
        console.warn("Font not loaded yet");
        return null;
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

        // console.log(result);
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



    const handleEmailChange = (text: string) => {
        setEmail(text);

        // Simple regex for email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Updates state with true or false
        setIsValid(emailRegex.test(text));
    };


    const updateUserProfile = async (newDetails: { Description: any; Email: any; Profile_Image: any; nick_name: any; }) => {
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
            const updatedUser = {
                ...parsedUser,
                Description: newDetails.Description,
                Email: newDetails.Email,
                Profile_Image: newDetails.Profile_Image,
                nick_name: newDetails.nick_name,
            };

            // 4. Save it back (this automatically overwrites the old one)
            await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

            console.log("User profile updated successfully!");
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };



    async function update() {

        if (userName === "" && email === "" && description === "") {
            alert("Please Enter Creditial to continue");
        } else {
            if (isValid || email === "-") {

                // if (image) {
                //     setUserPFP(image)
                // }

                const data = {
                    nickName: userName,
                    email: email,
                    description: description,
                    profileImage: imageBase64,
                    oldImage : userPFP,
                    userId: userId
                }

                // console.log(userName, email, description, userId)

                try {

                    const response = await fetch("http://10.61.191.126:3000/user/update",
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
                        // console.log(data.user.nick_name)

                        // Usage: Update only the name and age
                        await updateUserProfile({
                            Description: data.user.Description,
                            Email: data.user.Email,
                            Profile_Image: data.user.Profile_Image,
                            nick_name: data.user.nick_name, // Your new nickname
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
                alert("Email is not valid");
            }

        }

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
                            <Text style={{ fontSize: 25 }}>User profile.</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "flex-end", width: "10%" }}>
                            <Entypo name="dots-three-vertical" size={24} color="black" style={{ marginTop: 2 }} />
                        </View>
                    </View>
                </View>




                <ScrollView contentContainerStyle={{ marginTop: 50 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>

                        <View style={{ marginTop: 40 }}>
                            <Pressable onPress={pickImage}>
                                {image ? (
                                    <Image style={styles.image}
                                        source={{
                                            uri: image
                                        }} />
                                ) : userPFP === "null" || !userPFP ? (
                                    <Image style={styles.image}
                                        source={{
                                            uri:
                                                "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                                        }} />
                                ) : (
                                    <Image style={styles.image}
                                        source={{
                                            uri: "http://10.61.191.126:3000/uploads/profilePics/" + userPFP
                                        }} />
                                )}
                            </Pressable>
                            <Pressable style={styles.cambox} onPress={pickImage}>
                                <Entypo name="camera" size={30} color="black" />
                                {/* <View style={styles.container}>
                                <Button title="Pick an image from camera roll" onPress={pickImage} />
                                {image && <Image source={{ uri: image }} style={styles.image} />}
                            </View> */}
                            </Pressable>
                        </View>

                        {/* <Text style={styles.header}>Natter.</Text> */}

                        <View style={styles.topbox}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                <MaterialCommunityIcons name="rename" size={24} color="black" />
                                <Text style={styles.inputtext}>Nick name</Text>
                            </View>
                            <TextInput
                                placeholder="John_Wick"
                                style={styles.input}
                                value={userName}
                                onChangeText={setNameUser}
                            />
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                <MaterialIcons name="alternate-email" size={20} color="black" />
                                <Text style={styles.inputtext}>Email</Text>
                            </View>
                            <TextInput
                                placeholder="Example@gmail.com"
                                style={styles.input}
                                value={email}
                                onChangeText={handleEmailChange}
                                keyboardType="email-address"
                                inputMode="email"
                                autoComplete="email"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                <AntDesign name="exclamation-circle" size={16} color="black" style={{ marginTop: 3 }} />
                                <Text style={styles.inputtext}>Description</Text>
                                <Text>
                                    ({100 - descLength})
                                </Text>
                            </View>
                            <TextInput
                                placeholder="" style={styles.desInput}
                                value={description}
                                onChangeText={setDescription}
                                multiline={true}
                                numberOfLines={4}
                                blurOnSubmit={false}
                                maxLength={100}
                            />

                            <Pressable
                                onPress={update}
                                // onPress={() => {console.log(mobile, password)}}
                                style={({ pressed }) => [
                                    styles.btn,
                                    { backgroundColor: pressed ? "#5b7457" : "#2e5e20" }
                                ]}
                            >
                                <Text style={{ color: "white", fontSize: 16 }}>Update details.</Text>
                            </Pressable>

                            <View style={styles.orview}>
                                <View style={{ flex: 1, height: 2, backgroundColor: "#000000" }} />
                            </View>

                            <Pressable onPress={() => { router.push("/user/security") }}
                                style={({ pressed }) => [
                                    styles.btncreate,
                                    { backgroundColor: pressed ? "#2d403c" : "#051a2a" }
                                ]}
                            >
                                <Text style={{ color: "white", fontSize: 16 }}>Security changes.</Text>
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

    container: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
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

    headertxt: {
        fontSize: 35,
    },

    header: {
        fontSize: 30,
        fontFamily: "Playwrite",
        // marginTop: 50,
    },

    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        padding: 20,
        borderWidth: 1,
        borderColor: "#000000",
    },

    cambox: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#ccc",
        borderRadius: 100,
        padding: 10,
        borderWidth: 1,
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

    desInput: {
        width: "100%",
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        height: 80,
        textAlignVertical: "top"
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


});




























