import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import CustomButton from "../../components/CustomButton";

const NextStage = () => {
    return (
        <SafeAreaView className="bg-white h-full">
        
          <View className="flex-1 items-center mt-7 mx-3">
            <Text className="text-3xl font-semibold  text-secondary-200 text-center mt-5">
              Make Your Profile Stand Out!
            </Text>  
            <Text className="text-base text-center mt-20">
               Next, you'll need to upload your <Text className="text-green-600 font-semibold">project</Text> and <Text className="text-green-600 font-semibold">photos</Text> to <Text className="text-green-600 font-semibold">showcase</Text> your work.
            </Text>
          </View>
            
      <View className="mx-3 mb-8">
        <CustomButton
          title="Enter basic info"
          handlePress={() => router.push("/prompts")}
          containerStyles="w-full mt-14 bg-secondary-200"
          textStyles="text-center text-white"
        />
      </View>
        </SafeAreaView>
      );
    };

export default NextStage