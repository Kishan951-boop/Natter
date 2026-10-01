import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GroupProfile() {
    const params = useLocalSearchParams();
    const groupId = params.groupId;
    const apiURl = process.env.EXPO_PUBLIC_API_URL

    const router = useRouter();

    // console.log(groupId);

    const [userName, setUserName] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [mobile, setMobile] = useState("");
    const [description, setDescription] = useState("");
    const [Email, setEmail] = useState("");
    const [userId, setuserid] = useState("");

    const [groupDet, setGroupDet] = useState<any>();
    const [groupPic, setGroupPic] = useState();
    const [groupName, setGroupName] = useState();
    const [groupDes, setGroupDes] = useState();
    const [groupMem, setGroupMem] = useState<any[]>([]);

    const [isallowed, setIsAllowed] = useState<any>(false);
    const [isleaved, setisleaved] = useState<any>(false);

    // console.log(groupMem)

    useEffect(() => {
        getuser();
        me();
    }, [])

    useFocusEffect(
        useCallback(() => {
            loadGroup();
            me();

            return () => { };

        }, [groupId, groupMem])
    );

    async function loadGroup() {
        if (!groupId) {
            return;
        }
        
        const response = await fetch(apiURl + "/group/details?groupId=" + groupId);
        const data = await response.json();

        // console.log(data)
        // console.log(groupId)
        
        if (response.ok) {

            const groupdetails = data.groups;
            setGroupDet(groupdetails[0]);
            setGroupPic(groupdetails[0].Group_Pic);
            setGroupName(groupdetails[0].Group_Name);
            setGroupDes(groupdetails[0].Group_Des);
            setGroupMem(data.users)

            // console.log(groupdetails[0].Group_Pic)

        } else {
            console.log(response.status + " " + data.msg);
            alert("Something went wrong");
        }
    }

    async function me() {
        for (let index = 0; index < groupMem.length; index++) {
            const element = groupMem[index];
            if (element.Mobile_number === mobile) {
                if (element.Member_Type === 1 || element.Member_Type === 2) {
                    await setIsAllowed(true)
                } else if (element.Member_Type === 4) {
                    await setisleaved(true);
                } else {
                    await setIsAllowed(false)
                    await setisleaved(false)
                }
            }
        }
    }

    async function getuser() {

        const user = await AsyncStorage.getItem("user");
        let userObj: any

        if (user) {
            userObj = JSON.parse(user);
            // console.log(userObj)
            setUserName(userObj.nick_name);
            setProfilePic(userObj.Profile_Image);
            setMobile(userObj.Mobile_number);
            setDescription(userObj.Description);
            setEmail(userObj.Email);
            setuserid(userObj.user_ID);
        }
    }

    async function Leave() {

        console.log(userId)

        if (groupId === "" && userId === "") {
            alert("Please try again Later");
        } else {

            // if (image) {
            //     setUserPFP(image)
            // }

            const data = {
                groupId: groupId,
                userId: userId,
            }

            // console.log(userName, email, description, userId)

            try {

                const response = await fetch(apiURl + "/group/leave",
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
                    loadGroup();

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
                    <Pressable style={{ alignItems: "flex-start", width: "10%" }} onPress={() => { router.back(); }}>
                        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
                    </Pressable>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.container}>

                <View style={{ marginTop: 10 }}>
                    <Pressable>
                        {profilePic === "null" ?
                            (<Image style={styles.image}
                                source={{
                                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfIFwG8Lmyit54lzsWhUNZu8PslyoQ3nKmM1sNVLRuJw&s=10"
                                }} />
                            )
                            :
                            (<Image style={styles.image}
                                source={{
                                    uri: apiURl + "/uploads/GroupPic/" + groupPic
                                }} />
                            )}

                    </Pressable>
                </View>

                <Text style={styles.header}>{groupName}</Text>

                <View style={styles.box}>
                    {isallowed ? (
                        <Pressable style={styles.innerboxes}
                            onPress={() => {
                                router.push(
                                    {
                                        pathname: "/groupEdit",
                                        params: {
                                            groupId: groupId,
                                        }
                                    })
                            }}
                        >
                            <AntDesign name="edit" size={24} color="black" />
                            <Text style={{ fontSize: 18, color: "white" }}>Edit</Text>
                        </Pressable>
                    ) : ("")}
                    {isleaved ? null : (
                        <Pressable style={styles.innerboxes}
                            onPress={Leave}
                        >
                            <Ionicons name="exit-outline" size={24} color="black" />
                            <Text style={{ fontSize: 18, color: "white" }}>Leave</Text>
                        </Pressable>

                    )}
                </View>

                <View style={[styles.box, { marginTop: -22 }]}>
                    <Text style={styles.inputtext}>{groupDes}</Text>
                </View>
                <View style={{ height: 1, backgroundColor: "black", width: "60%", marginTop: -15 }} />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, }}>
                    <AntDesign name="exclamation-circle" size={16} color="black" style={{ marginTop: 3 }} />
                    <Text style={{ fontSize: 15 }}>description</Text>
                </View>

                {isallowed ? (
                    <Pressable style={styles.topbox}
                        onPress={() => {
                            router.push(
                                {
                                    pathname: "/addMem",
                                    params: {
                                        groupId: groupId,
                                        // groupMem : groupMem
                                    }
                                })
                        }}
                    >
                        <Ionicons name="person-add-sharp" size={24} color="white" />
                        <Text style={{ fontSize: 18, color: "white" }}>Add new Member</Text>
                    </Pressable>
                ) : ("")}



                {/* Member List Section */}
                <View style={{ width: "90%", marginTop: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Members</Text>

                    {groupMem && groupMem.length > 0 ? (
                        groupMem.map((item, index) => {
                            const isCreater = String(item.Member_Type) === "1";
                            const isAdmin = String(item.Member_Type) === "2";
                            const image = item.Profile_Image;

                            return (
                                <View key={index} style={styles.flatcontainer}>
                                    <Pressable
                                        style={styles.messagebox}
                                        onPress={() => {
                                            router.push({
                                                pathname: "/chatProfile",
                                                params: { friendId: item.user_ID }
                                            });
                                        }}
                                    >
                                        <View style={styles.imgbox}>
                                            {image === "null" ? (
                                                <Image
                                                    style={styles.flatimage}
                                                    source={{ uri: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" }}
                                                />
                                            ) : (
                                                <Image
                                                    style={styles.flatimage}
                                                    source={{ uri: "http://10.61.191.126:3000/uploads/profilePics/" + image }}
                                                />
                                            )}
                                        </View>

                                        <View style={styles.contemtbox}>
                                            <View style={styles.msgviewbox}>
                                                <Text style={{ fontSize: 18 }}>{item.nick_name}</Text>
                                            </View>
                                            <Text style={{ fontSize: 10 }}>{item.Description}</Text>
                                        </View>

                                        <View style={{ width: "12%", justifyContent: 'center' }}>
                                            {isCreater ? <Text style={{ fontSize: 10 }}>Creator</Text> :
                                                isAdmin ? <Text style={{ fontSize: 10 }}>Admin</Text> : null}
                                        </View>
                                    </Pressable>
                                </View>
                            );
                        })
                    ) : (
                        <Text style={{ textAlign: 'center', marginTop: 10 }}>No members found.</Text>
                    )}
                </View>

            </ScrollView>

        </SafeAreaView >

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
        width: "90%",
        textAlign: "center"
    },

    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        padding: 20,
        borderWidth: 1,
        borderColor: "#000000",
    },

    box: {
        width: "90%",
        gap: 10,
        padding: 20,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center"
    },

    innerboxes: {
        backgroundColor: "#1717177a",
        width: "40%",
        padding: 10,
        borderRadius: 20,
        alignItems: "center"
    },

    topbox: {
        backgroundColor: "#1717177a",
        width: "90%",
        gap: 10,
        padding: 10,
        marginTop: 20,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center"
    },

    inputtext: {
        textAlign: "center",
        fontSize: 18,
        color: "#000000"
    },

    flatcontainer: {
        // flex: 1,
        // backgroundColor: "#dfd5c4",
        // alignItems: "center",
        marginTop: 5,
        gap: 20
        // conte
    },

    messagebox: {
        width: "100%",
        backgroundColor: "#e5cca1",
        padding: 5,
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: 10
    },

    flatimage: {
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
        width: "60%",
        // flexDirection: "column",
        justifyContent: "flex-start"
    },

    msgviewbox: {
        width: "100%",
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



























