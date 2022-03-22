import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';  // Location API
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator} from 'react-native';
// import { useEffect, useState } from 'react/cjs/react.production.min';

import { Ionicons } from '@expo/vector-icons'; 

const SCREEN_WIDTH = Dimensions.get('window').width;

console.log("SCREEN_WIDTH is: ", SCREEN_WIDTH)

const icons = {
  Clouds:"cloudy",
  Rain:"rainy",
  Clear:"sunny",
  Snow:"md-snow"
}


export default function App() {
  const [city, setCity] = useState("Loading...");
  // const [location, setLocation] = useState();
  const [ok, setOk] = useState(true); 
  const [dailyWeather, setDailyWeather] = useState([]);

  const OPENWEATHER_API_KEY = "32fdfc84c4369ca37033ac3a4cf593a4";

  const getWeather = async() => {
    const permission = await Location.requestForegroundPermissionsAsync();
    // console.log("Permission is :", permission);
    if (permission.granted != true){  // 위치추적 허용 했을 때
      setOk(false);
    }
    
    // Location을 지도에서 가져온다.
    const currentPos = await Location.getCurrentPositionAsync();
    const location = {accuracy:5, longitude:currentPos.coords.longitude, latitude:currentPos.coords.latitude};
    
    const reversedGeocode = await Location.reverseGeocodeAsync(location, false);
    setCity(reversedGeocode[0].city)
    
    // weather fetch
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.latitude}&lon=${location.longitude}&exclude=alerts&appid=${OPENWEATHER_API_KEY}&units=metric`)
    const json = await response.json();
    setDailyWeather(json.daily);

    console.log(dailyWeather);

    
  } // End of function ask()

  useEffect(() => {
    getWeather();
  },[]);

  return (
    <View style={styles.container}> 
      <View style={styles.city} /* 도시 이름 View */>   
        <Text style={styles.cityName} >{city}</Text> 
      </View> 
      
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather} /* 날씨 View */ >
        {dailyWeather.length == 0 ? (
        <View style={styles.day}>
          <ActivityIndicator style={{marginTop:10}} color={'white'} size={'large'}/>
        </View>):(
          dailyWeather.map((day, index) => 
            <View style={styles.day} /* 온도 */ >
              <View style={{flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', width:'90%'}}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Ionicons name={icons[day.weather[0].main]} size={128} color="black" />
              </View>
              <Text style={styles.description} /* 날씨 설명 */>{day.weather[0].main}</Text>
            </View>
          )
        )
        }
      </ScrollView>


      <StatusBar style='light'></StatusBar>
    </View> // Container 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  city: {
    flex: 1,
    // backgroundColor:'yellow',
    justifyContent:'center',
    alignItems:'center'
  },
  cityName:{
    fontSize: 68,
    fontWeight:'500'
  },
  weather:{
    // flex: 2.5,
    // backgroundColor: 'blue'
  },
  day:{
    // flex:1,
    width:SCREEN_WIDTH,
    // alignItems:'',
    // backgroundColor:'cyan',
    // flexDirection:'row'
  },
  temp:{
    marginTop:50,
    fontWeight:'600',
    fontSize:100,
  },
  description:{
    fontSize:60,
    marginTop:-30
  },
  forecast:{
    flexDirection:'row'
  },
  
});
