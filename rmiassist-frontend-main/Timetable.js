import React from "react"
import { useState, useEffect } from "react";
import { View, Text, ScrollView, Button} from "react-native"

import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import CalendarTimetable from "react-native-calendar-timetable";
import moment from "moment";
import TimeBlock from "./TimeBlock";
import NewTimeBlock from "./NewTimeBlock"

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Timetable({navigation}){
    //The Calendar
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0,10));

    const dayPressHandle = (day) => {
        setSelectedDate(day.dateString);
    };

    const [allItems,setAllItems] = useState([])

    const getItems = async () => {
        const currentID = await AsyncStorage.getItem("currentID")
        const ip = await AsyncStorage.getItem("ip")
        try {
            const response = await fetch(
                ip+'/items',
                {
                    method: "POST",
                    headers: {
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({sid:currentID})
                }
            )
            const foundItems = await response.json()

            // Change startDate and endDate in the JSON object from string object to Date object 
            foundItems.forEach((ele) => {
                ele.startDate = new Date(ele.startDate)
                ele.endDate = new Date(ele.endDate)
            })
            setAllItems(foundItems)
        } catch (error){
            console.log(error)
        }
    }

    useEffect(() => {
        getItems();
    }, []);

    // Make new Timeblock

    const handleNewTimeBlock = () =>{
        navigation.navigate("New Time Block")
    }

    // Reload to update 
    const [reload, setReload] = useState(false)

    const handleReload = () => {
        setReload(true)
    };
      
    useEffect(() => {
        getItems()
    }, [reload,allItems])

    return (
        <View>
            <ScrollView>
                <Button title = "New Time Block" onPress = {handleNewTimeBlock} />
                <Button title = "Reload" onClick={handleReload} />
                <Calendar
                onDayPress={dayPressHandle}
                markedDates={{
                    [selectedDate]: { selected: true },
                }}
                />
                <CalendarTimetable                     
                    items={allItems}
                    renderItem={props => <TimeBlock  {...props} />}
                    date = {new Date(selectedDate)}
                    renderHeader={true}
                />
            </ScrollView>
            
        </View>
    );
}