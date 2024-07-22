import { TouchableOpacity, Text } from 'react-native'
import React from "react"

const CustomButton = ({title, handlePress, containerStyles, textStyles, isLoading}) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}          // This sets the function to be called when the button is pressed.
    activeOpacity={0.7}           // This sets the opacity of the button when it is pressed to 0.7.   (Opacity is a property that defines the transparency level of an element. It ranges from 0 to 1, where: 0 means fully transparent (invisible). 1 means fully opaque (completely visible).)
    className={`bg-secondary rounded-xl min-h-[72px] flex flex-row items-center ${containerStyles} ${
      isLoading ? "opacity-50" : ""}`}        //This sets multiple classes for styling the button. It uses template literals to dynamically apply additional styles from `containerStyles` and set opacity to 50% if `isLoading` is true.
      disabled={isLoading}                    // This disables the button if `isLoading` is true, preventing user interaction.  This is useful for scenarios where you want to prevent further actions until a certain process (like loading or submitting data) is complete.
      >
    

      <Text className={`text-primary  font-psemibold text-lg ${textStyles} `}>
        {title}
      </Text>

    </TouchableOpacity>
  )
}

export default CustomButton

