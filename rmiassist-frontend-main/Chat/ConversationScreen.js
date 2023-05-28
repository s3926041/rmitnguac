import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useSocket } from "./SocketContext";

const ConversationScreen = ({ navigation }) => {
  const socket = useSocket();
  const [conversations, setConversation] = useState([]);
  const [lastMessage, setLastMessage] = useState([]);
  const [otherName, setOtherName] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [userId, setUserId] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    const getID = async () => {
      const id = await AsyncStorage.getItem("currentID");
      setUserId(id);
    };
    getID();
  }, []);
  useEffect(() => {
    const url = "http://192.168.0.102:8000/conversations/";
    const getData = async () => {
      const s = await AsyncStorage.getItem("currentID");
      await axios
        .get(url + s)
        .then((response) => {
          setConversation(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };
    getData();
  }, [navigation, isFocused, arrivalMessage]);

  useEffect(() => {
    setOtherName([]);
    setLastMessage([]);
    conversations.map((conversation) => fetch(conversation));
  }, [conversations]);

  const fetch = async (conversation) => {
    const id = await AsyncStorage.getItem("currentID");
    const otherId =
      conversation.members[0] == id
        ? conversation.members[1]
        : conversation.members[0];
    const data = await axios.get(
      "http://192.168.0.102:8000/conversations/student/" + otherId
    );
    const data2 = await axios.get(
      "http://192.168.0.102:8000/messages/" + conversation._id
    );
    const name = data.data[0]?.name;
    const text = data2.data[data2.data.length - 1]?.text;
    const createdAt = data2.data[data2.data.length - 1]?.createdAt;
    // console.log(createdAt);
    setLastMessage((prevState) => ({
      ...prevState,
      [conversation._id]: { text, createdAt },
    }));
    setOtherName((prevState) => ({ ...prevState, [conversation._id]: name }));
  };

  const handleChatPress = (conversation) => {
    navigation.navigate("ChatScreen", {
      conversation: conversation,
    });
  };
  const sortedConversations = conversations.sort((a, b) => {
    const lastMessageA = lastMessage[a._id];
    const lastMessageB = lastMessage[b._id];

    if (lastMessageA && lastMessageB) {
      return (
        new Date(lastMessageB.createdAt) - new Date(lastMessageA.createdAt)
      );
    } else if (lastMessageA) {
      return -1;
    } else if (lastMessageB) {
      return 1;
    } else {
      return 0;
    }
  });

  const formattedDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };
  return (
    <ScrollView style={styles.container}>
      {sortedConversations.map((conversation, i) => (
        <TouchableOpacity
          key={conversation._id}
          style={[styles.conversation]}
          onPress={() => handleChatPress(conversation)}
        >
          <View>
            <Text style={styles.conversationName}>
              {" "}
              {otherName[conversation._id] || "Loading..."}
            </Text>
            <View>
              <Text style={styles.conversationLastMessage}>
                {lastMessage[conversation._id]?.text || "Loading..."}
              </Text>
              <Text style={styles.conversationTimestamp}>
                {formattedDate(lastMessage[conversation._id]?.createdAt) || ""}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  conversation: {
    borderColor: "#000",
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
  },
  selectedConversation: {
    backgroundColor: "#e0e0e0",
  },
  conversationName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  conversationLastMessage: {
    marginVertical: 2,
    fontSize: 14,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ConversationScreen;
