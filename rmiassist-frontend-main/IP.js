import NetworkInfo from 'react-native-network-info';
export default async function IP(){
    try {
        let ipAddress = await NetworkInfo.getIpAddress()
        return ipAddress
    } catch (error){
        console.log("Cannot get IPAddress")
        console.log(error)
    }
}