import * as React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    Tmon: require('./assets/fonts/TmonMonsori.ttf.ttf'),
  });
  const [ranks, setRanks] = useState([]);
  const parseString = require('react-native-xml2js').parseString;
  const date = new Date();
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  const randomIntGenerate = (min, max) => {
    return Math.trunc(Math.random() * (max - min) + 1) + min;
  };
  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    return `#${randomColor}`;
  };
  const shuffle = (object) => {
    object.sort(() => Math.random() - 0.5);
    return;
  };
  const trafficToFont = {
    '100,000+': 50,
    '50,000+': 40,
    '20,000+': 30,
    '10,000+': 20,
    '5,000+': 10,
    '2,000+': 5,
  };

  const getGoogleTrend = async () => {
    try {
      const response = await fetch(
        `https://test.cors.workers.dev/?https://trends.google.co.kr/trends/trendingsearches/daily/rss?geo=KR`
      );
      const xml = await response.text();
      parseString(xml, (err, result) => {
        const data = result.rss.channel[0].item;
        //console.dir(data[0].title[0]);
        console.dir(data);
        shuffle(data);
        setRanks(data);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getGoogleTrend();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.days}>
        <Text style={styles.date}>
          {date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일{' '}
          {week[date.getDay()]}요일
        </Text>
      </View>
      <View style={styles.data}>
        {ranks.map((rank, index) => (
          <View>
            <Text
              style={{
                fontSize: trafficToFont[rank['ht:approx_traffic'][0]],
                color: generateColor(),
                fontFamily: 'Tmon',
                margin: randomIntGenerate(0, 5),
              }}>
              {rank.title[0]}{' '}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.adSquare}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
  },
  days: {
    flex: 1,
    backgroundColor:'skyblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  data: {
    flex: 4,
    backgroundColor: 'black',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-evenly',
  },
  date: {
    fontSize: 28,
    fontFamily: 'Tmon',
  },
  adSquare: {
    flex: 0.5,
    backgroundColor: 'white',
  },
});
