// src/screens/ProgressAndImageScreen.js

import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import * as Progress from 'react-native-progress';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from './AuthContext'; // AuthContext 임포트
import { Buffer } from 'buffer'; // Buffer 임포트

const ProgressAndImageScreen = () => {
  const { userId } = useContext(AuthContext); // AuthContext에서 userId 가져오기
  const [progress, setProgress] = useState(0); // 프로그레스 바 상태
  const [image, setImage] = useState(null); // 생성된 이미지 상태
  const [showImageButton, setShowImageButton] = useState(false); // "사진 확인하기" 버튼 상태
  const [showImage, setShowImage] = useState(false); // 이미지 표시 상태
  const navigation = useNavigation();
  const route = useRoute();

  const { title } = route.params; // DetailPicAndText에서 전달된 헤어스타일 제목

  useEffect(() => {
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
            // 이미지가 이미 수신된 경우 프로그레스를 1로 설정하고 버튼 표시
            if (image) {
              setProgress(1);
              setShowImageButton(true);
            }
            return Math.min(newProgress, 0.95);
          }
          return newProgress;
        });
      }, 1000); // 1초 간격으로 업데이트
    };

    // 백엔드에 헤어스타일 요청을 보내는 함수
    const sendTitleToBackend = async () => {
      if (!userId) {
        Alert.alert('오류', '로그인이 필요합니다.', [
          {
            text: '확인',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
        return;
      }

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
          // 프로그레스가 이미 0.95 이상인 경우, 프로그레스를 1로 설정하고 버튼 표시
          if (progress >= 0.95) {
            setProgress(1);
            setShowImageButton(true);
          }
          // 사용자에게 알림 표시
          Alert.alert(
            '요청 완료',
            `${title} 헤어스타일 합성 요청이 완료되었습니다.`,
            [
              {
                text: '확인',
                onPress: () => navigation.replace('Home'),
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
            onPress: () => navigation.goBack(),
          },
        ]);
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
  }, [title, userId, navigation, image, progress]);

  // 이미지와 프로그레스 상태를 모니터링하여 프로그레스가 0.95에 도달했을 때 이미지를 수신했다면 프로그레스를 1로 설정
  useEffect(() => {
    if (image && progress >= 0.95) {
      setProgress(1);
      setShowImageButton(true);
    }
  }, [image, progress]);

  return (
    <View style={styles.container}>
      {/* 프로그레스 바 및 로딩 인디케이터 */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>합성 중...</Text>
        <Progress.Bar progress={progress} width={200} color="#3EB489" />
        <ActivityIndicator size="large" color="#3EB489" style={styles.activityIndicator} />
      </View>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
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

export default ProgressAndImageScreen;
