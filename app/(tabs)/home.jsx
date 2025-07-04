import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { icons, images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import CustomButton from '../../components/CustomButton';
import { useGlobalContext } from '../../context/GlobalProvider';
import { updateRejectedUsers, getAllUsers } from "../../lib/appwrite";
import DatesCard from "../../components/DatesCard";
import DatesCardGroup from "../../components/DatesCardGroup";

const Home = () => {
  const { user: currentUser, isLogged, loading } = useGlobalContext();

  const [users, setUsers] = useState([]); // Array to store all available users
  const [rejectedUsers, setRejectedUsers] = useState(new Set()); // Set to track rejected user IDs
  const [likedUsers, setLikedUsers] = useState(new Set()); // Set to track liked user IDs
  const [currentIndex, setCurrentIndex] = useState(0);
  const [websocket, setWebSocket] = useState(null);
  const [showRejectOverlay, setShowRejectOverlay] = useState(false); // Show rejection overlay
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  // Move to the next user
  const goToNextUser = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % users.length);
  };

  // Handle rejection
  const handleRejectPress = async () => {
    const rejectedUser = users[currentIndex];
    if (rejectedUser) {
      setRejectedUsers(prev => new Set([...prev, rejectedUser.userId])); // Add to rejected list

      // Show rejection overlay for 1 second
      setShowRejectOverlay(true);
      setTimeout(() => {
        setShowRejectOverlay(false);
        goToNextUser(); // Move to the next user after 1 second
      }, 1000);

      try {
        if (currentUser) {
          await updateRejectedUsers(currentUser.userId, rejectedUser.userId); // Update rejection in Appwrite
        }
      } catch (error) {
        console.error("Error updating rejected users:", error);
      }
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      const filteredUsers = response.filter(
        user => !rejectedUsers.has(user.userId) && !likedUsers.has(user.userId)
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();

    // WebSocket connection
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      console.log('WebSocket connected');
      setWebSocket(ws);
    };
    ws.onmessage = (event) => {
      console.log('Message from server:', event.data);
    };
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWebSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [rejectedUsers, likedUsers]);

  if (loading) {
    return (
      <SafeAreaView className="bg-secondary h-full justify-center items-center">
        <Text className="text-white text-lg">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!isLogged || !currentUser) {
    return (
      <SafeAreaView className="bg-secondary h-full justify-center items-center">
        <Text className="text-white text-lg">User not authenticated</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-secondary h-full">
      <ScrollView
        className="bg-gray-300"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="mt-10">
          <DatesCardGroup />
        </View>

        <View className="flex-1 justify-center mx-3.5">
          {users[currentIndex] && (
            <DatesCard
              item={users[currentIndex]}
              handleClick={() => console.log('Card clicked')}
            />
          )}
        </View>

        <View className="my-6 px-4 space-y-6">
          <CustomButton
            title="Message"
            handlePress={() => {
              router.push({
                pathname: "/first-chat",
                params: {
                  userId: '66ba5a7a0010c3555dd2',
                  userName: 'David',
                  currentUser: currentUser.$id,
                  currentUsername: currentUser.username,
                  isGroup: false,
                },
              });
            }}
            containerStyles="bg-secondary mx-4 my-5"
            textStyles="text-white"
            shadow={true}
          />
        </View>
      </ScrollView>



      {showRejectOverlay && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
            opacity: 1,
            transition: "opacity 1s ease-out",
          }}
        >
          <Text style={{ fontSize: 100, color: "#5bb450" }}>X</Text>
        </View>
      )}

      <View
        className="flex-row justify-between px-3.5 bg-white"
        style={{ height: 80, marginBottom: -40 }}
      >
        <View className="my-2.5 shadow-sm">
          <Pressable
            className="bg-[#1E2A30] rounded-xl flex-row items-center justify-center"
            onPress={handleRejectPress}
            style={{
              height: 55,
              width: 84,
            }}
          >
            <Image source={icons.rejection} className="w-3 h-3" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
