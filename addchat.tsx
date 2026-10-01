import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddChat() {

    const router = useRouter();

    const [userId, setUserId] = useState("")
    const [userMobile, setuserMobile] = useState("")
    const [friend, setFriend] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("");

    useFocusEffect(() => {
        loadFriend();
    })

    async function loadFriend() {
        const response = await fetch("http://10.61.191.126:3000/friends/get-all");

        const data = await response.json();

        if (response.ok) {

            setFriend(data)
            // console.log(data)
            // setUser(data[0].Description);
            // console.log(data[0].Description)

            const userString = await AsyncStorage.getItem("user");

            if (userString) {

                const userObj = JSON.parse(userString);
                setUserId(userObj.user_ID);
                setuserMobile(userObj.Mobile_number);

            }


        } else {
            console.log(response.status + " " + data.msg);
            alert("Something went wrong");
        }
    }

    const filteredFriends = useMemo(() => {
        if (!searchQuery.trim()) {
            return friend;
        }

        const query = searchQuery.trim().toLowerCase();
        return friend.filter((item) => {
            const mobile = item.Mobile_number?.toString().toLowerCase() || "";
            return mobile.includes(query);
        });
    }, [friend, searchQuery]);

    async function newchat(id: string) {
        console.log(id)

        if (id === "" && userId === "") {
            alert("Please try again Later");
        } else {

            // if (image) {
            //     setUserPFP(image)
            // }

            const data = {
                friendId: id,
                userId: userId
            }

            // console.log(userName, email, description, userId)

            try {

                const response = await fetch("http://10.61.191.126:3000/friends/add",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    // console.log(data.user);

                    if (data.msg === "new") {

                        console.log("new")

                        router.push({
                            pathname: "/chat",
                            params: {
                                chatId: data.user.Chat_ID,
                                userId: data.user.user_ID,
                                profilPic: data.user.Profile_Image,
                                nickName: data.user.nick_name,
                                userMobile: data.user.Mobile_number,
                                loguser: userMobile,
                                // lgusId : userId,
                            }
                        })

                    } else if (data.msg === "old") {

                        // console.log("old")
                        // console.log(data.chat_Id)

                        router.push({
                            pathname: "/chat",
                            params: {
                                chatId: data.chat_Id,
                                userId: data.user.user_ID,
                                profilPic: data.user.Profile_Image,
                                nickName: data.user.nick_name,
                                userMobile: data.user.Mobile_number,
                                loguser: userMobile,
                                // lgusId : userId,
                            }
                        })

                    } else {
                        console.log("something went wrong")
                    }
                    // alert(data.msg);
                    // console.log(data.user.nick_name)

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


    return (
        <SafeAreaView style={styles.safearea}>
            <View style={styles.headerView}>
                <View style={styles.headerViewbox}>
                    <Pressable style={{ alignItems: "flex-start", width: "10%", marginTop: 7 }} onPress={() => { router.back(); }}>
                        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
                    </Pressable>
                    <View style={styles.searchView}>
                        <TextInput
                            placeholder="Search"
                            style={{ width: "90%", textAlign: "center", }}
                            autoFocus={false}
                            value={searchQuery} // 🔥 Bind value
                            onChangeText={setSearchQuery}
                            keyboardType="numeric"
                        />
                        {searchQuery.length > 0 ? (
                            <Pressable onPress={() => setSearchQuery("")} style={{ padding: 5 }}>
                                <FontAwesome name="times-circle" size={20} color="#888" />
                            </Pressable>
                        ) :
                            (<FontAwesome name="search" size={24} color="black" style={{ padding: 5, right: 10 }} />)
                        }
                    </View>
                </View>
            </View>

            <View style={{ flex: 1, width: "90%", top: 70 }}>

                <FlatList
                    // data={friend}
                    data={filteredFriends} // 🔥 Use filtered list
                    keyExtractor={(item) => item.user_ID?.toString() || item.Mobile_number} // ✅ Ensure unique keys
                    renderItem={({ item }) => {

                        const image = item.Profile_Image;

                        if (userId === item.user_ID) {

                        } else {


                            return (

                                <Pressable
                                    style={styles.chatbox}
                                    onPress={() => { newchat(item.user_ID) }}
                                >

                                    <View style={{ width: "20%" }}>
                                        {image === "null" ?
                                            < Image style={styles.image}
                                                source={{
                                                    uri:
                                                        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                                                    // "https://i.pinimg.com/736x/68/31/12/68311248ba2f6e0ba94ff6da62eac9f6.jpg"
                                                }} />
                                            : (<Image style={styles.image}
                                                source={{
                                                    uri: "http://10.61.191.126:3000/uploads/profilePics/" + image
                                                }} />
                                            )
                                        }
                                    </View>

                                    <View style={{ width: "80%", justifyContent: "center" }}>
                                        <Text style={{ fontSize: 15 }}>{item.nick_name}</Text>
                                        {item.Description === "-" ? '' :
                                            <Text style={{ fontSize: 12 }}>{item.Description}</Text>
                                        }
                                    </View>
                                </Pressable>

                            );
                        }


                    }}
                />

            </View>

        </SafeAreaView>
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

    searchView: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 50,
        width: "90%"
    },

    chatbox: {
        width: "100%",
        backgroundColor: "#e5cca1",
        padding: 5,
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 6
    },

    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        padding: 20,
        borderWidth: 1,
        borderColor: "#000000",
    },

})


























