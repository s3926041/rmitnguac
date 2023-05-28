import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View,} from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SignUp from "./SignUp";
import Identification from "./Identification";
import HomePage from "./HomePage";
import Login from "./Login"

import Course from "./Course";
import Timetable from "./Timetable";
import ChatStack from "./Chat/ChatStack";
import PersonalInfo from "./PersonalInfo";
import NewTimeBlock from "./NewTimeBlock";
import EditInfo from "./EditInfo";

import StudentList from "./StudentList";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomePageTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomePage} />
        <Tab.Screen name="Course" component={CourseStack} />
        <Tab.Screen name="Timetable" component={TimetableStack} options={{headerShown: false}}/>
        <Tab.Screen name="Chat" component={ChatStack} />
        <Tab.Screen name="Personal Information Stack" component={PersonalInfoStack} options = {{headerShown: false}}/>
      </Tab.Navigator>
    );
  }



function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Identification" component={Identification} />
        <Stack.Screen name="Sign Up" component={SignUp} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="HomePageTabs" component={HomePageTabs} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function TimetableStack(){
    return (
        <Stack.Navigator>
          <Stack.Screen name = "TimetableScreen" component={Timetable} options={{headerShown: false}}/>
          <Stack.Screen name = "New Time Block" component={NewTimeBlock}/>
        </Stack.Navigator>
    )
}

function PersonalInfoStack(){
  return (
    <Stack.Navigator>
        <Stack.Screen name = "Personal Information" component = {PersonalInfo} />
        <Stack.Screen name = "EditInfo" component = {EditInfo} />
    </Stack.Navigator>
  )
}

function CourseStack(){
  return (
    <Stack.Navigator>
      <Stack.Screen name="GroupList" component={Course} options={{headerShown: false}}/>
      <Stack.Screen name="Student" component={StudentList} options={{headerShown: false}}/>
    </Stack.Navigator>
  )
}



export default Navigation;