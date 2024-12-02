// src/screens/RegisterScreen.js

import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert, 
    ActivityIndicator,
    Platform
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Picker 임포트

const RegisterScreen = ({ navigation }) => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('MALE'); // 기본값 설정
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        // 입력 검증
        if (!loginId || !password || !confirmPassword || !age || !gender) {
            Alert.alert('입력 오류', '모든 필드를 입력해주세요.');
            return;
        }

        // 비밀번호 확인
        if (password !== confirmPassword) {
            Alert.alert('비밀번호 오류', '비밀번호가 일치하지 않습니다.');
            return;
        }

        // 나이 검증 (숫자만 입력)
        const ageNumber = parseInt(age, 10);
        if (isNaN(ageNumber) || ageNumber <= 0) {
            Alert.alert('나이 오류', '유효한 나이를 입력해주세요.');
            return;
        }

        // 로그인 ID 및 비밀번호 길이 검증 (선택 사항)
        if (loginId.length < 3) {
            Alert.alert('로그인 ID 오류', '로그인 ID는 최소 3자 이상이어야 합니다.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('비밀번호 오류', '비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('https://hairclip.store/api/member', {
                loginId: loginId,
                password: password,
                age: ageNumber,
                gender: gender,
            });

            // 성공 시 처리
            if (response.status === 200 || response.status === 201) {
                const userId = response.data; // 백엔드에서 반환한 Id값
                Alert.alert('성공', '회원가입이 완료되었습니다.', [
                    {
                        text: '확인',
                        onPress: () => navigation.replace('Login'),
                    },
                ]);

                // 선택 사항: 등록 후 Id 저장
                // await AsyncStorage.setItem('userId', userId.toString());
            } else {
                Alert.alert('오류', '회원가입에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('백엔드 전송 오류:', error);
            // 오류 메시지 처리 (백엔드의 오류 응답에 따라 수정 필요)
            if (error.response && error.response.data && error.response.data.message) {
                Alert.alert('회원가입 실패', error.response.data.message);
            } else {
                Alert.alert('회원가입 실패', '문제가 발생했습니다. 다시 시도해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>회원가입</Text>
            <TextInput
                style={styles.input}
                placeholder="로그인 ID"
                value={loginId}
                onChangeText={setLoginId}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="나이"
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
            />
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue) => setGender(itemValue)}
                    style={styles.picker}
                    mode="dropdown" // Android에서는 드롭다운, iOS에서는 피커
                >
                    <Picker.Item label="남성" value="MALE" />
                    <Picker.Item label="여성" value="FEMALE" />
                    <Picker.Item label="기타" value="OTHER" />
                </Picker>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#3EB489" style={{ marginTop: 20 }} />
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>회원가입</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <Text style={styles.loginText}>이미 계정이 있으신가요? 로그인하기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1c1c1c',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        height: 50,
        borderColor: '#555555',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#ffffff',
    },
    pickerContainer: {
        borderColor: '#555555',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    button: {
        backgroundColor: '#3EB489',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    loginText: {
        color: '#3EB489',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default RegisterScreen;
