// DetailPicAndText.js

import React, { useContext, useState, useEffect } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from './AuthContext'; // AuthContext 임포트
import axios from 'axios';
import * as Progress from 'react-native-progress';
import { Buffer } from 'buffer'; // Buffer 임포트

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
  const { setCurrentRequest, userId } = useContext(AuthContext); // AuthContext에서 setCurrentRequest 및 userId 가져오기
  const [progress, setProgress] = useState(0); // 프로그레스 바 상태
  const [image, setImage] = useState(null); // 생성된 이미지 상태
  const [showImageButton, setShowImageButton] = useState(false); // "사진 확인하기" 버튼 상태
  const [showImage, setShowImage] = useState(false); // 이미지 표시 상태
  const [isRequesting, setIsRequesting] = useState(false); // 요청 중 여부

  // 카드 클릭 시 호출되는 함수
  const handleCardPress = (title) => {
    Alert.alert(
      '헤어스타일 합성 요청',
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
            initiateHairstyleRequest(title); // 요청 시작
          },
        },
      ],
      { cancelable: true }
    );
  };

  // 헤어스타일 합성 요청을 처리하는 함수
  const initiateHairstyleRequest = async (title) => {
    if (!userId) {
      Alert.alert('오류', '로그인이 필요합니다.', [
        {
          text: '확인',
          onPress: () => {}, // 필요 시 로그인 화면으로 이동하는 로직 추가
        },
      ]);
      return;
    }

    setIsRequesting(true);
    setProgress(0);
    setImage(null);
    setShowImageButton(false);
    setShowImage(false);

    let isMounted = true; // 메모리 누수를 방지하기 위한 변수
    let progressInterval = null;

    // 프로그레스 바를 0에서 0.95까지 4분 동안 채우는 함수
    const startProgress = () => {
      const totalSeconds = 240; // 4분
      const incrementPerSecond = 0.95 / totalSeconds; // 초당 프로그레스 증가량 (~0.003958)

      progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + incrementPerSecond;
          if (newProgress >= 0.95) {
            clearInterval(progressInterval);
            return 0.95;
          }
          return newProgress;
        });
      }, 1000); // 1초 간격으로 업데이트
    };

    // 백엔드에 헤어스타일 요청을 보내는 함수
    const sendTitleToBackend = async () => {
      try {
        // 백엔드에 GET 요청 보내기
        const response = await axios.get('https://hairclip.store/api/hairstyle', {
          params: { name: title },
          responseType: 'arraybuffer', // 바이너리 데이터 받기 위해 설정
        });

        console.log(`헤어스타일 요청 완료: ${title}`);

        // 응답 데이터를 base64로 변환
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');

        if (isMounted) {
          setImage(`data:image/jpeg;base64,${base64Image}`);
          setProgress(1);
          setShowImageButton(true);
          setIsRequesting(false);

          // 사용자에게 알림 표시
          Alert.alert(
            '요청 완료',
            `${title} 헤어스타일 합성 요청이 완료되었습니다.`,
            [
              {
                text: '확인',
                onPress: () => {}, // 필요 시 특정 동작 추가
              },
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        console.error('백엔드 요청 오류:', error);
        Alert.alert('오류', '헤어스타일 합성 요청에 실패했습니다.', [
          {
            text: '확인',
            onPress: () => {}, // 필요 시 이전 화면으로 이동하는 로직 추가
          },
        ]);
        if (isMounted) {
          setIsRequesting(false);
        }
      }
    };

    // 프로그레스 바 시작
    startProgress();

    // 백엔드 요청 보내기
    sendTitleToBackend();

    // cleanup 함수
    return () => {
      isMounted = false;
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  };

  // 이미지와 프로그레스 상태를 모니터링하여 프로그레스가 0.95에 도달했을 때 이미지를 수신했다면 프로그레스를 1로 설정
  useEffect(() => {
    if (image && progress >= 0.95) {
      setProgress(1);
      setShowImageButton(true);
    }
  }, [image, progress]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>헤어스타일 선택</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {data.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleCardPress(item.title)}
              disabled={isRequesting} // 요청 중일 때는 선택 불가
            >
              <View style={[styles.card, isRequesting && styles.cardDisabled]}>
                <Image source={item.image} style={styles.image} />
                <Text style={styles.text}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 프로그레스 바 및 로딩 인디케이터 */}
        {isRequesting && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>합성 중...</Text>
            <Progress.Bar progress={progress} width={200} color="#3EB489" />
            <ActivityIndicator size="large" color="#3EB489" style={styles.activityIndicator} />
          </View>
        )}

        {/* "사진 확인하기" 버튼 */}
        {showImageButton && (
          <TouchableOpacity style={styles.button} onPress={() => setShowImage(true)}>
            <Text style={styles.buttonText}>사진 확인하기</Text>
          </TouchableOpacity>
        )}

        {/* 생성된 이미지 표시 */}
        {showImage && image && (
          <View style={styles.imageContainer}>
            <Text style={styles.imageTitle}>합성된 헤어스타일</Text>
            <Image source={{ uri: image }} style={styles.generatedImage} />
          </View>
        )}
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
  cardDisabled: {
    opacity: 0.5,
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
  progressContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  progressText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  activityIndicator: {
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#3EB489',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  imageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1c1c1c',
    marginBottom: 10,
  },
  generatedImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
});

export default DetailPicAndText;
