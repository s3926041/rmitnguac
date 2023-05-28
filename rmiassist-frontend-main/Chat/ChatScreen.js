import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useSocket } from "./SocketContext";

export default function ChatScreen({ route, navigation }) {
  const { conversation } = route.params;
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useSocket();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const getID = async () => {
      const id = await AsyncStorage.getItem("currentID");
      setUserId(id);
    };
    getID();
  }, []);

  useEffect(() => {
    const data = async () => {
      await axios
        .get(
          "http://192.168.0.102:8000/messages/" + route.params.conversation._id
        )
        .then((res) => {
          setMessages(res.data);
        });
    };
    data();
  }, []);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      conversation?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, conversation]);

  useEffect(() => {
    const namee = async () => {
      const otherId =
        conversation.members[0] == userId
          ? conversation.members[1]
          : conversation.members[0];
      const data = await axios.get(
        "http://192.168.0.102:8000/conversations/student/" + otherId
      );
      const name = data.data[0]?.name;
      console.log(name);
      navigation.setOptions({
        headerTitle: name ? name : "Name error",
      });
      namee();
    };
  }, [conversation, navigation]);

  const handleSend = () => {
    const send = async () => {
      if (text) {
        const message = {
          conversationId: conversation._id,
          sender: userId,
          text: text,
        };
        const receiverId = conversation.members.find(
          (member) => member !== userId
        );
        socket.emit("sendMessage", {
          senderId: userId,
          receiverId,
          text: text,
        });
        await axios
          .post("http://192.168.0.102:8000/messages/", message)
          .then(async (res) => {
            setMessages([...messages, message]);
            setText("");
          });
      }
    };
    send();
  };

  const scrollViewRef = useRef();
  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessage = (message, index) => {
    // console.log(message.sender + " " + message.text)
    const messageStyle =
      message.sender == userId
        ? [styles.message, styles.currentUserMessage]
        : styles.message;
    const cl = message.sender == userId ? styles.curText : styles.opText;
    console.log(cl);
    return (
      <View key={index}>
        <View style={messageStyle}>
          <Text style={cl}>{message.text}</Text>
          {/* <Text>{format(message.createdAt)}</Text> */}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        ref={scrollViewRef}
      >
        {messages.map((message, index) => renderMessage(message, index))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={(newText) => setText(newText)}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={handleSend}>
          <Ionicons name="send" size={30} color="#2196F3" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    marginBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  message: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: "column",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    color: "fff",
    backgroundColor: "#2196F3", // Customize the background color for messages sent by the current user
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f2f2f2",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  curText: {
    color: "#fff",
  },
  opText: {},
});
