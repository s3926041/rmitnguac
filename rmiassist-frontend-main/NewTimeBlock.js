import {useState} from "react"
import { View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard} from "react-native"
import DateTimePicker from '@react-native-community/datetimepicker'
import ColorPicker from 'react-native-wheel-color-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function NewTimeBlock({navigation}){
    const [title, setTitle] = useState("")

    const [location, setLocation] = useState("")
    
    const [color, setColor] = useState("")
    const onColorChange = color => {
        setColor(color);
    };
    
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    
    const [submitIsActive, setSubmitIsActive] = useState(true)
    
    const handleSubmit = async () => {
        // Make button sleep for 3 seconds
        if (!submitIsActive) {
            return
        }

        // Add hours to make time local
        startDate.setHours(startDate.getHours()+7)
        endDate.setHours(endDate.getHours()+7)
        
        // Make connection and send relevant information
        try {
            const ip = await AsyncStorage.getItem("ip")
            const id = await AsyncStorage.getItem("currentID")
            const response = await fetch (ip+"/addItem", {
                method: "POST",
                headers: {
                    'Content-type':'application/json'
                },
                body: JSON.stringify({
                    sid: id,
                    title: title,
                    startDate: startDate.toISOString().slice(0,-5),
                    endDate: endDate.toISOString().slice(0,-5),
                    location: location,
                    color: color
                })
            })
            const receivedData = await response.json()
            console.log(1)
            console.log(receivedData)
            if (receivedData.message === 1) {
                alert("Time item added successfully")
                navigation.navigate("TimetableScreen")
            } else {
                alert("Time item NOT added")
                navigation.navigate("TimetableScreen")
            }

        } catch(error) {
            console.log(error)
        }

        setSubmitIsActive(false)
        setTimeout(() => {
            setSubmitIsActive(true)
        }, 3000)
    }
    
    // Make the button inactive for 5 seconds
    
    
    return (
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
            <View>
                {/* Title */}
                <Text>Title</Text>
                <TextInput
                    style = {{backgroundColor: 'white'}}
                    value = {title}
                    onChangeText={(text) => {setTitle(text)}}
                />
                {/* Start Date */}
                <Text>Start Date</Text>
                <DateTimePicker
                value={startDate}
                mode="datetime"
                is24Hour={true}
                display="default"
                onChange={(event,selectedStartDate) => {
                    setStartDate(selectedStartDate || startDate)
                }}
                />
                {/* End Date */}
                <Text>End Date</Text>
                <DateTimePicker
                value={endDate}
                mode="datetime"
                is24Hour={true}
                display="default"
                onChange={(event,selectedEndDate) => {
                    setEndDate(selectedEndDate || endDate)
                }}
                />
                {/* Location */}
                <Text>Location</Text>
                <TextInput
                    style = {{backgroundColor: 'white'}}
                    value = {location}
                    onChangeText={(text) => {setLocation(text)}}
                />
                {/* Color Picker */}
                <Text>Color</Text>
                <View style = {styles.colorPicker}>
                    <ColorPicker
                        color={color}
                        onColorChange={(color) => {
                            onColorChange(color)
                        }}
                        // onColorChangeComplete={color => alert(`Color selected: ${color}`)}
                        thumbSize={20}
                        sliderSize={20}
                        swatches = {false}
                    />
                </View>
                {/* Submit button */}
                <Button title = "submit" onPress={handleSubmit} style = {{width: "20%"}}/>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    colorPicker: {
        paddingHorizontal: 24,
        height: 230,
        marginBottom: 30,
    },
});