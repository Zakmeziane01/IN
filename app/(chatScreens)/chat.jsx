import { Alert, View, Image, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Touchable } from 'react-native'
import React, {useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router, useLocalSearchParams } from 'expo-router'
import client, {databases, databaseId, messagesCollectionId, getCurrentUser, chatroomCollectionId, getEnk, addUsertoChat, getStepRequest, getChatroomStep, updateChatroomStep, updateStepRequest, getRequestAuthor, updateRequestAuthor, getOnline, reported, getChatUserItem } from '../../lib/appwrite'
import { icons, images } from '../../constants'
import {ID, Query} from "react-native-appwrite"
import useAppwrite from '../../lib/useAppwrite'
import MessagesComp from '../../components/MessagesComp'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'
import { StatusBar } from 'expo-status-bar'
import * as Crypto from 'expo-crypto';
import CustomButton from '../../components/CustomButton'

const chat = () => {

  const params = useLocalSearchParams();
  const chatroomId = params.chatroomId;
  const userName = params.userName;
  const userAvatar = params.userAvatar;
  const userEmail = params.userEmail;
  const isGroup = params.isGroup;
  const userId = params.userId;
  const groupAdmin = params.groupAdmin;
  const currentUser = params.currentUser;
  const currentUsername = params.currentUsername;
  

  const {data : mkey} = useAppwrite(getEnk);
  const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages]= useState([])
  const [messageBody, setMessageBody] = useState('')
  // const {data : currentUser} = useAppwrite(getCurrentUser);
  // const {data : step} = useAppwrite(() => getChatroomStep(chatroomId));
  const [request, setRequest] = useState( "noshow");
  const steps = ['matched', 'startconversation', 'planning', 'startworking'];
  const [step1, setStep1] = useState("step");
  const [requestAuthor, setRequestAuthor] = useState('')
  const [onlineStatus, setOnlineStatus] = useState(false)
  const userItem = getChatUserItem(userId)
  // setRequest( getStepRequest(chatroomId))
  // const {data : currentChatroom} = useAppwrite(getCurrentChatroom);
  
  // const onRefresh = async () =>{
  //   await refetch();
  // }

  useEffect(() => {
    async function fetchRequestAuthor() {
      const requestAuthor1 = await getRequestAuthor(chatroomId);
      console.log(requestAuthor1);
      setRequestAuthor(requestAuthor1)
    }
    fetchRequestAuthor();

    async function fetchChatroomStep() {
      const chatroomStep = await getChatroomStep(chatroomId);
      console.log(chatroomStep);
      setStep1(chatroomStep)
    }
    fetchChatroomStep();
    // console.log('i ran')
    // setStep1(step);
    // setRequestAuthor(getRequestAuthor(chatroomId))
    console.log(requestAuthor)
    // console.log(typeof currentUser)
    console.log(currentUser == requestAuthor) // Set the initial value of step1 when the component mounts
  }, []);

  useEffect(() => {
    const fetchOnlineStatus = async () => {
        if (isGroup == "false") {
          let onlineStatus = await getOnline(userId);
          setOnlineStatus(onlineStatus);
          setTimeout(fetchOnlineStatus,3000)
        }
    };
    fetchOnlineStatus();
    console.log("running")
  }, []);

  useEffect(() => {
    //subscribed to requestAuthor 
    // console.log(getStepRequest(chatroomId))
    const unsubscribe1 = client.subscribe([`databases.${databaseId}.collections.${chatroomCollectionId}.documents.${chatroomId}`, 'requestAuthor'], response => {
      // console.log(response)
      if (response.events.includes("databases.*.collections.*.documents.*.update")) {
          // console.log(response.payload.stepRequest ==='noshow')
          if(response.payload.requestAuthor){
            setRequestAuthor(response.payload.requestAuthor)
          }else {
            console.log('no requestAuthor')
          }
      }
    });
  
    return () => {
      unsubscribe1()
    }
  }, []);
  
  useEffect(() => {
    // subscribed to stepRequest
    // console.log(getStepRequest(chatroomId))
    const unsubscribe1 = client.subscribe([`databases.${databaseId}.collections.${chatroomCollectionId}.documents.${chatroomId}`, 'stepRequest'], response => {
      console.log(response)
      if (response.events.includes("databases.*.collections.*.documents.*.update")) {
          // console.log(response.payload.stepRequest ==='noshow')
          if(response.payload.stepRequest === 'noshow'){
            setRequest("noshow")
          }else if(response.payload.stepRequest ==="next" || response.payload.stepRequest==="previous"){
            console.log(response.payload.stepRequest)
            setRequest(response.payload.stepRequest)
            // setTimeout(() =>{setRequest(response.payload.stepRequest)},6000)
            // setRequest(response.payload.stepRequest)
          
          }
      }
    });
  
    return () => {
      unsubscribe1()
    }
  }, []);

  useEffect(() => {
    //subscribed to messages
    getMessages() 

    const unsubscribe = client.subscribe(`databases.${databaseId}.collections.${messagesCollectionId}.documents`, response => {
    // Callback will be executed on changes for documents A and all files.
    // console.log(response)
    if(response.events.includes("databases.*.collections.*.documents.*.create") && response.payload.chatroomId == chatroomId ){
      console.log("a message was created")
      setMessages(prevState => [...prevState,response.payload])
    }

    if(response.events.includes("databases.*.collections.*.documents.*.delete")&& response.payload.chatroomId == chatroomId){
      console.log("a message was deleted!!!")
      setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id))
    }

    if(response.events.includes("databases.*.collections.*.documents.*.update")&& response.payload.chatroomId == chatroomId){
      console.log("a message was updated")
    }
    });

    return () => {
      unsubscribe()
    }
  }, []);

  useEffect(() => {
    const fetchRequest = async () => {
      const request = await getStepRequest(chatroomId);
      setRequest(request);
      console.log(request)
    };
    fetchRequest();
  }, []);
  
  const handleSubmit = async (e) => {
    
    e.preventDefault()

    const trimmedMessageBody = messageBody.trim()
    
    if (!trimmedMessageBody) {
      // alert('Please enter a message') // or any other error handling you prefer
      return
    }
    if (step1 == "interest" && requestAuthor != currentUser){
      updateChatroomStep(chatroomId,'matched')
      updateRequestAuthor(chatroomId,"null")
      setStep1("matched")
    }
    //E2E Encryption not working
    // let password = String(mkey+userId)

    // const hash = await Crypto.digestStringAsync(
    //   Crypto.CryptoDigestAlgorithm.SHA256,
    //   userId);

    // const key = await Crypto.digestStringAsync(
    //   Crypto.CryptoDigestAlgorithm.SHA256,
    //   password);
      
    // const iv = hash.digest().slice(0, 16);

    // const encrypted = await Crypto.encryptAsync(
    //   messageBody,
    //   key.toString('base64'),
    //   iv,
    //   Crypto.AES_CBC_PKCS7_PADDING
    // );

    let payload = {
      body: trimmedMessageBody,
      username: currentUsername,
      chatroomId: chatroomId,
      senderId:currentUser,
      // chatroom:currentChatroom.$id,
      
    }
      
    let response = await databases.createDocument(
      databaseId,
      messagesCollectionId,
      ID.unique(),
      payload
    )
    // console.log("Created!",response) 

    // setMessages(prevState => [...messages,response])

    setMessageBody('')
  }
  const getMessages = async () => {
      const response = await databases.listDocuments(
        databaseId,
        messagesCollectionId,
        [ 
          Query.limit(9999), //watch out for this, maybe research more on refreshing like whatsapp
          Query.orderAsc("$createdAt"),
          Query.equal('chatroomId', chatroomId)
        ]
      )
      setMessages(response.documents)
  }
  
  //in MessagesComp
  // const deleteMessages = async (message_id) => {
  //   databases.deleteDocument(
  //     databaseId,
  //     messagesCollectionId,
  //     message_id
  //   )
  //   // setMessages(prevState => messages.filter(message => message.$id !== message_id))
  // }
  const stageChangeAlert = async (NoP) => {
    let payload = {
      body: 'This chat moved to the '+NoP+' stage',
      username: 'alerta',
      chatroomId: chatroomId,
      senderId:'alerta',
      // chatroom:currentChatroom.$id,
      
    }
      
    let response = await databases.createDocument(
      databaseId,
      messagesCollectionId,
      ID.unique(),
      payload
    )
  }

  const acceptStage = () => {
    console.log('accepted')
    if(request === "next"){
      console.log("next")
      let currentIndex = steps.indexOf(step1);
      if (currentIndex < steps.length - 1) {
        let newStep = steps[currentIndex + 1];
        stageChangeAlert(request)
        updateStepRequest(chatroomId, "noshow")
        updateRequestAuthor(chatroomId,"null")
        setTimeout(() => { updateChatroomStep(chatroomId, newStep) }, 2000);
        setStep1(newStep); // Update step1 state variable
      } else {
        console.log("you reached the top ")
      }
    } else if(request === "previous"){
      // console.log(step)
      let currentIndex = steps.indexOf(step1);
      if (currentIndex >= 0) {
        let newStep = steps[currentIndex - 1];
        stageChangeAlert(request)
        updateStepRequest(chatroomId, "noshow")
        updateRequestAuthor(chatroomId,"null")
        setTimeout(() => { updateChatroomStep(chatroomId, newStep) }, 2000);
        setStep1(newStep); // Update step1 state variable
      } else {
        console.log("You're already at the first step.");
      }
    }
  }

  const declineStage = () => {
    updateStepRequest(chatroomId,"noshow")
    setRequest("noshow")
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

    <SafeAreaView className="bg-primary  h-full">
      <View className=" pt-3  flex-shrink flex-row items-center px-3 ">
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
        onPress={() => {router.push({pathname: "/chat-info", params: {userItem:userItem}} )}}
        className="flex-grow flex-shrink ">
        <View className="flex-row flex-shrink items-center">
        <View className=" p-0.5  w-[66px] h-[66px] mr-3 rounded-xl justify-center items-center">
        <Image
        source={isGroup && !userAvatar? icons.groupB :{uri:userAvatar}}
        className={`${isGroup && !userAvatar? 'h-[50px] w-[50px]' :'w-full h-full rounded-xl'} `}
        resizeMode='cover'
        />
        </View>
        <View className="flex-col flex-shrink ">
        <Text numberOfLines={1} className="text-2xl  text-black">{userName}</Text>
        {onlineStatus ? 
          <View className=" space-x-2 items-center flex-row">
            <View className="h-[10px] w-[10px] bg-secondary rounded-full"></View>
            <Text>Online</Text>
          </View>:null}
        
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
        
        {chatroomId ? 
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
            <MenuOption onSelect={() => router.push({pathname:"/edit-group-info", params:{userItem:userItem}})} >
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
      {step1 !== "interest" ? 
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
      </View> : null }
      <ScrollView 
      ref={ref => {this.scrollView = ref}}
      onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
      className="h-full bg-white"
      > 
        <MessagesComp
        messages = {messages}
        otherId = {userId}
        userAvatar = {userAvatar}
        isGroup={isGroup}
        // currentUser={currentUser}
        />
      </ScrollView>
      {(isGroup === "false" && request !== "noshow" && currentUser !== requestAuthor && chatroomId) ?
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
      : null}
      <View className=" flex-row m-1.5">
        <View className="justify-center items-center bg-transparent flex-row flex-1 border-2 border-secondary focus:border-[#e2fcde] bg-primary h-[50px] rounded-full ">
          <TextInput
          onFocus={() => this.scrollView.scrollToEnd({animated: true})}
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

export default chat