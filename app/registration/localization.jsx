import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TextInput,Image,TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useGlobalContext } from "../../context/GlobalProvider";
import { UserAddressInfo } from '../../lib/appwrite'; // Ensure this path is correct
import IconButton from '../../components/IconButton'; 

const Localization = () => {
  const { user } = useGlobalContext();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [search, setSearch] = useState('');
  const [postcode, setPostcode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (error) {
        setErrorMsg('Error getting current location');
      }
    };

    getLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setErrorMsg(null);

      await saveLocation(currentLocation.coords.latitude, currentLocation.coords.longitude);
    } catch (error) {
      setErrorMsg('Error getting current location');
    } 
  };

  const handleSearch = async () => {
    if (!search.trim() && !postcode.trim()) {
      setErrorMsg('Please enter a valid location or postcode.');
      return;
    }
    try {
      const searchString = `${search.trim()} ${postcode.trim()}`;
      const geocode = await Location.geocodeAsync(searchString);

      if (geocode.length > 0) {
        const { latitude, longitude } = geocode[0];
        const location = { coords: { latitude, longitude } };
        setLocation(location);
        setErrorMsg(null);

        await saveLocation(latitude, longitude);
      } else {
        setErrorMsg('Location not found.');
      }
    } catch (error) {
      setErrorMsg('Error occurred while searching for the location.');
    }
  };

  const saveLocation = async (latitude, longitude) => {
    try {
      await UserAddressInfo(user.$id, latitude, longitude);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handlePress = async () => {
    if (!location) {
      setErrorMsg('No location to submit.');
      return;
    }

    setIsSubmitting(true);

    try {
      await saveLocation(location.coords.latitude, location.coords.longitude);
      router.replace("/registration/careerPath"); 
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full flex justify-center h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-black mt-10 font-psemibold">
            Can we get your location?
          </Text>
          <Text className="text-1xl font-semibold text-black mt-10 font-psemibold">
            We need it so we can show you all the great people nearby, (or far away).
          </Text>

      <View className="flex-row justify-between items-center mb-4 mt-10">
          <Image 
           source={require('./../../assets/images/location.png')}
           className="w-8 h-8"
           />
        <View className="flex-row items-center space-x-3">
          <TextInput 
          placeholder='Search'
          value={search}
          onChangeText={setSearch}
         className="border border-black p-2 rounded-full text-center flex-1"
        />
        <TextInput 
        placeholder='Postcode'
        value={postcode}
        onChangeText={setPostcode}
        className="border border-black p-2 rounded-full text-center flex-1"
        />
      </View>
    </View>

        <View className="flex-1">
            {errorMsg ? (
              <Text className="text-red-500 text-center mb-4">Error: {errorMsg}</Text>
            ) : location ? (
              <MapView
                style={{ width: '100%', height: 300, marginBottom: 20 }}
                region={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  title="Your Location"
                />
              </MapView>
            ) : (
              <Text className="text-center">Getting Location...</Text>
            )}


          <View className="flex-row justify-around mt-4">
              <TouchableOpacity
                onPress={getCurrentLocation}
                className="border border-black p-2 rounded-full flex-1"
              >
                <Text className="text-center text-black">Get my current Location</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSearch}
                className="border border-black p-2 rounded-full flex-1"
              >
                <Text className="text-center text-black">Search Location</Text>
              </TouchableOpacity>
          </View>
        </View>

        <View className="absolute bottom-6 right-7">
        <IconButton
          handlePress={handlePress}
          containerStyles=""
          iconStyles="text-white"
          isLoading={isSubmitting}
        />
      </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Localization;
