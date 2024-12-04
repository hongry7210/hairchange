// src/screens/ProgressAndImageScreen.js

import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
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
  const navigation = useNavigation();
  const route = useRoute();

  const { title } = route.params; // DetailPicAndText에서 전달된 헤어스타일 제목

  useEffect(() => {
    let isMounted = true; // 메모리 누수를 방지하기 위한 변수
    let interval = null;

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
        // GET 요청을 보내고 바이너리 데이터를 받기 위해 responseType 설정
        const response = await axios.get('https://hairclip.store/api/hairstyle', {
          params: { name: title },
          responseType: 'arraybuffer', // 바이너리 데이터 받기 위해 설정
        });

        console.log(`헤어스타일 요청 완료: ${title}`);

        // 응답 데이터를 base64로 변환
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');

        if (isMounted) {
          setImage(`data:image/jpeg;base64,${base64Image}`);
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

    // 프로그레스 바 애니메이션 시작
    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1;
        }
        return prev + 0.01; // 프로그레스 증가 속도 조절
      });
    }, 100); // 100ms 간격으로 업데이트

    sendTitleToBackend();

    // 요청 완료 후 프로그레스 바 중지
    const stopProgress = () => {
      if (interval) {
        clearInterval(interval);
      }
      setProgress(1);
    };

    // cleanup 함수
    return () => {
      isMounted = false;
      stopProgress();
    };
  }, [title, userId, navigation]);

  return (
    <View style={styles.container}>
      {!image ? (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>합성 중...</Text>
          <Progress.Bar progress={progress} width={200} color="#3EB489" />
          <ActivityIndicator size="large" color="#3EB489" style={styles.activityIndicator} />
        </View>
      ) : (
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
  },
  progressText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  activityIndicator: {
    marginTop: 10,
  },
  imageContainer: {
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
