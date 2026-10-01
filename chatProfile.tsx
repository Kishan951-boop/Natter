import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatProfile() {
    const params = useLocalSearchParams();
    const userId = params?.friendId;
    const router = useRouter();

    const [user, setUser] = useState<any>();
    const [userName, setUserName] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [mobile, setMobile] = useState("");
    const [description, setDescription] = useState("");
    const [Email, setEmail] = useState("");

    // console.log(userId)

    useEffect(() => {
        loadFriend();
    }, [])

    async function loadFriend() {
        const response = await fetch("http://10.61.191.126:3000/friends/get?id=" + userId);

        const data = await response.json();

        if (response.ok) {

            setUserName(data[0].nick_name);
            setProfilePic(data[0].Profile_Image);
            setMobile(data[0].Mobile_number);
            setDescription(data[0].Description);
            setEmail(data[0].Email)

            // setUser(data[0].Description);
            // console.log(data[0].Description)

        } else {
            console.log(response.status + " " + data.msg);
            alert("Something went wrong");
        }
    }


    return (
        <SafeAreaView style={styles.safearea}>


            <View style={styles.headerView}>
                <View style={styles.headerViewbox}>
                    <Pressable style={{ alignItems: "flex-start", width: "10%" }} onPress={() => { router.back(); }}>
                        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
                    </Pressable>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ marginTop: 50 }} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>

                    <Text style={styles.header}>{userName}</Text>

                    <View style={{ marginTop: 10 }}>
                        <Pressable>
                            {profilePic === "null" ?
                                (<Image style={styles.image}
                                    source={{
                                        uri: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                                    }} />
                                )
                                :
                                (<Image style={styles.image}
                                    source={{
                                        uri: "http://10.61.191.126:3000/uploads/profilePics/" + profilePic
                                    }} />
                                )}

                        </Pressable>
                    </View>

                    <Text style={styles.mobile}>{mobile}</Text>

                    <View style={styles.topbox}>

                        <Text style={styles.inputtext}>{Email}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, }}>
                            <MaterialIcons name="alternate-email" size={15} color="black" />
                            <Text style={{ fontSize: 15 }}>Email</Text>
                        </View>

                        <View style={{ flex: 1, height: 1, backgroundColor: "#a3a3a3" }} />


                        <Text style={styles.inputtext}>{description}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <AntDesign name="exclamation-circle" size={16} color="black" style={{ marginTop: 3 }} />
                            <Text style={{ fontSize: 15 }}>description</Text>
                        </View>

                    </View>
                </View>

            </ScrollView>



        </SafeAreaView>
    );

}


const styles = StyleSheet.create({

    safearea: {
        flexGrow: 1,
        backgroundColor: "#dfd5c4",
        // alignItems: "center"
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

    mobile: {
        fontSize: 30,
    },

    topbox: {

        backgroundColor: "#1717177a",
        width: "90%",
        gap: 10,
        padding: 20,
        marginTop: 20,
        borderRadius: 20
    },

    inputtext: {
        fontSize: 18,
        color: "#fffedd"
    },

})








































