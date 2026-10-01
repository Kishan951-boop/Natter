import { AntDesign, Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GroupEdit() {

    const params = useLocalSearchParams();
    const groupId = params.groupId;

    const router = useRouter();

    // console.log(groupId);

    const [userName, setUserName] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [mobile, setMobile] = useState("");
    const [description, setDescription] = useState("");
    const [Email, setEmail] = useState("");

    const [groupDet, setGroupDet] = useState<any>();
    const [groupPic, setGroupPic] = useState<string>("");
    const [groupName, setGroupName] = useState<string>("");
    const [groupDes, setGroupDes] = useState<string>("");
    const [groupMem, setGroupMem] = useState<any[]>([]);

    const [image, setImage] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        getuser();
    })

    useFocusEffect(
        useCallback(() => {
            loadGroup();
            return () => { }
        }, [groupId])
    );

    async function loadGroup() {
        if (!groupId) {
            return;
        }

        const response = await fetch("http://10.61.191.126:3000/group/details?groupId=" + groupId);
        const data = await response.json();

        if (response.ok) {

            const groupdetails = data.groups;
            setGroupDet(groupdetails[0]);
            setGroupPic(groupdetails[0].Group_Pic);
            setGroupName(groupdetails[0].Group_Name);
            setGroupDes(groupdetails[0].Group_Des);
            setGroupMem(data.users)

            // console.log(data)
            // console.log(groupdetails[0].Group_Pic)

        } else {
            console.log(response.status + " " + data.msg);
            alert("Something went wrong");
        }
    };

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
        }
    };

    const pickImage = async () => {
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


        if (!result.canceled) {

            const asset = result.assets[0];

            setImage(asset.uri ?? null);
            setImageBase64(asset.base64 ?? null);

        }
    };

    async function update() {

        // console.log("yup")

        if (groupName === "" && groupDes === "") {
            alert("Please Enter Creditial to continue");
        } else {

            // if (image) {
            //     setUserPFP(image)
            // }

            const data = {
                groupId: groupId,
                groupName: groupName,
                description: groupDes,
                profileImage: imageBase64,
                oldImage: groupPic
            }

            // console.log(userName, email, description, userId)

            try {

                const response = await fetch("http://10.61.191.126:3000/group/update",
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

    async function updateAdmin(status: string, id: string) {

        // console.log("yup")

        if (status === "" && id === "") {
            alert("Please try again Later");
        } else {

            // if (image) {
            //     setUserPFP(image)
            // }

            const data = {
                groupId: groupId,
                userId: id,
                status: status
            }

            // console.log(userName, email, description, userId)

            try {

                const response = await fetch("http://10.61.191.126:3000/group/updateAdmin",
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

    async function Leave(userId : string) {

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

                const response = await fetch("http://10.61.191.126:3000/group/leave",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log(data.msg);
                    alert("Participent has removed from the group.");
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

                <View style={{ marginTop: 40 }}>
                    <Pressable onPress={pickImage}>
                        {image ? (
                            <Image style={styles.image}
                                source={{
                                    uri: image
                                }} />
                        ) : groupPic === "null" || !groupPic ? (
                            <Image style={styles.image}
                                source={{
                                    uri:
                                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfIFwG8Lmyit54lzsWhUNZu8PslyoQ3nKmM1sNVLRuJw&s=10"
                                }} />
                        ) : (
                            <Image style={styles.image}
                                source={{
                                    uri: "http://10.61.191.126:3000/uploads/GroupPic/" + groupPic
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

                <View style={{ flexDirection: "row", alignItems: "center", width: "90%", justifyContent: "center" }}>
                    <TextInput
                        style={styles.header}
                        // value={groupName}
                        onChangeText={setGroupName}
                    >{groupName}</TextInput>
                    <Feather name="edit-3" size={24} color="black" style={{ marginTop: 5, width: "10%" }} />
                </View>

                <View style={[styles.box, { marginTop: -22, alignItems: "center" }]}>
                    <TextInput
                        style={styles.inputtext}
                        // value={groupDes}
                        onChangeText={setGroupDes}
                    >{groupDes}</TextInput>
                    <Feather name="edit-3" size={12} color="black" />
                </View>

                <View style={{ height: 1, backgroundColor: "black", width: "60%", marginTop: -15 }} />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, }}>
                    <AntDesign name="exclamation-circle" size={16} color="black" style={{ marginTop: 3 }} />
                    <Text style={{ fontSize: 15 }}>description</Text>
                </View>


                <Pressable onPress={update}
                    style={({ pressed }) => [
                        styles.btncreate,
                        { backgroundColor: pressed ? "#2d403c" : "#051a2a" }
                    ]}
                >
                    <Text style={{ color: "white", fontSize: 16 }}>Update group.</Text>
                </Pressable>
                <View style={{ width: "90%", marginTop: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Members</Text>

                    {groupMem && groupMem.length > 0 ? (
                        groupMem.map((item, index) => {
                            const isCreater = String(item.Member_Type) === "1";
                            const isAdmin = String(item.Member_Type) === "2";
                            const image = item.Profile_Image;

                            if (item.Mobile_number === mobile || isCreater) {
                                return null;
                            }

                            return (
                                <View key={index} style={styles.flatcontainer}>
                                    <Pressable
                                        style={styles.messagebox}
                                    >
                                        <Pressable style={styles.imgbox}
                                            onPress={() => {
                                                router.push({
                                                    pathname: "/chatProfile",
                                                    params: { friendId: item.user_ID }
                                                });
                                            }}>
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
                                        </Pressable>

                                        <View style={styles.contemtbox}>
                                            <View style={styles.msgviewbox}>
                                                <Text style={{ fontSize: 18 }}>{item.nick_name}</Text>
                                            </View>
                                            {/* <Text style={{ fontSize: 10 }}>{item.Description}</Text> */}

                                            <View style={{ width: "100%", justifyContent: 'center' }}>
                                                {isCreater ? (<Text style={{ fontSize: 10 }}>Cannot Change</Text>) :
                                                    isAdmin ?
                                                        (<View style={{ flexDirection: "row", gap: 5, width: "100%" }}>
                                                            <Pressable style={[styles.adminbtn, { backgroundColor: "#414141" }]}
                                                                onPress={() => { updateAdmin("none", item.user_ID) }}
                                                            >
                                                                <Text style={{ fontSize: 10, color: "white" }}>Remove Admin</Text>
                                                            </Pressable>
                                                            <Pressable style={[styles.adminbtn, { backgroundColor: "#440000" }]}
                                                            onPress={()=>{Leave(item.user_ID)}}>
                                                                <Text style={{ fontSize: 10, color: "white" }}>Remove</Text>
                                                            </Pressable>
                                                        </View>)
                                                        : (
                                                            <View style={{ flexDirection: "row", gap: 5, width: "100%" }}>
                                                                <Pressable style={[styles.adminbtn, { backgroundColor: "#001c62" }]}
                                                                    onPress={() => { updateAdmin("add", item.user_ID) }}>
                                                                    <Text style={{ fontSize: 10, color: "white" }}>Give Admin</Text>
                                                                </Pressable>
                                                                <Pressable style={[styles.adminbtn, { backgroundColor: "#490000" }]}
                                                                onPress={()=>{Leave(item.user_ID)}}>
                                                                    <Text style={{ fontSize: 10, color: "white" }}>Remove</Text>
                                                                </Pressable>
                                                            </View>
                                                        )}
                                            </View>
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
        maxWidth: "80%",
        textAlign: "center"
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
        color: "#000000",
        maxWidth: "80%"
    },

    flatcontainer: {
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
        width: "70%",
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

    btncreate: {
        borderRadius: 8,
        backgroundColor: "#2a1905",
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 20,
        width: "80%",
        marginBottom: 20
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

    adminbtn: {
        padding: 5,
        borderRadius: 50,
        width: "50%",
        justifyContent: "center",
        alignItems: "center"
    },

})































