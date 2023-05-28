import { StatusBar } from "expo-status-bar";
import React, {useEffect, useState} from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet, Alert, Button} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';


export default function PersonalInfo ({navigation}){
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const [name, setName] = useState("")
    const [sid, setSID] = useState("")
    const [gender, setGender] = useState ("")
    const [password, setPassword] = useState("")

    
    const getStudents = async () => {
        const currentID = await AsyncStorage.getItem("currentID")
        const ip = await AsyncStorage.getItem("ip")
        try { 
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sid: currentID })
            };
            const response = await fetch(ip+'/personalInfo', requestOptions);
            const receivedData = await response.json();
            setData(receivedData)
            setName(receivedData[0].name)
            setSID(receivedData[0].sid)
            setGender(receivedData[0].gender)
            setPassword(receivedData[0].password)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const route = useRoute()
    
    useEffect(() => {
        getStudents()
    }, []);

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <View style = {styles.info}>
                    <Text style = {styles.items}>Name: {name}</Text>
                    <Text style = {styles.items}>Student ID: {sid}</Text>
                    <Text style = {styles.items}>Gender: {gender}</Text>
                    <Text style = {styles.items}>Password: {password}</Text>
                </View>
            )}
        </View>
    ); 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightblue",
    },

    info: {
      alignItems: "center",
    },

    items: {
      padding: 10,
      fontWeight: "bold"
    }
})