// DetailPicAndText.js

import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from './AuthContext'; // AuthContext 임포트
import { useNavigation } from '@react-navigation/native'; // 네비게이션 훅 임포트

// 헤어스타일 데이터
const data = [
  { id: '1', title: 'afro', image: require('./assets/images/afro.jpg') },
  { id: '2', title: 'bangs', image: require('./assets/images/bangs.jpg') },
  { id: '3', title: 'big hair', image: require('./assets/images/big hair.jpg') },
  { id: '5', title: 'butch cut', image: require('./assets/images/butch cut.jpg') },
  { id: '6', title: 'buzz cut', image: require('./assets/images/buzz cut.jpg') },
  { id: '7', title: 'eton crop', image: require('./assets/images/eton crop.jpg') },
  { id: '8', title: 'extensions', image: require('./assets/images/extensions.jpg') },
  { id: '9', title: 'fauxhawk', image: require('./assets/images/fauxhawk.jpg') },
  { id: '10', title: 'feathered hair', image: require('./assets/images/feathered hair.jpg') },
  { id: '11', title: 'fringe (bangs)', image: require('./assets/images/fringe (bang).jpg') }, 
  { id: '12', title: 'hi-top fade', image: require('./assets/images/hi-top fade.jpg') },
  { id: '13', title: 'layered hair', image: require('./assets/images/layered hair.jpg') },
  { id: '14', title: 'pixie', image: require('./assets/images/pixie.jpg') },
  { id: '15', title: 'pompadour', image: require('./assets/images/pompadour.jpg') },
  { id: '16', title: 'psychobilly wedge', image: require('./assets/images/psychobilly wedge.jpg') },
];

const DetailPicAndText = () => {
  const { setCurrentRequest } = useContext(AuthContext); // AuthContext에서 setCurrentRequest 가져오기
  const navigation = useNavigation(); // 네비게이션 훅 사용

  // 카드 클릭 시 호출되는 함수
  const handleCardPress = (title) => {
    Alert.alert(
      '합성 요청',
      `선택한 헤어스타일: ${title}\n해당 헤어스타일을 합성 요청하시겠습니까?`,
      [
        {
          text: '취소',
          onPress: () => console.log('합성 요청 취소됨'),
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => {
            setCurrentRequest(title); // 현재 요청 설정
            navigation.navigate('ProgressAndImage', { title });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>헤어스타일 선택</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {data.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => handleCardPress(item.title)}>
              <View style={styles.card}>
                <Image source={item.image} style={styles.image} />
                <Text style={styles.text}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1c1c1c',
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row', // 수평 방향으로 변경
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center', // 세로 정렬을 중앙으로 맞춤
  },
  image: {
    width: 100, // 고정된 너비로 조정
    height: 100, // 고정된 높이로 조정
    borderRadius: 8,
    marginRight: 16, // 이미지와 텍스트 사이에 여백 추가
  },
  text: {
    flex: 1, // 텍스트가 남은 공간을 모두 차지하도록 설정
    fontSize: 16,
    color: '#333',
    flexWrap: 'wrap', // 텍스트가 여러 줄로 표시되도록 설정
  },
  activityIndicator: {
    marginTop: 20,
  },
});

export default DetailPicAndText;
