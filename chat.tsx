import { Ionicons } from "@expo/vector-icons";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {

    const router = useRouter();

    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState<string[]>([]);
    const [imageBase64, setImageBase64] = useState<string[]>([]);
    const [userName, setUserName] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [loggeduserId, setloggeduserId] = useState("");

    const webSocket = useRef<WebSocket>(null);
    const apiURL = process.env.EXPO_PUBLIC_API_URL;
    const wsURL = process.env.EXPO_PUBLIC_WS_URL;

    const [chatHistory, setChatHistory] = useState<any>();
    const [chatImage, setChatImage] = useState<any[]>([]);
    const [chatImages, setChatImages] = useState<any[]>([]);
    const [text, setText] = useState<any>("");
    const [loguser, setLogUser] = useState<string | undefined>("");

    const params = useLocalSearchParams();
    const chatId = params.chatId;
    const userId = params.userId;
    const userMobile = params.userMobile;
    const logedUser = params.loguser;
    const userDes = params.userDes;

    const [selectImageId, setSelectImageId] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);


    useEffect(() => {
        setUserName(params.nickName + "");
        setProfilePic(params.profilPic + "");

        getuser();
        loadChatHistory();
        read();

        async function getuser() {

            const user = await AsyncStorage.getItem("user");
            let userObj: any

            if (user) {
                userObj = JSON.parse(user);
                setLogUser(userObj.Mobile_number)
                setloggeduserId(userObj.user_ID)
            }
        }

        Websocketconnection();

    }, []);

    async function Websocketconnection() {

        webSocket.current = new WebSocket("ws://10.61.191.126:3000");

        webSocket.current.onopen = () => {
            console.log("Connect to the websocket")

            if (webSocket.current) {

                // console.log(logedUser)

                if (logedUser) {

                    const data = {
                        type: "register",
                        data: logedUser,
                    };

                    webSocket.current.send(JSON.stringify(data));
                }

            }

        }

        webSocket.current.onmessage = (event) => {
            const { chatMessage, images } = JSON.parse(event.data);

            // 1. Add message to history
            setChatHistory(old => [chatMessage, ...old]);

            // 2. Add images to chatImage state
            if (images && images.length > 0) {
                const newImages = images.map((imgName: string) => ({
                    Chat_History_History_ID: chatMessage.History_ID, // Ensure these match
                    Image: imgName
                }));
                setChatImage(old => [...newImages, ...old]);
            }
        }

        webSocket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            // console.log("Received:", message);

            if (message.type === "chat_message") {
                const { sender, reciever, message: text, images } = message.data;

                if (images === null) {



                    const { sender, reciever, message: text, images } = message.data;

                    // Build chat object
                    const chatEntry = {
                        sender,
                        reciever,
                        text,
                        images: images || []
                    };

                    const Recievemsg = {
                        // Chats_Chat_ID: id,
                        Message: text,
                        Sent_at: new Date().toISOString(),
                        Mobile_number: sender,
                    };


                    // Save message
                    setChatHistory(chat => [Recievemsg, ...chat]);



                } else {


                    const id = new Date().getTime();

                    // Build the message object in the shape your FlatList expects
                    const Recievemsg = {
                        Chats_Chat_ID: id,
                        Message: text,
                        Sent_at: new Date().toISOString(),
                        Mobile_number: sender,
                        Description: "-",   // fill defaults if needed
                        Email: "-",
                        History_ID: id,
                        Password: "hello",  // or whatever your backend provides
                        Profile_Image: "null",
                        Sender: reciever,   // adjust depending on your schema
                        Status: 3,
                        nick_name: "Kasun", // adjust if you have nickname
                        user_ID: reciever   // adjust if you have user id
                    };

                    // Build the image array in the shape your image FlatList expects
                    const imgArray = (images || []).map((element, index) => {
                        return {
                            Chat_History_History_ID: id,
                            Image: element.Image,       // filename from backend
                            Image_ID: index + 1,
                            Image_Image_ID: index + 1
                        };
                    });

                    // Save message
                    setChatHistory(chat => [Recievemsg, ...chat]);

                    // Save images
                    setChatImage(oldchat => [...imgArray, ...oldchat]);
                }
            }
        };

        webSocket.current.onerror = (err) => {
            console.log(err)
        }

    }

    async function read() {


        try {

            const response = await fetch(apiURL + "/chat-history/read?id=" + chatId + "&userId=" + userId);

            if (!response.ok) {
                const data = await response.json();
                console.log("we fucked up");
                alert(data.msg)
            }

        } catch (err) {
            console.error(err);
            alert("Network error or server is unreachable. Please check your connection.");
        }


    }

    async function loadChatHistory() {

        // const apiURL = process.env.EXPO_PUBLIC_API_URL;

        const response = await fetch("http://10.61.191.126:3000/chat-history/get?id=" + chatId);

        const data = await response.json();

        if (response.ok) {

            setChatHistory(data.chatHistory);
            setChatImage(data.Image);

            // console.log(data.Image);
            // console.log(chatImage.length)

        } else {
            console.log(response.status + " " + data.msg);
            alert("Something went wrong");
        }

    }

    function timeFormat(time: string) {
        const formattedTime = new Date(time).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        return formattedTime;

    }

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: false,
            allowsMultipleSelection: true,
            selectionLimit: 4,
            quality: 1,
            base64: true,
        });

        if (!result.canceled) {

            const uris = result.assets.map(asset => asset.uri);
            const base64s = result.assets.map(asset => asset.base64 || '');

            const limitedUris = uris.slice(0, 4);
            const limitedBase64s = base64s.slice(0, 4);

            setImage(limitedUris);
            setImageBase64(limitedBase64s);
            setIsImage(true);

            // 🔥 Show alert if user selected more than 4
            if (uris.length > 4) {
                Alert.alert('Limit Reached', 'You can only select up to 4 images at a time. The first 4 have been selected.');
            }

        }
    };

    return (
        <SafeAreaView style={styles.safearea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? "padding" : "height"}
                style={styles.keybord}
            >
                <View style={styles.headerView}>
                    <Pressable style={{ alignItems: "center" }} onPress={() => { router.back(); }}>
                        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
                    </Pressable>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={styles.imgbox}>
                            {profilePic === "null" ?
                                < Image style={styles.image}
                                    source={{
                                        uri:
                                            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                                    }} />
                                : (<Image style={styles.image}
                                    source={{
                                        uri: "http://10.61.191.126:3000/uploads/profilePics/" + profilePic
                                    }} />
                                )
                            }
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ width: "72%" }}>
                                <Text style={{ fontSize: 18 }}>{userName}</Text>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <View style={styles.status} />
                                    <Text style={{ paddingHorizontal: 5, width: "80%" }} numberOfLines={1}>{userDes}</Text>
                                </View>
                            </View>
                            <Pressable style={{ alignItems: "center" }}
                                onPress={() => {
                                    router.push(
                                        {
                                            pathname: "/chatProfile",
                                            params: {
                                                friendId: userId,
                                            }
                                        }
                                    )
                                }}
                            >
                                <Entypo name="dots-three-vertical" size={24} color="black" style={{ marginTop: 2 }} />
                            </Pressable>
                        </View>
                    </View>
                </View>

                <View style={styles.bodyView}>

                    <FlatList
                        data={chatHistory}
                        renderItem={({ item }) => {
                            const isMyMessage = String(item.Mobile_number) !== String(logedUser);
                            const istext = String(item.Message) === "";
                            const isRead = String(item.Status) === "3";
                            const isSend = String(item.Status) === "1";

                            return (

                                <View style={[styles.messageView,
                                {
                                    alignItems: isMyMessage ? "flex-start" : "flex-end"
                                }
                                ]}>

                                    {(() => {

                                        // console.log(chatImage)

                                        const matchedImage = chatImage.filter(
                                            el => el.Chat_History_History_ID === item.History_ID
                                        );

                                        if (matchedImage.length === 0) return null;

                                        // Case: only one image
                                        if (matchedImage.length === 1) {
                                            let imageUri = matchedImage[0].Image || "";

                                            if (
                                                !imageUri.startsWith('http') &&
                                                !imageUri.startsWith('file') &&
                                                !imageUri.startsWith('content')
                                            ) {
                                                // single chat images are stored in /uploads/Chats/
                                                imageUri = "http://10.61.191.126:3000/uploads/Chats/" + imageUri;
                                            }

                                            return (
                                                <TouchableOpacity
                                                    onPress={() => setSelectedImage(imageUri)}
                                                    activeOpacity={0.8}
                                                    style={{ marginBottom: 10 }}
                                                >
                                                    <Image
                                                        style={[styles.chatimage, { width: 200, height: 200 }]}
                                                        source={{ uri: imageUri }}
                                                    />
                                                </TouchableOpacity>
                                            );
                                        }

                                        return (
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    {matchedImage.map((imageItem, idx) => {
                                                        let imageUri = imageItem.Image || "";

                                                        if (
                                                            !imageUri.startsWith('http') &&
                                                            !imageUri.startsWith('file') &&
                                                            !imageUri.startsWith('content')
                                                        ) {
                                                            imageUri = "http://10.61.191.126:3000/uploads/Chats/" + imageUri;
                                                        }

                                                        return (
                                                            <TouchableOpacity
                                                                key={idx.toString()}
                                                                onPress={() => setSelectedImage(imageUri)}
                                                                activeOpacity={0.8}
                                                                style={{ marginRight: 10 }}
                                                            >
                                                                <Image
                                                                    style={[styles.chatimage, { width: 150, height: 150 }]}
                                                                    source={{ uri: imageUri }}
                                                                />
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            </ScrollView>
                                        );
                                    })()}

                                    {istext ? ("") :
                                        (<Text style={[styles.message,
                                        isMyMessage ?
                                            styles.receiveMsg
                                            :
                                            styles.sendMsg
                                        ]}>{item.Message}</Text>)
                                    }
                                    <Text style={styles.msgTime}>
                                        <Text>
                                            {timeFormat(item.Sent_at)}
                                        </Text>
                                        <Text> </Text>

                                        {isMyMessage ? ("")
                                            : isRead ?
                                                (<Text style={{ color: "#488eff" }}>✓✓</Text>)
                                                : isSend ?
                                                    (<Text>✓✓</Text>)
                                                    :
                                                    (<Text>✓</Text>)
                                        }
                                    </Text>
                                </View>





                            );
                        }}
                        inverted
                    />

                </View>

                <View style={{ width: "100%", display: "flex", alignSelf: "center" }}>
                    <View style={styles.setimgview}>

                        {isImage ? (
                            <View style={{ flexDirection: 'row' }}>
                                {image.map((uri, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setSelectedImage(uri)}
                                        activeOpacity={0.8}
                                    >
                                        <Image
                                            style={styles.selectchatimage}
                                            source={{ uri: uri }}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : null}
                        <View style={styles.cutbtn} />
                    </View>
                </View>

                <View style={styles.inputcontainer}>
                    <View style={styles.inputBox}>
                        <TextInput
                            placeholder="Type a message..."
                            style={styles.input}
                            value={text}
                            onChangeText={setText}
                        />
                        <Pressable style={{ marginEnd: 10 }} onPress={pickImage}>
                            <FontAwesome name="picture-o" size={24} color="black" />
                        </Pressable>
                    </View>
                    <View>
                        <Pressable style={styles.send}
                            onPress={() => {

                                // console.log(text);
                                if (text !== "" || image.length > 0) {

                                    if (webSocket.current) {

                                        const id = new Date().getTime();

                                        if (image.length > 0) {
                                            console.log(id);

                                            const msg = {
                                                Message: text,
                                                Sent_at: new Date().toISOString(),
                                                Mobile_number: loguser,
                                                History_ID: id
                                            };

                                            // Build an array of image objects
                                            const imgArray = image.map((element, index) => {
                                                return {
                                                    Chat_History_History_ID: id,
                                                    Image: element,              // use element directly
                                                    Image_base: imageBase64[index],         // start IDs at 1
                                                    Image_Image_ID: index + 1    // same as Image_ID
                                                };
                                            });

                                            console.log(imgArray);

                                            // Save message
                                            setChatHistory(oldchat => [msg, ...oldchat]);

                                            // Save images
                                            setChatImage(oldchat => [...imgArray, ...oldchat]);


                                            const msgdata = {
                                                data: text,
                                                reciever: userMobile,
                                                sender: loguser,
                                                chatId: chatId,
                                                senderId: loggeduserId,

                                            }

                                            const data = {
                                                type: "chat",
                                                msgDatas: msgdata,
                                                image: imgArray
                                            };

                                            webSocket.current.send(JSON.stringify(data));

                                            setImage([])
                                            setImageBase64([])
                                            setText("")

                                        } else {
                                            // console.log("no");

                                            const msg = {
                                                Message: text,
                                                Sent_at: new Date().toISOString(),
                                                Mobile_number: loguser,
                                                History_ID: id
                                            };

                                            // Save message
                                            setChatHistory(chat => [msg, ...chat]);

                                            const msgdata = {
                                                data: text,
                                                reciever: userMobile,
                                                sender: loguser,
                                                chatId: chatId,
                                                senderId: loggeduserId,

                                            }

                                            const data = {
                                                type: "chat",
                                                msgDatas: msgdata,
                                                image: null
                                            };

                                            webSocket.current.send(JSON.stringify(data));

                                            setText("")

                                        }
                                    }
                                }
                            }}
                        >
                            <Ionicons name="send" size={20} color="#fff" />
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {
                selectedImage && (
                    <Modal
                        visible={true}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setSelectedImage(null)}  // For Android back button
                    >
                        <TouchableOpacity
                            style={styles.fullScreenOverlay}
                            activeOpacity={1}
                            onPress={() => setSelectedImage(null)}
                        >
                            <Image
                                source={{ uri: selectedImage }}
                                style={styles.fullScreenImage}
                                resizeMode="contain"
                            />
                            {/* Optional: Add a close button icon */}
                            <View style={styles.closeButton}>
                                <Text style={styles.closeText}>✕</Text>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                )
            }

        </SafeAreaView >












    );
}

const styles = StyleSheet.create({

    safearea: {
        flexGrow: 1,
        backgroundColor: "#dfd5c4",
        // alignItems: "center"
    },

    keybord: {
        flex: 1,
        // flexGrow: 1,
        backgroundColor: "#dfd5c4",
        // padding: 0
    },

    headerView: {
        backgroundColor: "#f3d49e",
        width: "100%",
        padding: 10,
        flexDirection: "row",
        alignItems: "center"
    },

    image: {
        width: 40,
        height: 40,
        borderRadius: 50,
        padding: 20,
        borderWidth: 1,
        borderColor: "#000000",
        // marginTop: 10
    },

    imgbox: {
        paddingHorizontal: 10,
    },

    status: {
        backgroundColor: "#56f600",
        borderRadius: 50,
        width: 10,
        height: 10,
    },

    bodyView: {
        flex: 1,
        // backgroundColor: "#eff3ff",
        padding: 20,
    },

    msgTime: {
        color: "#8f8f8f",
        fontSize: 12,
    },

    message: {
        fontWeight: "600",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        maxWidth: "90%",
        marginTop: 10
    },

    chatimage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        padding: 20,
        borderWidth: 1,
        borderColor: "#000000",
        marginTop: 10
    },

    selectchatimage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        padding: 20,
        borderWidth: 1,
        borderColor: "#000000",
        // marginTop: 10

        // position : "absolute"
    },

    messageView: {
        width: "100%",
        gap: 5,
    },

    sendMsg: {
        backgroundColor: "#005eff",
        color: "white",
        borderTopRightRadius: 0,
    },

    receiveMsg: {
        backgroundColor: "#ffffff",
        color: "black",
        borderTopLeftRadius: 0,
    },

    inputcontainer: {
        // marginTop : 30,
        flexDirection: "row"
    },

    inputBox: {
        // height: 50,
        marginHorizontal: 15,
        marginBottom: 20,
        borderRadius: 35,
        backgroundColor: "rgba(233, 213, 0, 0.27)",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        width: "80%"
    },

    input: {
        flex: 1,
        color: "#000000",
        fontSize: 15,
        marginHorizontal: 12
    },

    inputSend: {
        width: "20%",
    },

    send: {
        width: 40,
        height: 40,
        borderRadius: 25,
        backgroundColor: "#2979ff",
        justifyContent: "center",
        alignItems: "center",
        marginStart: -5
    },

    setimgview: {
        maxWidth: "10%",
        marginBottom: 10,
        marginStart: 20,
        flexDirection: "row",
    },

    selectImages: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderRadius: 10,
    },

    imageset: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        // height : 40,
        // position : "absolute"
    },

    cutbtn: {},







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
    closeText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },




    removeImageBtn: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'red',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeImageText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },








})

























