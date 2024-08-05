import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TextInput, Button, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from "expo-router";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useGlobalContext } from "../../context/GlobalProvider";
import { UserAddressInfo } from '../../lib/appwrite'; // Ensure this path is correct
import CustomButton from "../../components/CustomButton";

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

  const handleSubmit = async () => {
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
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex justify-center h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Localization
          </Text>

          <View className="flex-row justify-between items-center mb-4 mt-10">
            <Image 
              source={require('./../../assets/images/location.png')}
              className="w-8 h-8"
            />
            <TextInput 
              placeholder='Search'
              value={search}
              onChangeText={setSearch}
              className="border border-purple-500 p-2 rounded-full pl-4 w-1/3 mx-2"
            />
            <TextInput 
              placeholder='Postcode'
              value={postcode}
              onChangeText={setPostcode}
              className="border border-purple-500 p-2 rounded-full pl-4 w-1/3 mx-2"
            />
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

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 }}>
            <Button
              title="Get my current Location"
              onPress={getCurrentLocation}
              color="#6200ee"
            />
            <Button
              title="Search Location"
              onPress={handleSearch}
              color="#6200ee"
            />
          </View>
        </View>

          <CustomButton
            title="Submit"
            handlePress={handleSubmit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Link
              href="/allowNotification"
              className="text-lg font-psemibold text-secondary"
            >
              Skip
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Localization;
