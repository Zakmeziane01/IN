import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button,TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { databases, config, ID, Query,client} from '../../lib/appwrite/'; // Ensure correct path
import { useGlobalContext } from '../../context/GlobalProvider';

const ChatPart = () => {

  const { user } = useGlobalContext();
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const [longPressedMessage, setLongPressedMessage] = useState(null);
  

  useEffect(() => {
    getMessages()

    const unsubscribe = client.subscribe('databases.${config.databaseId}.collections.${config.messagesCollectionId}.documents', response => {   
      // Callback will be executed on changes for documents A and all files.
      console.log("REAL TIME:",response);

      if(response.events.includes("databases.*.collections.*.documents.*.create")){
        console.log('A MESSAGE WAS CREATED')
        setMessages(prevState => [response.payload, ...prevState])   //any time the message is created on handleSubmit before what we would do is would get the response and it would update the messages state. 
    }

    if(response.events.includes("databases.*.collections.*.documents.*.delete")){
        console.log('A MESSAGE WAS DELETED!!!')
        setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id))
    }
});

    console.log('unsubscribe:', unsubscribe)
    
    return () => {
  unsubscribe();   // by using the unsubscribe function should give us only one subscribtions to that event
};
}, []);


  const handleSubmit = async () => {
    let payload = {
      user_id:user.$id,
      username:user.name,
      body: messageBody,
    };

    try {
      let response = await databases.createDocument(
        config.databaseId,
        config.messagesCollectionId,
        ID.unique(),
        payload
      );

      console.log("Created!", response);
      setMessageBody("");

      // Prepend the new message to the messages list
      setMessages([response, ...messages]);
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  const getMessages = async () => {
    try {
      const response = await databases.listDocuments(
        config.databaseId, 
        config.messagesCollectionId,
        [
          Query.orderDesc("$createdAt"),
          Query.limit(2)
        ]
      );
      console.log('RESPONSE', response);
      setMessages(response.documents);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const deleteMessage = async (message_id) =>  {
    try {
      await databases.deleteDocument(        
        config.databaseId, 
        config.messagesCollectionId, 
        message_id
      );
      setMessages(prevState => prevState.filter(message => message.$id !== message_id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleLongPress = (message) => {
    setLongPressedMessage(message);
  };

  const handleDeleteConfirmation = async () => {
    if (longPressedMessage) {
      await deleteMessage(longPressedMessage.$id);
      setLongPressedMessage(null);
    }
  };

  const handleCancelConfirmation = () => {
    setLongPressedMessage(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 16 }}>
        <View style={{ marginBottom: 16 }}>
          <TextInput
            required
            maxLength={1000}
            placeholder='Say something...'
            onChangeText={(text) => setMessageBody(text)}
            value={messageBody}
            style={{ padding: 8, backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, borderRadius: 4, marginBottom: 8 }}
          />
          <Button
            title="Submit"
            onPress={handleSubmit}
            color="#6200ee"
          />
        </View>
        {messages.map((message) => (
          <TouchableOpacity
            key={message.$id}
            onLongPress={() => handleLongPress(message)}
            style={{ marginBottom: 16, padding: 16, backgroundColor: '#e0e0e0', borderRadius: 8 }}
          >
            <Text style={{ marginBottom: 8, color: '#757575' }}>{new Date(message.$createdAt).toLocaleString()}</Text>
            <Text>{message.body}</Text>
          </TouchableOpacity>
        ))}

        {longPressedMessage && (
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'
          }}>
            
            <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 8 }}>
              <Text style={{ fontSize: 18, marginBottom: 16 }}>Are you sure you want to delete this message?</Text>
              <Button
                title="Delete"
                onPress={handleDeleteConfirmation}
                color="#d32f2f"
              />
              <Button
                title="Cancel"
                onPress={handleCancelConfirmation}
                color="#6200ee"
                style={{ marginTop: 8 }}
              />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatPart;