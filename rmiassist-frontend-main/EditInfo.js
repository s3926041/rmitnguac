import { StatusBar } from "expo-status-bar";
import React, {useEffect, useState} from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet, Alert, TextInput, Button} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

export default function EditInfo ({navigation}){

    const route = useRoute()
    const {name, sid, gender, password} = route.params

    const [newGender,setNewGender] = useState("")
    const [newPassword,setNewPassword] = useState("")

    return (
        <View>
            <Text>Fucking Edit Info Page</Text>
            <Text>name</Text>
            <Text>sid</Text>
            <Text>gender</Text>
            <TextInput value = {newGender}></TextInput>
            <Text>password</Text>
            <TextInput value = {newPassword}></TextInput>
            <Button title = "Save" onPress = {()=>{navigation.navigate("Personal Information",{newGender:newGender, newPassword:newPassword, from: "EditInfo"})}}/>

        </View>
    ); 
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "lightblue",
//     },

//     info: {
//       alignItems: "center",
//     },

//     items: {
//       padding: 10,
//       fontWeight: "bold"
//     }
// })


