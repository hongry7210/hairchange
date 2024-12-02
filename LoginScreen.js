import React, { useState, useEffect, useContext } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert, 
    ActivityIndicator 
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './AuthContext'; // AuthContext 임포트 (동일 디렉토리)

const LoginScreen = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { userId, login, isLoading } = useContext(AuthContext); // AuthContext 사용

    useEffect(() => {
        console.log('현재 사용자 ID:', userId); // 디버깅 로그 추가
        if (userId) {
            navigation.replace('Home');
        }
    }, [userId, navigation]);

    const handleLogin = async () => {
        // 입력 검증
        if (!loginId || !password) {
            Alert.alert('입력 오류', '로그인 ID와 비밀번호를 모두 입력해주세요.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('https://hairclip.store/api/login', {
                loginId: loginId,
                password: password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('로그인 응답 데이터:', response.data); // 디버깅 로그 추가

            // 상태 코드와 응답 데이터 확인
            if (response.status === 200) {
                const  userId  = response.data; // 응답 데이터에서 userId 추출
                if (userId) {
                    await login(userId); // AuthContext에 로그인 정보 저장

                    Alert.alert('성공', '로그인에 성공했습니다.', [
                        {
                            text: '확인',
                            onPress: () => navigation.replace('Home'),
                        },
                    ]);
                } else {
                    // userId가 없는 경우 실패 처리
                    Alert.alert('로그인 실패', '아이디 또는 비밀번호가 올바르지 않습니다.');
                }
            } else {
                Alert.alert('통신 실패', 'Response status != 200');
            }
        } catch (error) {
            console.error('로그인 오류 응답:', error.response); // 디버깅 로그 추가
            if (error.response) {
                // 백엔드에서 반환한 에러 메시지 표시
                const message = error.response.data.message || '로그인 실패';
                Alert.alert('로그인 실패', message);
            } else {
                Alert.alert('로그인 실패', '문제가 발생했습니다. 다시 시도해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#3EB489" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>로그인</Text>
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
            {loading ? (
                <ActivityIndicator size="large" color="#3EB489" style={{ marginTop: 20 }} />
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>로그인</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>회원가입</Text>
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
    registerText: {
        color: '#3EB489',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default LoginScreen;
