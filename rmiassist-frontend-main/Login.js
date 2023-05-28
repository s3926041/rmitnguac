import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Modal, Button, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import IP from "./IP"   cannot be used when on LAN connection

export default function Login({navigation}) {
    const [sid, setSid] = useState("");
    const [password, setPassword] = useState("");



    const handleBackgroundTouch = () => {
        Keyboard.dismiss();
    }
    const handleLogin = async () => { 
        try{
            const requestOptions = {
                method: "POST",
                headers: {
                    'Content-type':'application/json'
                },
                body: JSON.stringify({
                    sid:sid,
                    password:password,
                })
            }
            const ip = await AsyncStorage.getItem("ip")
            const response = await fetch(ip+'/login', requestOptions);
            const receivedData = await response.json()

            if (receivedData.message === 0) {
                alert("Wrong SID or Password")
            } else {
                alert("Welcome back to RMIAssist")
                await AsyncStorage.setItem("currentID",sid)
                navigation.navigate("HomePageTabs")
            }
        } catch(error) {
            console.log(error)
        }
    }
    

    return (
        <TouchableWithoutFeedback onPress={handleBackgroundTouch}>
            <View style={styles.container}>
                <Text style={styles.title}> Login</Text>
                <View style={styles.main}>
                    {/* This is View for the fields*/}
                    <View style={styles.fields}>
                        <Text style={styles.field}>SID:</Text>
                        <Text style={styles.field}>Password:</Text>
                    </View>
                    {/* This is View for the Text Inputs*/}
                    <View style={styles.boxes}>
                        <TextInput style={styles.box}
                            onChangeText={(text) => setSid(text)}
                            value={sid} />
                        <TextInput style={styles.box}
                            onChangeText={(text) => setPassword(text)}
                            value={password} />
                    </View>
                </View>
                <View style={styles.button}>
                    {/* <Button title="Login" onPress={handleSignUp} /> */}
                    <Button title="Login" onPress={handleLogin} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightblue",
    },
    title: {
        // lineSpacingExtra: 100,
        flex: 1,
        fontSize: 30,
        fontWeight: "bold",
        // lineHeight: '24sp',
        // backgroundColor: "white",
        padding: 100,
    },
    main: {
        flex: 3, 
        flexDirection: 'row', 
        justifyContent: "space-evenly",
        height: 200,
        width: 300
    },
    fields: {
        // backgroundColor: "green",
        height: 200
    },
    field: {
        flex: 1,
        // lineHeight: '50%',
    },
    boxes: {
        // backgroundColor: "red",
        height: 200,
    },
    box: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 4,
        width: 200,
        
    },
    button:{
        flex: 3,
    },
    textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    alert: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
