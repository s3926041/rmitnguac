
import { StatusBar } from "expo-status-bar";
import { View, SafeAreaView, StyleSheet } from "react-native";
import Navigation from "./Navigation"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react";


export default function App() {
    const setIP = async () => {
        await AsyncStorage.setItem("ip","http://192.168.0.102:8000")
    }    

    setIP()
    return (
        <View style = {styles.container}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <SafeAreaView style = {styles.contentContainer}>
                <Navigation/>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});
