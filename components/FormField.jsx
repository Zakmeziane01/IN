import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import {icons} from '../constants'

const FormField = ({title, value, placeholder, handleChangeText, otherStyles,otherStyles2,containerStyles,multiline = false, numberOfLines = 1,...props}) => {
    const [showPassword, setshowPassword] = useState(false)
  return (
    <View className ={`space-y-2 mx-3  ${otherStyles}`}>
   <Text className={`text-base text-secondary font-light  ${otherStyles2}`}>{title}</Text>


      <View className={`border-2 border-gray-200 w-full p-5 h-16 ${containerStyles} px-2 
      bg-primary rounded-xl focus:border-secondary items-center flex-row ${containerStyles}`}>


        <TextInput
            className="flex-1 text-[#7b7b8b] font-pregular text-base"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            secureTextEntry={placeholder==='Password'&& !showPassword}
            multiline={multiline}
            numberOfLines={numberOfLines}
            

        />
        {placeholder==='Password'&&(
            <TouchableOpacity onPress={() =>setshowPassword(!showPassword)}>
                <Image source={!showPassword ? icons.eye : icons.eyeHide} className="w-3 h-4 mr-3 " resizeMode='contain'/>
            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField