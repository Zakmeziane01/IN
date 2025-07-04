import { View, Image, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import FormField from '../../components/FormField'
import { router, useFocusEffect } from 'expo-router'
import { getUserChatrooms } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import ChatroomsComp from '../../components/ChatroomsComp'



const Messages = () => {
  const {data : UserChatrooms, refetch} = useAppwrite(getUserChatrooms);
  const [hasRefetched, setHasRefetched] = useState(false);
  
  
  useFocusEffect(() => {
    //could change this for a subscruiption on messages and chatroom creation or deletion
    if (!hasRefetched) {
      setHasRefetched(true);
      setTimeout(function() {refetch();setHasRefetched(false);},5000 )// refetch data only once when the tab is focused
      console.log("test")
    }
  });
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="h-[90%]">
        <Text className="text-secondary font-pregular text-3xl my-2 mt-3 mx-4 ">Chats</Text>
        
      {/* vvvv this is for scrollview when the chats are same size as screen and tabs cover the last chatroom vvvv */}
      <ScrollView className=""> 
        <ChatroomsComp
          chatrooms={UserChatrooms}
          /> 
      </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Messages