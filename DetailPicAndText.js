// src/screens/DetailPicAndText.js

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from './AuthContext'; // AuthContext 임포트

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
  const { userId } = useContext(AuthContext); // AuthContext에서 userId 가져오기
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  // 헤어스타일명을 기반으로 백엔드에 GET 요청 보내기
  const sendTitleToBackend = async (title) => {
    if (!userId) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    try {
      // GET 요청을 보내고 바이너리 데이터를 받기 위해 responseType 설정
      const response = await axios.get('https://hairclip.store/api/hairstyle', {
        params: { name: title },
        responseType: 'arraybuffer', // 바이너리 데이터 받기 위해 설정
      });

      console.log(`헤어스타일 요청 완료: ${title}`);

      // 요청이 완료되면 Home 화면으로 네비게이션
      Alert.alert(
        '요청 완료',
        `${title} 헤어스타일 합성 요청이 전송되었습니다.`,
        [
          {
            text: '확인',
            onPress: () => navigationToHome(),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('백엔드 요청 오류:', error);
      Alert.alert('오류', '헤어스타일 합성 요청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Home 화면으로 네비게이션하는 함수
  const navigationToHome = () => {
    // 현재 네비게이션 객체가 없는 경우 useNavigation 훅 사용
    // SafeAreaView 외에 네비게이션을 사용하려면 useNavigation 훅을 이용하거나 props로 전달해야 합니다.
    // 여기서는 useNavigation을 사용하여 네비게이션 객체를 가져옵니다.
    navigation.replace('Home');
  };

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
          onPress: () => sendTitleToBackend(title),
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

        {/* 로딩 인디케이터 */}
        {loading && <ActivityIndicator size="large" color="#3EB489" style={styles.activityIndicator} />}
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
