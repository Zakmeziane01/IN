import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '../../constants'
import { router, useLocalSearchParams } from 'expo-router'
import { createChatroom, databaseId, databases, getCurrentUser, messagesCollectionId } from '../../lib/appwrite'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'
import { ID } from 'react-native-appwrite'

const firstChat = () => {

  const params = useLocalSearchParams();
  // const chatroomId = params.chatroomId;
  const userId = params.userId;
  const userName = params.userName;
  const userAvatar = params.userAvatar;
  const isGroup = params.isGroup;
  const currentUser = params.currentUser;
  const currentUsername = params.currentUsername;
  
  const [messages, setMessages]= useState([])
  const [messageBody, setMessageBody] = useState('')

  const handleSubmit = async (e) => {
    
    e.preventDefault()

    const trimmedMessageBody = messageBody.trim()

    if (!trimmedMessageBody) {
      console.log("cancelled")
      // alert('Please enter a message') // or any other error handling you prefer
      return
    }

    let newChatroom = await createChatroom(currentUser, userId)
    console.log(newChatroom)
    let payload = {
      body: trimmedMessageBody,
      username: currentUsername,
      chatroomId: newChatroom,
      senderId:currentUser
      
    }

    let response = await databases.createDocument(
      databaseId,
      messagesCollectionId,
      ID.unique(),
      payload
    )

    setMessageBody('')

    // router.push({ pathname: "../(chatScreens)/chat", params: { 
    //   chatroomId: newChatroom,
    //   userId: userId,
    //   userName: userName,
    //   userAvatar: userAvatar,
    //   //userEmail: userInfo[chatroomId].email,
    //   currentUser: currentUser,
    //   currentUsername: currentUsername,
    //   isGroup: false  }
    //  });
     router.replace("../(tabs)/messages")
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

    <SafeAreaView className="bg-white h-full">
      <View className=" pt-3 flex-row items-center px-3 ">
        <TouchableOpacity
          className="pr-2"
          onPress={()=>{router.back()}}>
        <Image
        className="w-[26px] h-[40px]"
        source={icons.backArrowB}
        resizeMode='fill'
        />
        </TouchableOpacity>
        <TouchableOpacity 
        onPress={() => {router.push({pathname: "/chat-info", params: userAvatar} )}}
        className="flex-grow ">
        <View className="flex-row items-center">
        <View className=" p-0.5  w-[66px] h-[66px] mr-3 rounded-xl justify-center items-center">
        <Image
        source={isGroup && !userAvatar? icons.groupB :{uri:userAvatar}}
        className={`${isGroup && !userAvatar? 'h-[50px] w-[50px]' :'w-full h-full rounded-xl'} `}
        resizeMode='cover'
        />
        </View>
        <View className="flex-col">
        <Text className="text-2xl text-black">{userName}</Text>
        
        
        </View>
      </View>
      </TouchableOpacity>
      {/* {isGroup === "false" ?
      <TouchableOpacity
        className="w-[50px] h-[50px] justify-center items-center ml-auto mr-1"
        onPress={() => router.push({pathname:"(chatScreens)/new-group", params:{chatroomId: chatroomId}})}
        // onPress={() => {}} prompt for userId and then create group edit chatroom by adding person and groupId 
        >
        <Image
        className="w-[35px] h-[35px]"
        source={icons.groupB}
        resizeMode='contain'
        /> 
        </TouchableOpacity>
          :null} */}
        <View
          className={`{w-[50px] h-[50px] ${isGroup === "true" ? 'ml-auto' : ''} justify-center items-center}`}>
        
        {false ? 
        <Menu>
          <MenuTrigger> 
          <Image
          source={icons.menuB}
          className="w-[40px] h-[30px]"
          resizeMode='contain'
          
          />
          </MenuTrigger>
            <MenuOptions customStyles={{
              optionsContainer: {
                padding : 10, 
                borderRadius: 10,
              },
          }}>
            <MenuOption onSelect={() => Alert.alert(
                        'Report User',
                        "If you report this user the chat will be permanently deleted from your account.", // <- this part is optional, you can pass an empty string
                        [
                          { text: 'Cancel', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                          { text: 'Report User', onPress: () => { reported(userId) } },
                        ],
                        { cancelable: true },
                      )} >
              <Text className="text-red-600 text-lg font-pregular">Report</Text>
            </MenuOption>
            {isGroup == "true"?
            <MenuOption onSelect={() => alert(`Reported`)} >
              <Text className="text-lg font-pregular">Edit Group</Text>
            </MenuOption>:
            <MenuOption onSelect={() => router.push({pathname:"(chatScreens)/new-group", params:{chatroomId: chatroomId}})} >
            <Text className="text-lg font-pregular">Create group</Text>
            </MenuOption>}
            {/* <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' /> */}
          </MenuOptions>
        </Menu> : null}
        </View>
      </View>
      {/* {false ? 
      <View className="py-3 justify-center items-center">
        <TouchableOpacity
        className="justify-center items-center"
        onPress={() => router.push({pathname:"/chat-progression", params:{chatroomId: chatroomId , groupAdmin, isGroup: isGroup}})}>
        <Image
            className="w-[360px] h-[50px]"
            source={images.progressSW}
            resizeMode='contain'
          />
        </TouchableOpacity>
      </View> : null } */}
      <ScrollView
      className="h-full bg-white"
      > 
        {/* <MessagesComp
        messages = {messages}
        otherId = {userId}
        userAvatar = {userAvatar}
        isGroup={isGroup}
        // currentUser={currentUser}
        /> */}
      </ScrollView>
      {/* {(isGroup === "false" && request !== "noshow" && currentUser !== requestAuthor && chatroomId) ?
      <View className="">
        <View className="border-gray-100 border-[1px] p-1.5 self-center w-[90%] rounded-xl h-[120px]">
          <Text className="text-secondary font-pmedium text-lg px-2 self-center ">{userName} requested to move to the {request} stage </Text>
            <View className="flex-row mt-2 ">
              <TouchableOpacity
              onPress={acceptStage}
              className="m-0 w-[40%] h-[40px] justify-center items-center mx-1.5 rounded-xl bg-secondary"
              ><Text className="text-white font-pmedium">Accept</Text></TouchableOpacity>
              <TouchableOpacity
              onPress={declineStage}
              className="m-0 w-[40%] h-[40px] justify-center items-center mr-1.5 rounded-xl bg-[#162122]"
              ><Text className="text-white font-pmedium">Decline</Text></TouchableOpacity>
            </View>
        </View>
      </View>
      : null} */}
      <View className=" flex-row m-1.5">
        <View className="justify-center items-center bg-transparent flex-row flex-1 border-2 border-secondary focus:border-[#e2fcde] bg-primary h-[50px] rounded-full ">
          <TextInput
          className=" m-3  h-[40px] flex-wrap w-full rounded-full p-2.5"
          placeholder='Message'
          onChangeText={(e) => {setMessageBody(e)}}
          value={messageBody}
          multiline={true}
          >
          </TextInput>
        </View>
        <View className="justify-center ml-1 bg-secondary rounded-full">
          <TouchableOpacity
          onPress={handleSubmit}
          >
            <Image 
              source={images.Wlogo}
              className="w-10 h-10 m-1 "
            />
          </TouchableOpacity>
          </View>
      </View>
      {/* <StatusBar backgroundColor='#ffffff' style='dark'/>  */}
    </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default firstChat