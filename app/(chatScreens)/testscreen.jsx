import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'

const testScreen = () => {
  return (
    <SafeAreaView className="bg-primary items-center justify-center h-full">
      <View className="w-[85%] h-[90%] p-5 bg-primary justify-center border-secondary border-2 rounded-3xl ">
        <ScrollView>
          <CustomButton
          textStyles={"text-white"}
          title={"Let's start"}
          containerStyles={"bg-secondary"}/>
          <CustomButton
          textStyles={"text-white"}
          title={"Let's start"}
          containerStyles={"bg-secondary"}/>
          <CustomButton
          textStyles={"text-white"}
          title={"Let's start"}
          containerStyles={"bg-secondary"}/>
          <CustomButton
          textStyles={"text-white"}
          title={"Let's start"}
          containerStyles={"bg-secondary"}/>
          <CustomButton
          textStyles={"text-white"}
          title={"Let's start"}
          containerStyles={"bg-secondary"}/>
          <CustomButton
          textStyles={"text-white"}
          title={"Let's start"}
          containerStyles={"bg-secondary"}/>
          <CustomButton
          textStyles={"text-white"}
          title={"Let's start"}
          containerStyles={"bg-secondary"}/>
          <CustomButton
          textStyles={"text-white"}
          title={"Let's start"}
          containerStyles={"bg-secondary"}/>
          <CustomButton
          textStyles={"text-white"}
          title={"Let's start"}
          containerStyles={"bg-secondary"}/>
          <CustomButton
          textStyles={"text-white"}
          title={"Let's start"}
          containerStyles={"bg-secondary"}/>
          <CustomButton
          textStyles={"text-white"}
          title={"Let's start"}
          containerStyles={"bg-secondary"}/>
          <CustomButton
          textStyles={"text-white"}
          title={"Let's start"}
          containerStyles={"bg-secondary"}/>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default testScreen