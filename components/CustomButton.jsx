import {TouchableOpacity, Text, Image} from 'react-native'
import React from 'react'


const CustomButton = ({title, handlePress, containerStyles, textStyles, isLoading, logo, logostyles,name}) => {
  return (
    <TouchableOpacity 
    style={[
     {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0,
        shadowRadius: 10,
        elevation: 10,
      },
    ]}
    onPress={handlePress}
    activeOpacity={0.7}
    className={`bg-white rounded-xl min-h-[62px] flex-row justify-center items-center mt-7 ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
    disabled={isLoading}
    name={name}
    >
      <Image
        className={`${logostyles} absolute left-3 w-[40px] h-[40px]`}
        source={logo}
        />
      <Text className={`text-secondary-200 font-psemibold text-lg mx-5 ${textStyles}`}>
        {title}
        </Text>
    </TouchableOpacity>
  )
}

export default CustomButton