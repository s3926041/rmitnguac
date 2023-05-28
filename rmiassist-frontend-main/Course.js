import React, { useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroupList = ({ navigation }) => {
    const [groups, setGroups] = useState([]);

    const toggleIsEditing = (groupIndex) => {
        const newGroups = [...groups];
        newGroups[groupIndex].isEditing = !newGroups[groupIndex].isEditing;
        setGroups(newGroups);
    };

    const handleMemberNameChange = (groupIndex, memberIndex, newName) => {
        setGroups((prevGroups) => {
            const newGroups = [...prevGroups];
            newGroups[groupIndex] = {
                ...newGroups[groupIndex],
                memberNames: newGroups[groupIndex].memberNames.map((name, index) =>
                    index === memberIndex ? newName : name
                ),
            };
            return newGroups;
        });
    };

    // create groups button:
    const CreateGroupButton = () => {
        const [groupName, setGroupName] = useState('');
        const [courseId, setCourseId] = useState('');
        const [studentId, setStudentId] = useState('');

        const handleCreateGroup = () => {
            // Make a POST request to the server to create the group
            fetch('http://localhost:8000/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    groupName,
                    courseId,
                    studentId,
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Failed to create group');
                    }
                })
                .then((group) => {
                    console.log('Group created:', group);
                    // Handle success, display a message, or update the UI accordingly
                    Alert.alert('Group Created', 'Group has been created successfully');
                })
                .catch((error) => {
                    console.error('Error creating group:', error);
                    // Handle error, display an error message, or perform error handling
                    Alert.alert('Error', 'Failed to create group');
                });
        };

        return (
            <View>
                <TextInput
                    placeholder="Group Name"
                    value={groupName}
                    onChangeText={setGroupName}
                />
                <TextInput
                    placeholder="Course ID"
                    value={courseId}
                    onChangeText={setCourseId}
                />
                <TextInput
                    placeholder="Student ID"
                    value={studentId}
                    onChangeText={setStudentId}
                />
                <Button title="Create Group" onPress={handleCreateGroup} />
            </View>
        );
    };

    // Fetch groups, check if the current user is the group leader and then make that change 


    useEffect(() => {
        const fetchGroups = async () => {
            const currentID = await AsyncStorage.getItem("currentID")
            const ip = await AsyncStorage.getItem("ip")
            try {
                const responseStudent = await fetch(ip + "/personalInfo", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sid: currentID })
                })
                const receivedStudentData = await responseStudent.json()
                const currentStudent = receivedStudentData[0]

                const responseGroups = await fetch(ip + "/fetchGroups", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ groups: currentStudent.groups })
                })
                const currentGroups = await responseGroups.json()
                console.log(currentGroups)
                const updatedGroups = currentGroups ? currentGroups.map((group) => {
                    console.log(1)
                    if (group.leader === currentID) {
                        return {
                            ...group,
                            isEditing: false,
                            isLeader: true,
                        }
                    } else {
                        return {
                            ...group,
                            isEditing: false,
                            isLeader: false,
                        }
                    }
                }) : [];
                setGroups(updatedGroups)
            } catch (error) {
                console.log(error)
            }
        }
        fetchGroups()
    }, [])





    return (
        <ScrollView style={styles.container}>

        <View style={styles.topNav}>
        <TouchableOpacity style={[styles.navButton,styles.studentL]} onPress={() => navigation.navigate('Student')}>
          <Text style={styles.navButtonText}>Student List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton,styles.groupL]}>
          <Text style={styles.navButtonText}>Group List</Text>
        </TouchableOpacity>
        </View>
  
        {groups && groups.map((group, groupIndex) => (
          <View style={styles.groupContainer} key={group.groupName}>
            <Text style={styles.groupTitle}>{group.groupName}</Text>
            {group.members.map((name, memberIndex) => (
              <View key={`${groupIndex}-${memberIndex}`} style={styles.memberContainer}>
                {group.isEditing ? (
                  <TextInput
                    style={styles.editInput}
                    value={name}
                    onChangeText={(newName) => handleMemberNameChange(groupIndex, memberIndex, newName)}
                    key={`${groupIndex}-${memberIndex}-input`}
                  />
                ) : (
                  <Text style={styles.memberText}>{name}</Text>
                )}
              </View>
            ))}
            <View style={styles.buttonContainer}>
            {/* <TouchableOpacity style={styles.editButton} onPress={() => toggleIsEditing(groupIndex)}>
              <Text style={styles.editButtonText}>{group.isEditing ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={[styles.editButton, !group.isLeader && styles.hiddenButton]} onPress={() => toggleIsEditing(groupIndex)}>
              <Text style={styles.editButtonText}>{group.isEditing ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
            </View>
          </View>
        ))}
  
      </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'teal',
    },
    groupContainer: {
        marginBottom: 6,
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        marginVertical: 8,
        borderRadius: 8,
        elevation: 2,
    },
    groupTitle: {
        paddingLeft: 8,
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
    },
    memberContainer: {
        paddingLeft: 8,
        marginBottom: 8,
    },
    memberText: {
        fontSize: 16,
    },
    editInput: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
    },
    editButton: {
        backgroundColor: '#007AFF',
        padding: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    buttonContainer: {
        paddingLeft: 8,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    navButton: {
        backgroundColor: 'white',
        padding: 8,
        marginTop: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    navButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    topNav: {
        paddingTop: 8,
        paddingBottom: 8,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    studentL: {
        flex: 1,
    },
    groupL: {
        borderBottomWidth: 3,
        borderBottomColor: 'black',
        width: '50%',
    },
    createGroupButton: {
        backgroundColor: 'teal',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    createGroupButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    hiddenButton: {
        display: 'none',
    },
});

export default GroupList;
