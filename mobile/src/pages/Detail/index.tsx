import React , {useEffect, useState} from 'react';
import { StyleSheet, View, ImageBackground, Image, Text, Button, SafeAreaView, Linking} from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../services/api';
import { showLocation,Popup } from 'react-native-map-link'

import * as MailComposer from 'expo-mail-composer';

interface Params {
  point_id: Number;
}

interface Point {
  point: { 
    id: Number,
    image: string,
    name: string,
    email: string,
    whatsapp: string,
    latitude: string,
    longitude: string,
    address: string,
    number: Number,
    city: string,
    uf: string
  };
  items: {
    title: string
  }[];
}

const Detail = () => {
  const route = useRoute();

  const routeParams = route.params as Params;

  const navigation = useNavigation();

  const handleNavigationBack = () => {
    navigation.goBack()
  }

  

  const [pointData,setPointData] = useState<Point>({} as Point);

  useEffect(()=>{
    async function loadPoint(id: Number){
      await api.get(`http://192.168.0.105:3333/points/${id}`).then(res => {
        setPointData(res.data)
      
      }) .catch(error => console.log(error));
    }
    loadPoint(routeParams.point_id);
  },[])

  if(!pointData.point){
    //loading
    return null;
  }
  function handleWhatsapp(numero: string){
  
    Linking.openURL(`whatsapp://send?phone=${numero}&text="Olá, tenho interesse sobre coleta de resíduos...`)
  }
  function handleDirections(latitude: string,longitude: string){
    return showLocation({
      latitude: latitude,
      longitude: longitude,
      //sourceLatitude: ,  // optionally specify starting location for directions
      //sourceLongitude: ,  // not optional if sourceLatitude is specified
      googleForceLatLon: true,  // optionally force GoogleMaps to use the latlon for the query instead of the title
      googlePlaceId: '',  // optionally specify the google-place-id
      alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
      dialogTitle: 'Navegar até o local', // optional (default: 'Open in Maps')
      dialogMessage: 'Escolha seu aplicativo preferido de navegação', // optional (default: 'What app would you like to use?')
      cancelText: 'Cancelar', // optional (default: 'Cancel')
      appsWhiteList: ['google-maps','waze','uber'] // optionally you can set which apps to show (default: will show all supported apps installed on device)
      // appTitles: { 'google-maps': 'My custom Google Maps title' } // optionally you can override default app titles
      // app: 'uber'  // optionally specify specific app to use
  })
  }
  

  return (
      <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
           <TouchableOpacity onPress={handleNavigationBack}>
              <Icon name="chevron-left" color="#34CB79" size={30}></Icon>
            </TouchableOpacity>
            <Image source={{uri:`http://192.168.0.105:3333/uploads/${pointData.point.image}`}} style={styles.pointImage}></Image>
            <Text style={styles.pointName}>{pointData.point.name}</Text> 
            <Text style={styles.pointItems}><FontAwesome name="recycle" color="#34CB79" size={14}></FontAwesome> {pointData.items.map(item=> item.title).join(', ')}</Text> 
            <View style={styles.address}>
              <Text style={styles.addressTitle}><FontAwesome name="map-marker" color="#34CB79" size={14}></FontAwesome> {pointData.point.address}, {pointData.point.number}</Text>
              <Text style={styles.addressContent}>{pointData.point.city} - {pointData.point.uf}</Text>
            </View>
        </View>
        <View style={styles.footer}>
          <RectButton style={styles.button} onPress={()=>handleWhatsapp(pointData.point.whatsapp)}>
              <FontAwesome name="whatsapp" size={24} color='#FFF'></FontAwesome>
              <Text style={styles.buttonText}>Whatsapp</Text>
          </RectButton>
         
          <RectButton style={styles.button} onPress={()=>handleDirections(pointData.point.latitude,pointData.point.longitude)}>
              <FontAwesome name="location-arrow" size={24} color='#FFF'></FontAwesome>
              <Text style={styles.buttonText}>Navegar</Text>
          </RectButton>
        </View>
        
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      paddingTop: 20 + Constants.statusBarHeight
    },
  
    pointImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
      borderRadius: 10,
      marginTop: 32,
    },
  
    pointName: {
      color: '#322153',
      fontSize: 28,
      ////fontFamily: 'Roboto_500Medium',,
      marginTop: 24,
    },
  
    pointItems: {
      ////fontFamily: 'Roboto_400Regular',
      fontSize: 16,
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    address: {
      marginTop: 32,
    },
    
    addressTitle: {
      color: '#322153',
      ////fontFamily: 'Roboto_500Medium',,
      fontSize: 16,
    },
  
    addressContent: {
      ////fontFamily: 'Roboto_400Regular',
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: '#999',
      paddingVertical: 20,
      paddingHorizontal: 32,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    
    button: {
      width: '48%',
      backgroundColor: '#34CB79',
      borderRadius: 10,
      height: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      marginLeft: 8,
      color: '#FFF',
      fontSize: 18,
      ////fontFamily: 'Roboto_500Medium',,
    },
  });


export default Detail;
