import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import CustomButton from '../../components/CustomButton'; 
import { router } from 'expo-router';

const AllDone = () => {
  // Function to handle the press event of the "Start" button
  const handleAcceptPress = () => {
    console.log("Accept button pressed");
    router.push("/home"); // Navigate to the home screen
  };

  return (
    <SafeAreaView className="bg-white h-full"> {/* Safe area to prevent overlap with the device's notch */}
      <ScrollView
        contentContainerStyle={{
          height: "100%", // Ensure the ScrollView takes up full height
          marginHorizontal: 20, // Add horizontal margin
          paddingTop: 120, // Padding from the top for the title
          paddingBottom: 20 // Padding from the bottom for the button
        }}
      >
        <Text className="text-secondary-200 text-3xl font-bold mb-4">
          All Done! {/* Title text */}
        </Text>
        <Text className="text-black mb-4">
          Ready to succeed with the perfect collaborator {/* Subtext */}
        </Text>
      </ScrollView>
      
      {/* Button to navigate to the next screen (Home) */}
      <View className="w-full justify-center  px-3 flex-1 mb-20">
        <CustomButton 
          className="w-full justify-center  px-3 flex-1"
          title="Start" // Text on the button
          handlePress={handleAcceptPress} // Function that runs on button press
          containerStyles="bg-secondary-200" // Style for button container
          textStyles="text-center text-white" // Style for text inside button
          isLoading={false} // Indicates if the button should display a loading state
        />
      </View>
    </SafeAreaView>
  );
};

export default AllDone;   // Exporting the component for use in other parts of the app
