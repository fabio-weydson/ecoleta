import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { AppLoading } from 'expo';
import Constants from 'expo-constants';

//import { Roboto_400Regular, Roboto_500Medium, useFonts } from '@expo-google-fonts/roboto';

import Home from './src/pages/Home'
import Route from './src/routes';


export default function App() {
  //const [fontsLoaded] = useFonts({
   // Roboto_400Regular,Roboto_500Medium
  //}) 
  //if(!fontsLoaded) {
   // <AppLoading/>
 // }
  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
   <Route/>
   </>
  );
}