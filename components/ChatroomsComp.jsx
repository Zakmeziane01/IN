import {TouchableOpacity, Text,TextInput, Image, View, ScrollView} from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router';
import { getChatGroupInfo, getChatLastMessage, getChatroomMatch, getChatUserInfo, getCurrentUser, getOnline } from '../lib/appwrite';
import useAppwrite from '../lib/useAppwrite';
import { icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatroomsComp = ({chatrooms}) => {
  const [userInfo, setUserInfo] = useState({});
  const {data : currentUser} = useAppwrite(getCurrentUser);
  const [onlineStatus, setOnlineStatus] = useState({});
  const [chatroomMatches, setChatroomMatches] = useState({});
  const [ChatLastMessage, setChatLastMessage] = useState({});
  const [chatroomInfo,setChatroomInfo] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfos = {};
      const chatLastMessage ={};
      const chatroomInfos ={};
      for (const chatroom of chatrooms) {
        try {
          const step = chatroom.progressBar
          chatroomInfos[chatroom.$id] = {step};
        } catch (error) {
          console.log(error)
        }
        try{
        const { body, createdAt } = await getChatLastMessage(chatroom.$id);
          chatLastMessage[chatroom.$id] = { body, createdAt };
        }catch(error){
          console.log(error)
        }
        if(chatroom.groupId) {
          const { id, username, avatar, admin, step } = await getChatGroupInfo(String(chatroom.groupId))
          userInfos[chatroom.$id] = {id, username, avatar , group:true, admin, step};
          // console.log(id, username, avatar)
        } else {
          const userId = chatroom.chatroomUserIds.find(id => id !== currentUser.$id);
          const { id, username, email, avatar, step } = await getChatUserInfo(userId);
          userInfos[chatroom.$id] = { id, username, email, avatar, step, requestAuthor: chatroom.requestAuthor };
        }
      }
      setChatroomInfo(chatroomInfos)
      setChatLastMessage(chatLastMessage)
      setUserInfo(userInfos);
    };
    fetchUserInfo();
  }, [chatrooms, currentUser]);
  useEffect(() => {
      const fetchOnlineStatus = async () => {
        const onlineStatuses = {};
        for (const chatroomId in userInfo) {
          if (!userInfo[chatroomId].group) {
            onlineStatuses[chatroomId] = await getOnline(userInfo[chatroomId].id);
          }
        }
        setOnlineStatus(onlineStatuses);
      };
      fetchOnlineStatus();
    }, [userInfo]);

    useEffect(() => {
      const fetchChatroomMatches = async () => {
        const matches = {};
        for (const chatroomId in userInfo) {
          matches[chatroomId] = await getChatroomMatch(chatroomId, currentUser);
          // console.log(await getChatroomMatch(chatroomId, currentUser))
        }
        setChatroomMatches(matches);
      };
      fetchChatroomMatches();
    }, [userInfo, currentUser]);

    const filteredChatrooms = Object.keys(userInfo).filter(chatroomId => {
      return userInfo[chatroomId].username.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
      <View>
        <View className=" h-[60px] flex-row mx-4 items-center px-3 rounded-2xl bg-primary border-gray-200 border-[2px] focus:border-secondary">
          <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={"gray"}
          className='flex-grow h-full ' 
          placeholder={'Search'}>
          </TextInput>
          <Image 
          source={icons.search}
          className=" w-6 h-6"
          resizeMode="contain"
          />
        </View>
        <View className="border-b-[3px] mt-4 border-gray-200 "></View>
        {filteredChatrooms
          .sort((a, b) => {
            const dateA = ChatLastMessage[a]?.createdAt ? new Date(ChatLastMessage[a].createdAt) : 0;
            const dateB = ChatLastMessage[b]?.createdAt ? new Date(ChatLastMessage[b].createdAt) : 0;
            return dateB - dateA; // Sort in descending order (most recent first)
          }).map(chatroomId => (
        <View key={chatroomId}>
        {/* {console.log('HEREEE',currentUser.$id == userInfo[chatroomId].requestAuthor)}  */}
          {/* {console.log("hereeee",chatroomMatches[chatroomId])} */}
          <TouchableOpacity
          className="flex-row items-center flex-shrink border-b-[2px] border-gray-50 "
          onPress={() => {
            if (userInfo[chatroomId].group) {
              // console.log(userInfo[chatroomId])
              // console.log("its a group")
              router.push({ pathname: "../(chatScreens)/chat", params: { 
                  chatroomId: chatroomId,
                  userId: userInfo[chatroomId].id,
                  userName: userInfo[chatroomId].username,
                  userAvatar: userInfo[chatroomId].avatar,
                  groupAdmin: userInfo[chatroomId].admin,
                  currentUser: currentUser.$id,
                  currentUsername: currentUser.username,
                  isGroup: true } });
              } else {
                // console.log(currentUser.$id)
                router.push({ pathname: "../(chatScreens)/chat", params: { 
                  chatroomId: chatroomId,
                  userId: userInfo[chatroomId].id,
                  userName: userInfo[chatroomId].username,
                  userAvatar: userInfo[chatroomId].avatar,
                  userEmail: userInfo[chatroomId].email,
                  currentUser: currentUser.$id,
                  currentUsername: currentUser.username,
                  isGroup: false  } });
              }
            }}
            
          >
            <View className="flex-row items-centersflex-grow  font-pregular ml-5 mr-5 my-3">
              {userInfo[chatroomId].group && !userInfo[chatroomId].avatar ? (
                  <View
                    className="w-[56px] h-[56px] rounded-full border-2 border-secondary justify-center items-center p-1.5"
                  >
                    <Image
                  source={icons.groupB}
                  className="w-full h-full  "
                  // resizeMode='contain'
                />
                  </View>
                ) : (
                  <View
                    className="w-[56px] h-[56px] rounded-full border-2 border-secondary justify-center items-center p-0.5"
                  >
                    <Image
                      source={{uri: userInfo[chatroomId].avatar}}
                      className="w-full h-full rounded-full"
                      resizeMode='cover'
                    />
                    {!userInfo[chatroomId].group && onlineStatus[chatroomId] ? 
                      <View className="w-[17px] h-[17px] absolute bottom-0 left-10  border-[2px] border-white bg-secondary rounded-full"></View> 
                      : null}
                    
                  </View>
                )}
              <View className="ml-3 flex-grow flex-shrink justify-center">
                <View className="flex-row items-center justify-between">
              <Text numberOfLines={1} className=" text-secondary text-lg flex-shrink font-pmedium">
                {/* {console.log(getOnline(userInfo[chatroomId].id))} */}
                {userInfo[chatroomId].username} </Text>
                <Image
              className="w-[110px] h-[27px]"
              source={images.chatroomPB}
              resizeMode='contain'
                />
                
                {/* {!userInfo[chatroomId].group && onlineStatus[chatroomId] ? ' Online' : ' Offline'} */}
              
              </View>
              {ChatLastMessage[chatroomId] ? 
              <View className=" justify-between items-center flex-grow mt-1 flex-row">
                {/* {console.log(getOnline(userInfo[chatroomId].id))} */}
                <Text numberOfLines={1} className=' text-gray-100 flex-1 mr-2 text-base font-pregular'>
                {ChatLastMessage[chatroomId].body}
                </Text>
                {ChatLastMessage[chatroomId] ? 
                 new Date(ChatLastMessage[chatroomId].createdAt).toLocaleDateString() !== new Date().toLocaleDateString() ? 
                  <Text className=' text-gray-100 text-sm font-pregular'>
                    {new Date(ChatLastMessage[chatroomId].createdAt).toLocaleDateString(['en-GB'], {day: "2-digit",month: "2-digit",year: "2-digit"})}
                  </Text> 
                  : 
                  <Text className=' text-gray-100 text-sm font-pregular'>
                    {new Date(ChatLastMessage[chatroomId].createdAt).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false })}
                  </Text>: null}
                 
                {/* {!userInfo[chatroomId].group && onlineStatus[chatroomId] ? ' Online' : ' Offline'} */}
              </View>
              : null}
              <View className='flex-row-reverse'>
              
              </View>
              </View>
            </View>
          </TouchableOpacity>
              
          {/* <View className="border-b-[2px] border-gray-50 "></View> */}
        </View>
      ))}
    </View>
  );
};

export default ChatroomsComp