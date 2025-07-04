import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TextInput, TouchableOpacity, Image } from 'react-native';
import { images, stepsBar } from "../../constants";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useUserContext } from '../../context/UserContext';       
import { updateUserAttribute } from '../../lib/appwrite';
import CustomButton from "../../components/CustomButton";

const Localization = () => {
  const { user } = useGlobalContext();                                     // Access the current user from global context
  const { updateResponse } = useUserContext();                             // Allows updating user-related state globally
  const [isSearchPressed, setIsSearchPressed] = useState(false);
  
  const [location, setLocation] = useState(null);                          // Stores the user's geolocation (latitude & longitude)

  const [errorMsg, setErrorMsg] = useState(null);                         // Stores any location-related error messages
  /**
   * Manages the state and functionality related to location search and submission.
   * Uses useState to manage search input, postcode input, and submission status.
   * Utilizes useEffect to fetch the current location when the component mounts.
   * Defines functions to get the current location, handle search based on input,
   * save location data, and handle submission of location data.
   * @returns None
   */
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

  const getCurrentLocation = async () => {                              //keep the function to make sure why i mentioned it. 
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setErrorMsg(null);

      // Reverse geocode to get city name
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
      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      const city = reverseGeocode[0]?.city || 'Unknown';

      // Store city in the user attributes
      await updateUserAttribute(user.userId, 'city', city);
      updateResponse('city', city);                                   

    } catch (error) {
      Alert.alert('Error', error.message);
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
      router.replace('/genderCollaborator');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-secondary h-full">

      <View className="items-center justify-center">
        <Image source={images.Wlogo}
          resizeMode='contain'  className="my-0 w-[150px] h-[100px]"/>
      </View>

      <View className="flexGrow-1">
        <ScrollView className="h-full bg-white rounded-[35px]">
          <Image source={stepsBar.Step3}
            resizeMode='contain' className="w-[365px] h-[50px] mt-7 mb-2 self-center"/>

          <View>
            <Text className="text-2xl text-secondary text-semibold font-pmedium mx-3.5  mt-2 px-3">Can we get your location?</Text>
          </View>
          <Text className="text-sm mb-6 mx-3.5  mt-2 justify-center px-3">
              We need it so we can show you all the great people nearby (or far away).
          </Text>

          <View className="flex-row gap-2 mt-3.5 px-3">
            <TextInput
              placeholder='Search'
              value={search}
              onChangeText={setSearch}
              className="border border-gray-300 p-2 rounded-full flex-1"
            />
            <TextInput
              placeholder='Postcode'
              value={postcode}
              onChangeText={setPostcode}
              className="border border-gray-300 p-2 rounded-full flex-1"
            />
          </View>

          <View className="flex-row  mt-3 px-3">
            <TouchableOpacity 
              onPress={() => {
                handleSearch();
                setIsSearchPressed(true);
                setTimeout(() => {
                setIsSearchPressed(false);
                }, 200); // reset the state after 200ms
              }}
              className={`border-2 border-secondary-200 p-3 rounded-full flex-1 mt-2.5 ${isSearchPressed ? 'bg-secondary-200' : 'bg-white'}`}
            >
              <Text className={`text-center ${isSearchPressed ? 'text-white' : 'text-black'}`}>Search Location</Text>
            </TouchableOpacity>
          </View>
            
          {errorMsg && (
            <Text className="text-red-500 text-center mb-4 mt-3">{`${errorMsg}`}</Text>
          )}

          {location ? (
            <View className="rounded-full overflow-hidden mt-3.5 px-3">
              <MapView 
                className="w-full h-[200px]"
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
            </View>
          ) : (
            <View className="w-full h-[200px]  rounded-full overflow-hidden mt-3.5 px-3 justify-center items-center">
              <Text className="text-center text-secondary-200">Getting Your Current Location...</Text>
            </View>
          )}
     
          <View className="w-full justify-center min-h-[14vh] px-3 flex-1 sticky">
            <CustomButton 
              title="Next"
              handlePress={handlePress}
              containerStyles="bg-secondary-200"
              textStyles="text-center text-white"
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </View>

    </SafeAreaView>
  );
};

export default Localization;
