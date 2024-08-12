import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import { fetchUserConversations, getUserAttributes } from "../../lib/appwrite";
import { useRouter } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";


const ConversationsListScreen = () => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState({}); // Store user names here

  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;

      try {
        const userConversations = await fetchUserConversations(user.userId);
        if (Array.isArray(userConversations)) {
          setConversations(userConversations);

          // Fetch user names for each conversation
          const userIds = new Set();
          userConversations.forEach(convo => {
            const otherUserId = convo.user1Id === user.userId ? convo.user2Id : convo.user1Id;
            if (!userNames[otherUserId]) userIds.add(otherUserId); // Collect only unknown user IDs
          });

          // Fetch user details for each user ID
          const fetchUserNames = async () => {
            const names = {};
            for (const userId of userIds) {
              try {
                const userData = await getUserAttributes(userId);
                names[userId] = `${userData.firstName} ${userData.lastName}`;
              } catch (error) {
                console.error(`Error fetching user attributes for ${userId}:`, error);
              }
            }
            setUserNames(prevNames => ({ ...prevNames, ...names }));
          };

          await fetchUserNames();
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error("Error fetching user conversations:", error);
        Alert.alert("Error", "Failed to load conversations.");
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user]);

  const handleConversationPress = (chatRoomId) => {
    router.push(`/chatDetailsScreen?chatRoomId=${chatRoomId}`);
  };

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 bg-white`}>
        <View className={`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#00b894" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 bg-white`}>
      <View className={`flex-1 mb-3`}>
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => {
            const otherUserId = item.user1Id === user.userId ? item.user2Id : item.user1Id;
            const conversationTitle = userNames[otherUserId] || `Conversation with ${otherUserId}`;

            return (
              <TouchableOpacity
                className={` mb-7 bg-green-100 border border-green-200 rounded-lg`}
                onPress={() => handleConversationPress(item.chatRoomId)}
              >
                <Text className={`text-green-800 text-2xl`}>{conversationTitle}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ConversationsListScreen;
