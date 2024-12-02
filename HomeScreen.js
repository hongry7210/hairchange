// HomeScreen.js

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from './AuthContext'; // AuthContext 임포트
import Icon from 'react-native-vector-icons/Ionicons'; // 아이콘 사용 시 필요
import { CommonActions } from '@react-navigation/native'; // 네비게이션 초기화를 위해 추가

const HomeScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext); // AuthContext에서 logout 함수 가져오기

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말로 로그아웃하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            try {
              await logout(); // AuthContext의 logout 함수 호출 및 완료 대기
              
              // 네비게이션 스택 초기화 및 'Login' 화면으로 이동
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                })
              );
            } catch (error) {
              console.error('로그아웃 오류:', error);
              Alert.alert('로그아웃 실패', '로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>환영합니다!</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('ImagePickerScreen')}
      >
        <Text style={styles.buttonText}>사진 선택</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('UserImages')}
      >
        <Text style={styles.buttonText}>저장한 사진 보기</Text>
      </TouchableOpacity>

      {/* 로그아웃 버튼 추가 */}
      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]} 
        onPress={handleLogout}
      >
        <Icon name="log-out-outline" size={24} color="#ffffff" style={styles.logoutIcon} />
        <Text style={styles.buttonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  button: {
    flexDirection: 'row', // 아이콘과 텍스트를 가로로 배치
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // 안드로이드 그림자
  },
  logoutButton: {
    backgroundColor: '#FF4D4D', // 로그아웃 버튼 색상 변경
  },
  logoutIcon: {
    marginRight: 10, // 아이콘과 텍스트 사이 간격
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
