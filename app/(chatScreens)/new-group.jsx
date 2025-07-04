import { View, Text, TextInput, Alert, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';
import { addUsertoChat } from '../../lib/appwrite';
import { icons } from '../../constants';


const NewGroup = () => {
    
    const params = useLocalSearchParams();
    const chatroomId = params.chatroomId;
    const [userName, setUserName] = useState('')
    const [groupName, setGroupName] = useState('')

    const createGroup = async (e) => {
        e.preventDefault()

        if (!userName||!groupName) {
            Alert('Please enter both fields') // or any other error handling you prefer
            return
          }
        addUsertoChat(chatroomId,userName,groupName)
        router.push("/messages")
        }
    
  return (
    <SafeAreaView className="bg-primary">
    <View className="h-[97%] mx-5 justify-center">
        <TouchableOpacity
          className="pr-2 absolute top-4 left-0"
          onPress={()=>{router.back()}}>
          <Image
            className="w-[26px] h-[40px]"
            source={icons.backArrowB}
            resizeMode='fill'
          />
        </TouchableOpacity>
        <Text className=" text-secondary text-center w-full font-psemibold text-xl">
          Create a group out of this chatroom!
        </Text>
      
        <Text className="font-pmedium text-base text-secondary mt-5 mx-1.5 mb-1.5">New Member</Text>
        <View className="justify-center items-center border-2 border-gray-200  focus:border-secondary bg-primary h-[70px] rounded-xl ">
        
          <TextInput
          className=" m-3  h-[70px] flex-wrap w-full rounded-2xl px-2.5 "
          placeholder="Inspired username you want to add"
          onChangeText={(e) => {setUserName(e)}}
          value={userName}
          multiline={true}
          >
          </TextInput>

        </View>
        <Text className="font-pmedium text-base text-secondary mt-5 mx-1.5 mb-1.5">Group Name</Text>
        
        <View className="justify-center items-center border-2 border-gray-200  focus:border-secondary bg-primary h-[70px] rounded-xl ">

          <TextInput
          className=" m-3  h-[40px] flex-wrap w-full rounded-full px-2.5"
          placeholder='Choose the name for your group'
          onChangeText={(e) => {setGroupName(e)}}
          value={groupName}
          multiline={true}
          >
          </TextInput>
          
        </View>
        <CustomButton
        handlePress={createGroup}
        textStyles={"text-white"}
        containerStyles={"bg-secondary"}
        title={"Create group"}/>
    </View>
    </SafeAreaView>
  )
}

export default NewGroup