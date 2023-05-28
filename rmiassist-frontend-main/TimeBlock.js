import { Text, View } from 'react-native'

export default function TimeBlock({style, item, dayIndex, daysTotal}) {
    return (
        <View style={{
            ...style, 
            backgroundColor: item.color,
            borderRadius: 10,
            elevation: 5,
        }}>
            <Text>{item.title}</Text>
            <Text>{item.location}</Text>
        </View>
    );
}