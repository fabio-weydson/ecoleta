import React , {useState,useEffect} from 'react';
import { StyleSheet, View, ImageBackground, Image, Text, Button, ScrollView,SafeAreaView, Alert } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import Constants from 'expo-constants';
import { SvgUri } from 'react-native-svg';
import * as Location  from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';

import api from '../../services/api';

interface Item {
  id:number,
  title:string,
  image_url:string
}

interface Point {
  id:number,
  name:string,
  latitude:number,
  longitude:number,
  image_url:string
}

interface Params {
  uf: string,
  city:string
}





const Points = () => {

  const route = useRoute();

  const routeParams = route.params as Params;

  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number,number]>([0,0])
  const [points, setPoints] = useState<Point[]>([]);


  const navigation = useNavigation();

  useEffect(()=>{
    async function loadPosition(){
      const { status } = await Location.requestPermissionsAsync();
      if(status !== 'granted') {
        Alert.alert('Ops...', 'Precisamos de saber sua localizacao.')
        return;
      } 
      const location = await Location.getCurrentPositionAsync();
      const { latitude,longitude } = location.coords;
      setInitialPosition([latitude,longitude]);
    }
    loadPosition()
  },[])



  useEffect(()=>{
    api.get('items').then(res => {
        setItems(res.data)
    })
  },[])

  useEffect(()=>{
    api.get('points', {
      
      params: {
        city: routeParams.city,
        uf: routeParams.uf,
        items: selectedItems
      }
    }).then(res => {
        setPoints(res.data)
    })
  },[selectedItems])

  const handleNavigationBack = () => {
      navigation.navigate('Home')
  }
  

  const handleNavigationDetail = (id:Number) => {
    navigation.navigate("Detail", {point_id:id});
  }


  function handleSelectedItems(id: number) {
   

    const ExistingItem = selectedItems.findIndex(item => item === id);
    if (ExistingItem >= 0) {
        const FilteredItems = selectedItems.filter(item => item !==id)
        setSelectedItems(FilteredItems)
    } else {
        setSelectedItems([...selectedItems,id])
    }
}


  return (
 

      <SafeAreaView style={{flex:1}}>
        <View style={styles.container} >
                <TouchableOpacity onPress={handleNavigationBack}>
                <Icon name="chevron-left" color="#34CB79" size={30}></Icon>
                </TouchableOpacity>
                <Text style={styles.title}>Bem-vindo(a)</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta</Text>
                <View style={styles.mapContainer}>
                    { initialPosition[0] !==0 && (
                      <MapView initialRegion={{
                        latitude:initialPosition[0],
                        longitude: initialPosition[1],
                        latitudeDelta: 0.014,
                        longitudeDelta:0.014
                    }} 
                    loadingEnabled={initialPosition[0]===0}
                    style={styles.map}>
                      { points.map(point=>(
                  
                        (<Marker key={String(point.id)} onPress={()=>handleNavigationDetail(point.id)}  coordinate= {{
                          latitude:point.latitude,
                          longitude: point.longitude
                      }} style={styles.mapMarker}>
                        <View style={styles.mapMarkerContainer}>
                          <Image source={{uri:`https://ecoleta-srv.herokuapp.com/uploads/${point.image}`}} style={styles.mapMarkerImage}></Image>
                          <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                        </View>
                      </Marker>)
                      ))}
                    
                    </MapView>
                    )}
                </View>
                
                    <View style={styles.itemsContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 20}}>
                        
                        { items.map(item=> (
                          <TouchableOpacity activeOpacity={0.6} key={String(item.id)} 
                          style={[styles.item, 
                            selectedItems.includes(item.id)?styles.selectedItem:{}]} 
                          onPress={() => handleSelectedItems(item.id)}>
                          <SvgUri width={42} height={42} uri={item.image_url}></SvgUri>
                          <Text style={styles.itemTitle}>{item.title}</Text>
                          </TouchableOpacity>
                        ))}
                       
                        </ScrollView>
                    </View>
            
        </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight
    },
  
    title: {
      fontSize: 20,
      ////fontFamily: 'Roboto_500Medium',,
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      ////fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      ////fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
      marginLeft:-32,
      marginRight:-32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      ////fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });

  export default Points;