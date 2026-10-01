import { Feather } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { useFocusEffect, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Story() {

    const router = useRouter();


    const [storyData, setStoryData] = useState<any[]>([]);
    const [isRefresh, setIsRefresh] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [userId, setUserId] = useState<string | undefined>();
    const [userName, setNameUser] = useState<string | undefined>();
    const [userMobile, setUserMobile] = useState<string | undefined>();
    const [userPFP, setUserPFP] = useState<string | undefined>();
    const [mystatus, setMyStatus] = useState<any>();
    const apiURL = process.env.EXPO_PUBLIC_API_URL;

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [caption, setCaption] = useState<string>();


    async function loadStatus(usermb?: string) {

        if (!usermb) {
            return;
        }

        // console.log(usermb)

        setIsRefresh(true);

        try {

            const response = await fetch(apiURL + "/story/get?usermobile=" + usermb);

            const data = await response.json();

            setIsRefresh(false);

            if (response.ok) {

                setStoryData(data);
                // console.log(data);

            } else {
                // const data = await response.json();

                alert(response.status + " : " + data.msg)
            }

        } catch (error) {
            console.error("Failed to load chats", error);
            setIsRefresh(false);
        }
    }

    async function loadmyStatus(usermb?: string) {

        if (!usermb) {
            return;
        }

        // console.log(usermb)

        setIsRefresh(true);

        try {

            const response = await fetch(apiURL + "/story/getmy?usermobile=" + usermb);

            const data = await response.json();

            setIsRefresh(false);

            if (response.ok) {

                setMyStatus(data[0]);
                // console.log(data);

            } else {
                // const data = await response.json();

                alert(response.status + " : " + data.msg)
            }

        } catch (error) {
            console.error("Failed to load chats", error);
            setIsRefresh(false);
        }
    }


    async function getUser() {

        const userString = await AsyncStorage.getItem("user");

        if (userString) {

            const userObj = JSON.parse(userString);
            loadStatus(userObj.Mobile_number);
            setUserPFP(userObj.user_ID);
            setNameUser(userObj.nick_name);
            setUserMobile(userObj.Mobile_number);
            setUserPFP(userObj.Profile_Image);
            setUserId(userObj.user_ID)
            // console.log(userObj);

        }

    }

    useFocusEffect(
        () => {

            getUser();
            loadStatus(userMobile);
            loadmyStatus(userMobile);
            return () => { }
        }
    );

    const [fontLoaded] = useFonts({
        "Playwrite": require("../../assets/fonts/Playwritet.ttf"),
    });

    if (!fontLoaded) {
        console.warn("Font not loaded yet");
        return null;
    }


    function timeFormat(time: string) {
        const formattedTime = new Date(time).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        return formattedTime;

    }

    const filteredStoryData = searchText.trim().length > 0
        ? storyData.filter((item) => {
            const name = item?.story?.nick_name;
            return typeof name === "string" && name.toLowerCase().includes(searchText.toLowerCase());
        })
        : storyData;

    return (
        <SafeAreaView style={styles.safearea}>

            <View style={styles.headerView}>

                <View style={styles.headertext}>
                    <View>
                        <Image style={{ width: 35, height: 35, padding: 10 }}
                            // source={{ uri: "https://i.pinimg.com/736x/68/31/12/68311248ba2f6e0ba94ff6da62eac9f6.jpg" }}
                            source={require("../../assets/images/natter.png")}
                        />
                    </View>
                    <Text style={{ fontSize: 30, fontFamily: "Playwrite" }}>
                        Natter
                    </Text>
                </View>

                <Pressable style={styles.headerimgbox}
                    onPress={() => { router.push("/user/profile") }}
                >
                    {userPFP === "null" ?
                        < Image style={styles.headerimg}
                            source={{
                                uri:
                                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfIFwG8Lmyit54lzsWhUNZu8PslyoQ3nKmM1sNVLRuJw&s=10"
                            }} />
                        : (<Image style={styles.headerimg}
                            source={{
                                uri: "http://10.61.191.126:3000/uploads/profilePics/" + userPFP
                            }} />
                        )
                    }
                    {/* <Image style={styles.headerimg}
                        source={{ uri: "https://i.pinimg.com/736x/68/31/12/68311248ba2f6e0ba94ff6da62eac9f6.jpg" }}
                    /> */}
                </Pressable>
                <Pressable onPress={() => setShowMenu((current) => !current)} hitSlop={10}>
                    <Entypo name="dots-three-vertical" size={24} color="black" />
                </Pressable>


            </View>

            {showMenu ? (
                <View style={styles.dropdownMenu}>
                    <Pressable
                        style={styles.dropdownItem}
                        onPress={() => {
                            setShowMenu(false);
                            router.push("/user/profile");
                        }}
                    >
                        <Text style={styles.dropdownText}>Profile</Text>
                    </Pressable>
                    <Pressable
                        style={styles.dropdownItem}
                        onPress={() => {
                            setShowMenu(false);
                            loadStatus(userMobile);
                        }}
                    >
                        <Text style={styles.dropdownText}>Refresh Status</Text>
                    </Pressable>
                    <Pressable
                        style={styles.dropdownItem}
                        onPress={() => {
                            setShowMenu(false);
                            router.push("/addchat");
                        }}
                    >
                        <Text style={styles.dropdownText}>Add chat</Text>
                    </Pressable>
                    <Pressable
                        style={styles.dropdownItem}
                        onPress={() => {
                            setShowMenu(false);
                            router.push("/user/security");
                        }}
                    >
                        <Text style={styles.dropdownText}>Security</Text>
                    </Pressable>
                </View>
            ) : null}

            <View style={styles.searchView}>
                <FontAwesome name="search" size={24} color="black" style={{ padding: 10 }} />
                <TextInput
                    placeholder="Search by nickname"
                    style={{ width: "90%" }}
                    autoFocus={false}
                    value={searchText}
                    onChangeText={setSearchText}
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                />
            </View>

            <View style={styles.container}>
                <Pressable style={[styles.statusplus, { padding: 10 }]} onPress={() => {
                    if (mystatus) {
                        setSelectedImage(apiURL + "/uploads/Story/" + mystatus.Image);
                        setCaption(mystatus.caption);
                    } else {
                        router.push({
                            pathname: "/addstory",
                            params: {
                                userId: userId,
                            },
                        });
                    }
                }}>
                    {mystatus ? (

                        <>
                            <View style={styles.imgbox}>
                                <View style={styles.imgbox}>
                                    {mystatus === "null" ?
                                        < Image style={styles.image}
                                            source={{
                                                uri:
                                                    "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                                            }} />
                                        : (<Image style={styles.image}
                                            source={{
                                                uri: "http://10.61.191.126:3000/uploads/Story/" + mystatus.Image
                                            }} />
                                        )
                                    }
                                </View>
                            </View>
                            <View style={styles.contemtbox}>
                                <View style={styles.msgviewbox}>
                                    <Text style={{ fontSize: 18 }}>Mine</Text>
                                    <Text style={{ right: 15 }}>{timeFormat(mystatus.Time)}</Text>
                                </View>
                                <View style={styles.msgviewbox}>
                                    <Text style={{ color: "#000000" }}>
                                        {mystatus.caption}
                                    </Text>
                                </View>
                            </View>
                        </>
                    ) : (
                        <><View style={styles.imgbox}>
                            <Feather name="plus-circle" size={44} color="white" />
                        </View><View style={styles.contemtbox}>
                                <View style={[styles.msgviewbox, { alignContent: "center", top: 10 }]}>
                                    <Text style={{ fontSize: 18, color: "white" }}>Add My Story</Text>
                                </View>
                            </View></>
                    )}
                </Pressable>
            </View>

            <FlatList
                data={filteredStoryData}
                ListEmptyComponent={() => (
                    <View style={{ alignItems: "center", marginTop: 30 }}>
                        <Text>No stories found</Text>
                    </View>
                )}
                renderItem={({ item }) => {
                    const image = item.story?.Image ?? null;
                    const sentTime = item.story?.Time ?? null;
                    const imageurl = "http://10.61.191.126:3000/uploads/Story/" + image;
                    // const lastMessage = item.last_message?.Message ?? null;
                    // console.log(item)

                    return (



                        <View style={styles.container}>
                            {/* <Text>{image}</Text> */}
                            <TouchableOpacity style={styles.messagebox} onPress={() => {
                                setSelectedImage(imageurl);
                                setCaption(item.story.caption)
                            }}
                            >
                                <View style={styles.imgbox}>
                                    {image === "null" ?
                                        < Image style={styles.image}
                                            source={{
                                                uri:
                                                    "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                                            }} />
                                        : (<Image style={styles.image}
                                            source={{
                                                uri: "http://10.61.191.126:3000/uploads/Story/" + image
                                            }} />
                                        )
                                    }
                                </View>
                                <View style={styles.contemtbox}>
                                    <View style={styles.msgviewbox}>
                                        <Text style={{ fontSize: 18 }}>{item.story.nick_name}</Text>
                                        <Text>{timeFormat(sentTime)}</Text>
                                    </View>
                                    <View style={styles.msgviewbox}>
                                        <Text style={{ color: "#434343" }}>
                                            {item.story.caption}
                                        </Text>

                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>



                    );
                }}

                refreshing={isRefresh}
                onRefresh={() => { loadStatus(userMobile) }}
            />

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
                            <View style={styles.caption}>
                                <Text style={{ color: "white" }}>{caption}</Text>
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
        flex: 1,
        backgroundColor: "#dfd5c4",
        alignItems: "center"
    },

    headertext: {
        width: "70%",
        gap: 12,
        flexDirection: "row",
        alignItems: "center",
        marginTop: -20
    },

    headercontainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },

    headerView: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 40,
        marginTop: 20
    },

    headerimgbox: {
        width: "10%",
    },

    headerimg: {
        width: 10,
        height: 10,
        borderRadius: 50,
        padding: 15,
        borderWidth: 1,
        borderColor: "#000000",
        marginTop: -3
    },

    searchView: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 50,
        width: "90%"
    },

    dropdownMenu: {
        position: "absolute",
        top: 72,
        right: 12,
        backgroundColor: "white",
        borderRadius: 12,
        paddingVertical: 6,
        minWidth: 150,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        zIndex: 10,
    },

    dropdownItem: {
        paddingHorizontal: 14,
        paddingVertical: 10,
    },

    dropdownText: {
        fontSize: 16,
        color: "#111",
    },

    container: {
        // flex: 1,
        // backgroundColor: "#dfd5c4",
        // alignItems: "center",
        marginTop: 5,
        gap: 20
    },

    statusplus: {
        width: "100%",
        backgroundColor: "#186ac1",
        padding: 5,
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: 10
    },

    messagebox: {
        width: "100%",
        backgroundColor: "#e5cca1",
        padding: 5,
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: 10
    },

    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        padding: 20,
        borderWidth: 1,
        borderColor: "#000000",
    },

    contentBar: {
        width: "100%",
        backgroundColor: "#e5cca1",
        // padding: 20,
        flex: 1,
        flexDirection: "row",
    },

    imgbox: {
        width: "20%"
    },

    contemtbox: {
        width: "70%",
        // flexDirection: "column",
        justifyContent: "flex-start"
    },

    msgviewbox: {
        width: "95%",
        flexDirection: "row",
        justifyContent: "space-between"
    },

    addchat: {
        position: "absolute",
        bottom: 20,
        left: 300,
        backgroundColor: "#3c4102",
        borderRadius: 15,
        borderTopRightRadius: 0,
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
        bottom: 50,
        // left: 0,
        // right: 0,
        alignSelf: "center",
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    closeText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },



})


































