import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  TextInput,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import { Feather, Entypo } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
const NewConversationScreen = ({ navigation }) => {
  const [friends, setFriends] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    const getData = async () => {
      await axios
        .get(
          "http://192.168.0.102:8000/conversations/available/" +
            (await AsyncStorage.getItem("currentID"))
        )
        .then((res) => {
          setFriends(res.data);
          console.log("first");
        });
    };
    getData();
  }, [navigation, isFocused]);

  const [filteredFriends, setFilteredFriends] = useState([]);

  useEffect(() => {
    if (friends.length > 0) {
      const elementsContainingPhrase = friends.filter((friend) => {
        if (friend?.name)
          return friend.name
            .toLowerCase()
            .includes(searchPhrase.trim().toLowerCase());
      });
      setFilteredFriends(elementsContainingPhrase);
    }
  }, [searchPhrase, friends]);

  const handleContainerPress = () => {
    Keyboard.dismiss();
    setClicked(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleContainerPress}>
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={styles.container}>
          <View
            style={
              clicked ? styles.searchBar__clicked : styles.searchBar__unclicked
            }
          >
            {/* search Icon */}
            <Feather
              name="search"
              size={20}
              color="black"
              style={{ marginLeft: 1 }}
            />
            {/* Input field */}
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              value={searchPhrase}
              onChangeText={setSearchPhrase}
              onFocus={() => {
                setClicked(true);
              }}
            />
            {/* cross Icon, depending on whether the search bar is clicked or not */}
            {clicked && (
              <Entypo
                name="cross"
                size={20}
                color="black"
                style={{ padding: 1 }}
                onPress={() => {
                  setSearchPhrase("");
                }}
              />
            )}
          </View>
          {/* cancel button, depending on whether the search bar is clicked or not */}
          {clicked && (
            <View>
              <Button
                title="Cancel"
                onPress={() => {
                  Keyboard.dismiss();
                  setClicked(false);
                }}
              ></Button>
            </View>
          )}
        </View>
        <View>
          {filteredFriends.length !== 0 &&
            filteredFriends.map((v, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.button}
                  onPress={async () => {
                    const id = await AsyncStorage.getItem("currentID");
                    const convo = await axios.post(
                      "http://192.168.0.102:8000/conversations/",
                      {
                        senderId: id,
                        receiverId: v._id,
                      }
                    );
                    console.log(convo.data);
                    navigation.navigate("ChatScreen", {
                      conversation: convo.data,
                    });
                  }}
                >
                  <Text style={styles.buttonText}>{v.name}</Text>
                </TouchableOpacity>
              );
            })}
          {friends.length === 0 && <Text>No friend available</Text>}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBar__clicked: {
    padding: 10,
    flexDirection: "row",
    width: "80%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    minWidth: "90%", // set the minimum width to 90% of the parent container
    maxWidth: 400, // limit the maximum width to 400 pixels
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default NewConversationScreen;
