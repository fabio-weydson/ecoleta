import React, { useState, useEffect, ChangeEvent }  from 'react';
import { StyleSheet, View, ImageBackground, Image, Text, Button, Picker, KeyboardAvoidingView, Alert} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import logo from '../../assets/logo.png';
import homebg from '../../assets/home-background.png';
import { Platform } from '@unimodules/core';
import estadosCidades from './estados-cidades.json';


interface UF {
  sigla: string; 
  nome: string;
}

interface IBGECityResponse {
  id: number;
  nome: string;
}



const Home = () => {

    const [ufs, setUfs] = useState<UF[]>([]);
    const [citties, setCities] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');


    const HandleSelectedUf =(sigla:string,id:number) =>{
      setSelectedUf(sigla)
      id = id-1;
      setCities(estadosCidades.estados[id].cidades)
    } 
    // useEffect(() => {
    //     if(selectedUf==='0') {
    //         return;
    //     }
    //     axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos`).then(res => {
         
    //     const cityNames = res.data.map(city=>{
    //             return {
    //                 id:city.id,
    //                 nome: city.nome
    //             }
    //         })
    //       setCities(cityNames)
    //     }).catch(function (error) {
    //       alert(error);
    //   });
    // })


    const navigation = useNavigation();


  const handleNavigationPoints = () => {
      navigation.navigate('Points', {uf:selectedUf,city:selectedCity})
  }

  
  return (
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}>
          <ImageBackground source={homebg} imageStyle={{width:274,height:368}} style={styles.container}>
              <View style={styles.main}>
                  <Image source={logo}/>
                  <Text style={styles.title}>Seu marketplace
                  de coleta de
                  resíduos.</Text>
                  <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
              </View>
              <View style={styles.selectView}>
                <Picker 
                selectedValue={selectedUf}
                onValueChange={(itemValue, itemIndex) => HandleSelectedUf(itemValue,itemIndex)}
                >
                  <Picker.Item label="Selecione um estado" />
                    {estadosCidades.estados.map(uf=> (
                      <Picker.Item key={0+1} label={uf.nome} value={uf.sigla} />
                    ))}
                </Picker>
              </View>
              <View style={styles.selectView}>
                <Picker style={styles.select}
                 selectedValue={selectedCity}
                 onValueChange={(itemValue, itemIndex) => setSelectedCity(itemValue)}
               >
                <Picker.Item label="Selecione uma cidade" />
                  {citties.map(city=> (
                    <Picker.Item key={city} label={city} value={city} />
                  ))}
                </Picker>
              </View>
          
              <View style={styles.footer}>
                  <RectButton style={styles.button} onPress={()=>handleNavigationPoints()}>
                  <View style={styles.buttonIcon}><Text> <Icon name="chevron-right" size={24}  color="#FFFFFF"></Icon> </Text></View>
                      <Text style={styles.buttonText}>ENTRAR</Text>
                  </RectButton>
              </View>
          </ImageBackground>
        </KeyboardAvoidingView>
    )
}


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      //fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      //fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},

    selectView: {
      borderRadius: 10, 
      overflow: 'hidden', 
      backgroundColor:'#e5e5e5', 
      marginBottom:10,
    },
  
    select: {
      height:60,
      paddingHorizontal:25,
      paddingVertical:15

    },
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      //fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;