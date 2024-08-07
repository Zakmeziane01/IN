import React from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const PickerComponent = ({ title, value, onValueChange, options, containerStyles,otherStyles}) => {
    return (
        <View className={`w-full space-y-2 ${otherStyles} ${containerStyles}`}>
        <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
        <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center ">
                <RNPickerSelect
                    onValueChange={onValueChange}
                    items={options}
                    value={value}
                    style={{
                        inputIOS: {
                            paddingVertical: 12,
                            paddingHorizontal: 10,
                            color: 'white',
                            fontSize: 17,
                            fontFamily: 'font-psemibold', // Ensure this font is available in your project
                        },
                        inputAndroid: {
                            paddingVertical: 12,
                            paddingHorizontal: 10,
                            color: 'white',
                            fontSize: 17,
                            fontFamily: 'font-psemibold', // Ensure this font is available in your project
                        },
                        placeholder: {
                            color: 'gray',
                            fontSize: 16,
                        },
                    }}
                    placeholder={{ label: "Select your option", value: null }}
                />
            </View>
        </View>
    );
};

export default PickerComponent;
