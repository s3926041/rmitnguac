import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Button, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from "react";



export default function SignUp( {navigation} ) {
    const [name, setName] = useState("");
    const [sid, setSid] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");



    const handleSignUp = async () => {
        // Write the code to send to Express
        try {
            const ip = await AsyncStorage.getItem("ip")      
            const response = await fetch (ip+"/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    sid: sid,
                    gender: gender,
                    password: password
                })    
            })
            const data = await response.json()
            console.log(data)
            await AsyncStorage.setItem('currentID',sid)
            alert("You have successfully signed up! Welcome " + name + " to RMIassist!")
            navigation.navigate("HomePageTabs")
        }
        catch (error) {
            console.log(error)
        }
    };

    const handleBackgroundTouch = () => {
        Keyboard.dismiss();
    }



    return (
        <TouchableWithoutFeedback onPress = {handleBackgroundTouch}>
            <View style={styles.container}>
                <Text style={styles.title}> Sign Up</Text>
                <View style = {styles.main}>
                    {/* This is View for the fields*/}
                    <View style = {styles.fields}>
                        <Text style = {styles.field}>Name:</Text>
                        <Text style = {styles.field}>SID:</Text>
                        <Text style = {styles.field}>Gender:</Text>
                        <Text style = {styles.field}>Password:</Text>
                    </View>
                    {/* This is View for the Text Inputs*/}
                    <View style = {styles.boxes}>
                        <TextInput style = {styles.box}
                            onChangeText={ (text) => setName(text)}
                            value={name}
                        />
                        <TextInput style = {styles.box}
                            onChangeText={(text) => setSid(text)}
                            value = {sid}
                        />
                        <TextInput style = {styles.box}
                            onChangeText={(text) => setGender(text)}
                            value = {gender}
                        />
                        <TextInput style = {styles.box}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                        />
                    </View>
                </View>
                    <View style = {styles.button}>
                        <Button title="Submit" onPress={handleSignUp} />
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
        flex: 1,
        fontSize: 30,
        fontWeight: "bold",
        lineHeight: 400,
        // backgroundColor: "white",
    },
    main: {
        flex: 1, 
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
        lineHeight: 50,
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
        flex: 1,
    }
});
