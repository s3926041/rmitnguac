import { StatusBar } from "expo-status-bar";
import { StyleSheet,Text,View,Image,Button} from "react-native";

export default function Identification({ navigation }) {
    return (
        <View style = {styles.container}>
            <Image
                source={require("./assets/logo.png")}
                style={{ width: 300, height: 200 }}
            />
            <Button 
                title="Log in" 
                onPress = { () => navigation.navigate("Login")}
            />
            <Button
                title="Sign up"
                onPress={() => navigation.navigate("Sign Up")}
            />
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
    text: {
        fontSize: 30,
        fontWeight: "bold",
    },
});
