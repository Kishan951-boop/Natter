import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { useFocusEffect, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {

    const router = useRouter();


    const [chatData, setChatData] = useState<any[]>([]);
    const [isRefresh, setIsRefresh] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [userId, setUserId] = useState<string | undefined>();
    const [userName, setNameUser] = useState<string | undefined>();
    const [userMobile, setUserMobile] = useState<string | undefined>();
    const [userPFP, setUserPFP] = useState<string | undefined>();
    const apiURL = process.env.EXPO_PUBLIC_API_URL;

    async function loadChat(mobile?: string) {

        if (!mobile) {
            return;
        }

        setIsRefresh(true);

        try {

            const response = await fetch(apiURL + "/chats/get-chats?mobile=" + mobile);

            const data = await response.json();

            setIsRefresh(false);

            if (response.ok) {
                // console.log(chat);

                setChatData(data);

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
            loadChat(userObj.Mobile_number);
            setUserPFP(userObj.user_ID);
            setNameUser(userObj.nick_name);
            setUserMobile(userObj.Mobile_number);
            setUserPFP(userObj.Profile_Image);
            // console.log(userObj);

        }

    }

    useFocusEffect(() => {

        getUser();
        loadChat(userMobile);

    });

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

    const filteredChatData = searchText.trim().length > 0
        ? chatData.filter((item) => {
            const name = item?.user?.nick_name;
            return typeof name === "string" && name.toLowerCase().includes(searchText.toLowerCase());
        })
        : chatData;

    return (
        <SafeAreaView style={styles.safearea}>

            <View style={styles.headerView}>

                <View style={styles.headertext}>
                    <View>
                        <Image style={{ width: 35, height: 35, padding: 10 }}
                            source={require("../../assets/images/natter.png")}
                        />
                    </View>
                    <Text style={{ fontSize: 30, fontFamily: "Playwrite" }}>
                        Natter
                    </Text>
                </View>

                {/* <Feather name="bell" size={24} color="black" /> */}
                <Pressable style={styles.headerimgbox}
                    onPress={() => { router.push("/user/profile") }}
                >
                    {userPFP === "null" ?
                        < Image style={styles.headerimg}
                            source={{
                                uri:
                                    "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                            }} />
                        : (<Image style={styles.headerimg}
                            source={{
                                uri: "http://10.61.191.126:3000/uploads/profilePics/" + userPFP
                            }} />
                        )
                    }
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
                            loadChat(userMobile);
                        }}
                    >
                        <Text style={styles.dropdownText}>Refresh chats</Text>
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

            <FlatList
                data={filteredChatData}
                ListEmptyComponent={() => (
                    <View style={{ alignItems: "center", marginTop: 30 }}>
                        <Text>No chats found</Text>
                    </View>
                )}
                renderItem={({ item }) => {
                    const image = item.user.Profile_Image;
                    const sentTime = item.last_message?.Sent_at ?? null;
                    const lastMessage = item.last_message?.Message ?? null;
                    return (




                        <View style={styles.container}>
                            <Pressable style={styles.messagebox} onPress={() => {
                                router.push({
                                    pathname: "/chat",
                                    params: {
                                        chatId: item.chat_id,
                                        userId: item.user.user_ID,
                                        profilPic: item.user.Profile_Image,
                                        nickName: item.user.nick_name,
                                        userMobile: item.user.Mobile_number,
                                        userDes: item.user.Description,
                                        loguser: userMobile,
                                    }
                                })
                            }}>
                                <View style={styles.imgbox}>
                                    {image === "null" ?
                                        < Image style={styles.image}
                                            source={{
                                                uri:
                                                    "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                                            }} />
                                        : (<Image style={styles.image}
                                            source={{
                                                uri: "http://10.61.191.126:3000/uploads/profilePics/" + image
                                            }} />
                                        )
                                    }
                                </View>
                                <View style={styles.contemtbox}>
                                    <View style={styles.msgviewbox}>
                                        <Text style={{ fontSize: 18 }}>{item.user.nick_name}</Text>
                                        <Text>
                                            {
                                                timeFormat(
                                                    sentTime
                                                )
                                            }
                                        </Text>
                                    </View>
                                    <View style={styles.msgviewbox}>
                                        <Text style={{ color: "#434343" }}>
                                            {lastMessage === "" ? "📷 Image" : lastMessage}
                                        </Text>
                                        {
                                            // eslint-disable-next-line eqeqeq
                                            item.unread.count == "0" ?
                                                (
                                                    <Text />
                                                ) :
                                                (
                                                    <View style={{ backgroundColor: "black", paddingHorizontal: 8, borderRadius: 50 }}>
                                                        <Text style={{ color: "white" }}>{item.unread.count}</Text>
                                                    </View>
                                                )
                                        }
                                    </View>
                                </View>
                            </Pressable>
                        </View>



                    );
                }}

                refreshing={isRefresh}
                onRefresh={() => { loadChat(userMobile) }}
            />

            <Pressable style={styles.addchat}
                onPress={() => { router.push("/addchat") }}>
                <FontAwesome name="plus-circle" size={44} color="white" style={{ padding: 5, paddingHorizontal: 15 }} />
            </Pressable>






        </SafeAreaView>
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
    }

})

























































