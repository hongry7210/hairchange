// src/screens/UserImagesScreen.js

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // AuthContext 임포트

const UserImagesScreen = () => {
  const { userId } = useContext(AuthContext); // AuthContext에서 userId 가져오기
  const [images, setImages] = useState([]); // 사용자 이미지 목록
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  // 사용자 이미지 목록을 가져오는 함수
  const fetchUserImages = async () => {
    if (!userId) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('https://hairclip.store/api/user-images', {
        params: { userId: userId },
      });

      if (response.data && Array.isArray(response.data.images)) {
        setImages(response.data.images); // 서버에서 받은 이미지 목록 설정
      } else {
        Alert.alert('알림', '저장된 이미지가 없습니다.');
      }
    } catch (error) {
      console.error('이미지 목록 가져오기 오류:', error);
      Alert.alert('오류', '이미지 목록을 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserImages();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>저장된 헤어스타일 이미지</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#3EB489" style={styles.activityIndicator} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {images.length > 0 ? (
            images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image.uri }} style={styles.image} />
                <Text style={styles.imageTitle}>{image.title}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noImageText}>저장된 이미지가 없습니다.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1c1c1c',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  imageTitle: {
    fontSize: 16,
    color: '#333',
  },
  noImageText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
  },
  activityIndicator: {
    marginTop: 20,
  },
});

export default UserImagesScreen;
