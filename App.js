// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens'; // react-native-screens 최적화
// Import your components (src/screens 폴더 내에 위치한다고 가정)
import HomeScreen from './HomeScreen';
import ImagePickerScreen from './ImagePickerScreen';
import DetailPicAndText from './DetailPicAndText';
import LoginScreen from './LoginScreen'; // 로그인 화면
import RegisterScreen from './RegisterScreen'; // 회원가입 화면
import { AuthProvider } from './AuthContext'; // AuthContext 추가
import UserImagesScreen from './UserImagesScreen';
import ProgressAndImageScreen from './ProgressAndImageScreen'; 
import { Buffer } from 'buffer'; // Buffer 임포트
enableScreens(); // react-native-screens 최적화 활성화  


const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            {/* 로그인 화면 */}
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: '로그인', headerShown: false }} // 헤더 숨김
            />

            {/* 회원가입 화면 */}
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: '회원가입' }}
            />

            {/* UserImagesScreen 추가 */}
            <Stack.Screen
              name="UserImages"
              component={UserImagesScreen}
              options={{ title: '저장된 이미지' }}
            />

            {/* 기존 화면들 */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: '홈', headerLeft: null, gestureEnabled: false, headerBackVisible: false }}
            />
            <Stack.Screen
              name="ImagePickerScreen"
              component={ImagePickerScreen}
              options={{ title: '사진 선택' }}
            />
            <Stack.Screen
              name="DetailPicAndText"
              component={DetailPicAndText}
              options={{ title: '상세 정보' }}
            />
            {/* ProgressAndImageScreen 추가 */}
            <Stack.Screen
              name="ProgressAndImage"
              component={ProgressAndImageScreen}
              options={{ title: '합성 진행' }}
            />


          </Stack.Navigator>
        </NavigationContainer>
    </AuthProvider>
  );
}
