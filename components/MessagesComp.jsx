import { View, Text, TouchableOpacity, Alert, Image } from 'react-native'
import React, { useMemo, useEffect, useState } from 'react'
import { databaseId, databases, getChatUserInfo, getCurrentUser, getEnk, messagesCollectionId } from '../lib/appwrite';
import useAppwrite from '../lib/useAppwrite';
import * as Crypto from 'expo-crypto';


const deleteMessages = async (message_id) => {
  databases.deleteDocument(
    databaseId,
    messagesCollectionId,
    message_id
  )
  // setMessages(prevState => messages.filter(message => message.$id !== message_id))
}

const MessagesComp = ({ messages, otherId, userAvatar, isGroup }) => {

  // const {data : mkey} = useAppwrite(getEnk);

  const {data : currentUser} = useAppwrite(getCurrentUser);
  const [senderInfos, setSenderInfos] = useState({});

  const getsenderinfo = async (senderId) => {
    // console.log(senderId)
    if(senderId!='alerta'){
    const { id, username, email, avatar } = await getChatUserInfo(String(senderId));
    return { id, username, email, avatar };}
  }

  useEffect(() => {
    const fetchSenderInfos = async () => {
      const senderInfosObj = {};
      for (const message of messages) {
        // console.log(message)
        const senderId = message.senderId;
        // console.log(senderId)
        const senderInfo = await getsenderinfo(senderId);
        
        senderInfosObj[senderId] = senderInfo;
      }
      // console.log(senderInfosObj)
      setSenderInfos(senderInfosObj);
    };
    fetchSenderInfos();
  }, [messages]);

  // E2E Encryption not working vvvvvvv
  
  // const [decryptedMessages, setDecryptedMessages] = useState({});
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const decryptMessages = async () => {
  //     const decryptedMessagesObj = {};
  //     for (const message of messages) {
  //       const encryptedBody = message.body;
  //       const decryptedBody = await decrypt(encryptedBody, message.username);
  //       decryptedMessagesObj[message.$id] = decryptedBody;
  //     }
  //     setDecryptedMessages(decryptedMessagesObj);
  //     setLoading(false); // Set loading to false when decryption is complete
  //   };
  //   decryptMessages();
  // }, [messages]);

  // const decrypt = async (encryptedBody, messageUsername) => {
  //   if(messageUsername === currentUser.username){
  //     let password = String(mkey+otherId)
      
  //     const hash = await Crypto.digestStringAsync(
  //       Crypto.CryptoDigestAlgorithm.SHA256,
  //       otherId);

  //     const key = await Crypto.digestStringAsync(
  //       Crypto.CryptoDigestAlgorithm.SHA256,
  //       password);
        
  //     const iv = hash.slice(0, 16);
      
  //     const decrypted = await Crypto.decrypt(
  //       encryptedBody,
  //       key.toString('base64'),
  //       iv,
  //       Crypto.AES_CBC_PKCS7_PADDING
  //     );
  //     const result = new TextDecoder('utf-8').decode(decrypted);
  //     return result
  //   } else {
  //       let password = String(mkey+currentUser.$id)
    
  //       const hash = await Crypto.digestStringAsync(
  //         Crypto.CryptoDigestAlgorithm.SHA256,
  //         String(currentUser.$id));

  //       const key = await Crypto.digestStringAsync(
  //         Crypto.CryptoDigestAlgorithm.SHA256,
  //         password);
          
  //       const iv = hash.slice(0, 16);
        
  //       const decrypted = await Crypto.decrypt(
  //         encryptedBody,
  //         key.toString('base64'),
  //         iv,
  //         Crypto.AES_CBC_PKCS7_PADDING
  //       );
  //       const result = new TextDecoder('utf-8').decode(decrypted);
  //       return result
  //   }
  // }
  
// if(!loading){
  
const prevDates = useMemo(() => {
    const prevDates = [];
    for (let i = 0; i < messages.length; i++) {
      if (i === 0 || new Date(messages[i].$createdAt).getDate() !== new Date(messages[i - 1].$createdAt).getDate() || new Date(messages[i].$createdAt).getMonth() !== new Date(messages[i - 1].$createdAt).getMonth() || new Date(messages[i].$createdAt).getFullYear() !== new Date(messages[i - 1].$createdAt).getFullYear()) {
        prevDates.push(true);
      } else {
        prevDates.push(false);
      }
    }
    return prevDates;
  }, [messages]);

  
  return (
    <View className="pb-5">
      {messages.map((message, index) => {
        // Check if the message should be formatted differently
        const isAlertaMessage = message.username === 'alerta' && message.senderId === 'alerta';
  
        return (
          <View key={message.$id}>
            {prevDates[index] ? (
              <View className="items-center justify-center w-auto flex-row m-1">
                <View className="bg-gray-50 rounded-lg p-0.5">
                  <Text className="text-gray-400 font-pextra light">
                    {new Date(message.$createdAt).toLocaleDateString(['en-GB'], { day: "2-digit", month: "2-digit", year: "2-digit" })}
                  </Text>
                </View>
              </View>
            ) : null}
  
            {isAlertaMessage ? (
              <View className="flex justify-center items-center bg-[#cce7c2] p-2 m-2 rounded-lg">
                <Text className="text-black font-pmedium text-center">
                  {message.body}
                </Text>
              </View>
            ) : (
              <View className={`${currentUser .username === message.username ? 'flex-row-reverse' : 'flex-row'}`}>
                <View className="m-1.5 max-w-xs">
                  <View>
                    {isGroup === "true" ? (
                      <Text className={`${currentUser .username !== message.username ? 'pl-8' : ''} text-gray`}>
                        {currentUser .username !== message.username ? message.username : "You"}
                      </Text>
                    ) : null}
                  </View>
                  <View className="flex-row">
                    {message.username !== currentUser .username ? (
                      <View className="w-[26px] h-[26px] rounded-full border border-secondary justify-center items-center mr-1 p-0.5">
                        {senderInfos[message.senderId] && (
                          <Image
                            source={{ uri: senderInfos[message.senderId].avatar }}
                            className="w-full h-full rounded-full"
                            resizeMode='cover'
                          />
                        )}
                      </View>
                    ) : null}
                    <TouchableOpacity
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.2,
                        shadowRadius: 5,
                        elevation: 7,
                      }}
                      className={`${currentUser .username === message.username ? 'bg-secondary rounded-xl rounded-br-none' : 'bg-primary rounded-xl rounded-tl-none'} 
                      mr-1 pr-1.5 min-w-[60px] w-auto`}
                      onLongPress={() => {
                        if (currentUser .username === message.username) {
                          Alert.alert(
                            'Delete Message',
                            'Are you sure you want to delete this message',
                            [
                              { text: 'Cancel', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                              { text: 'Yes', onPress: () => { deleteMessages(message.$id) } },
                            ],
                            { cancelable: true },
                          );
                        } else {
                          Alert.alert("Can't Delete", "You can't delete a message that is not your own.");
                        }
                      }}
                    >
                      <View>
                        <View className="justify-between max-w-xs">
                          <Text className={`${currentUser .username === message.username ? 'text-white' : 'text-black'} p-1.5 pb-0.5 m-1.5 mb-0 font-pregular text-sm max-w-cs`}>
                            {message.body}
                          </Text>
                          <Text className={`${currentUser .username === message.username ? 'text-gray-200' : 'text-gray-400'} text-xs max-h-[15px] mb-1.5 self-end`}>
                            {new Date(message.$createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

export default MessagesComp;