import React from 'react';
import { FlatList, StyleSheet,TouchableOpacity, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const students = [
  { id: 1, name: 'Alice', age: 18, sid: 's12345678' },
  { id: 2, name: 'Bob', age: 18, sid: 's12345678' },
  { id: 3, name: 'Charlie', age: 18, sid: 's12345678' },
  { id: 4, name: 'David', age: 18, sid: 's12345678' },
];

const StudentList = () => {
  const navigation = useNavigation();

  const studentViews = students.map((student) => (
    <View style={styles.item} key={student.id}>
      <Text style={styles.name}>{student.name} - Age: {student.age} - SID: {student.sid}</Text>
    </View>
  ));

  return (
    <View style={styles.container}>

      <View style={styles.topNav}>
      <TouchableOpacity style={[styles.button,styles.studentL]}>
        <Text style={styles.buttonText}>Student List</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button,styles.groupL]} onPress={() => navigation.navigate('GroupList')}>
        <Text style={styles.buttonText}>Group List</Text>
      </TouchableOpacity>
      </View>

      {studentViews}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'teal',
    flex: 1,
    padding: 16,
  },
  item: {
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: 'black',
    padding: 6,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  button: {
    backgroundColor: 'white',
    padding: 8,
    alignSelf: 'center',
    marginTop: 16,
  },
  buttonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  topNav : {
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  studentL: {
    borderBottomWidth: 3,
    borderBottomColor: 'black',
    width: '50%',
  },
  groupL: {
    flex: 1,
  },
});

export default StudentList;