import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import ConversationScreen from "./ConversationScreen";
import ChatScreen from "./ChatScreen";
import NewConversationScreen from "./NewConversationScreen";
import  { SocketProvider } from "./SocketContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Stack = createStackNavigator();

export default Chat = () => {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const getID = async () => {
      const id = await AsyncStorage.getItem("currentID");
      setUserId(id);
    };
    getID();
  }, []);

  return (
    <SocketProvider>
      <NavigationContainer independent={true}>
        <Stack.Navigator
          initialRouteName="ConversationScreen"
          screenOptions={({ navigation }) => ({
            presentation: "modal",
            ...TransitionPresets.ModalPresentationIOS,
          })}
        >
          <Stack.Screen
            name="ConversationScreen"
            component={ConversationScreen}
            options={({ navigation }) => ({
              title: "Chat",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("NewConversation")}
                  style={{ marginRight: 10 }}
                >
                  <Ionicons name="ios-add" size={32} color="black" />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={({ route, navigation }) => ({
               
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("ConversationScreen")}
                  style={{ marginLeft: 10 }}
                >
                  <Ionicons name="ios-arrow-back" size={32} color="black" />
                </TouchableOpacity>
              ),
              ...TransitionPresets.SlideFromRightIOS,
            })}
          />
          <Stack.Screen
            name="NewConversation"
            component={NewConversationScreen}
            options={({ navigation }) => ({
              title: "New Chat",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("ConversationScreen")}
                  style={{ marginLeft: 10 }}
                >
                  <Ionicons name="close" size={32} color="black" />
                </TouchableOpacity>
              ),
              ...TransitionPresets.ModalSlideFromBottomIOS,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketProvider>
  );
};
