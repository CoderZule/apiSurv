import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { IntroStack } from './IntroStack';
 



export default function RootNavigator() {

 
    return (
        <NavigationContainer>
            <IntroStack />  
        </NavigationContainer>
    )
}