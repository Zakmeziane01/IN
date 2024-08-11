import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useUserContext } from '../../context/UserContext'; // Import useUserContext
import { updateUserAttribute } from '../../lib/appwrite';
import IconButton from '../../components/IconButton';

const Localization = () => {
  const { user } = useGlobalContext();
  const { updateResponse } = useUserContext(); // Access updateResponse from user context

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

        await saveLocation(latitude, longitude, search.trim());
      } else {
        setErrorMsg('Location not found.');
      }
    } catch (error) {
      setErrorMsg('Error occurred while searching for the location.');
    }
  };

  const saveLocation = async (latitude, longitude, cityOrPostcode = '') => {
    try {
      // Ensure latitude and longitude are converted to strings if needed
      await updateUserAttribute(user.userId, 'latitude', String(latitude));
      await updateUserAttribute(user.userId, 'longitude', String(longitude));
      if (cityOrPostcode) {
        await updateUserAttribute(user.userId, 'cityOrPostcode', cityOrPostcode);
        updateResponse('cityOrPostcode', cityOrPostcode); // Update context
      }
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
      router.replace('/allowNotification');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          flexGrow: 1, // Ensures ScrollView expands to fill available space
        }}
      >
        <View className="flex-1 justify-center px-4">
          <Text className="text-2xl font-semibold text-black mb-4">
            Can we get your location?
          </Text>
          <Text className="text-lg text-gray-700 mb-6">
            We need it so we can show you all the great people nearby (or far away).
          </Text>

          <View className="flex-row gap-2 mb-3">
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

          <View className="flex-row justify-around mb-7">
            <TouchableOpacity
              onPress={getCurrentLocation}
              className="border border-gray-300 p-3 rounded-full flex-1 mr-2 bg-gray-200"
            >
              <Text className="text-center text-black">Get my current Location</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSearch}
              className="border border-gray-300 p-3 rounded-full flex-1 ml-2 bg-gray-200"
            >
              <Text className="text-center text-black">Search Location</Text>
            </TouchableOpacity>
          </View>

          
          {errorMsg && (
            <Text className="text-red-500 text-center mb-4">{`Error: ${errorMsg}`}</Text>
          )}

          {location ? (
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

        </View>
      </ScrollView>

      <View className="px-4 py-2">
        <IconButton
          handlePress={handlePress}
          containerStyles="bg-black"
          iconStyles="text-white"
          isLoading={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
};

export default Localization;
