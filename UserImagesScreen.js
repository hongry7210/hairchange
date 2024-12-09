// src/screens/UserImagesScreen.js

import React, { useState, useEffect, useContext } from 'react';
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    ScrollView, 
    ActivityIndicator, 
    Alert 
} from 'react-native';
import { AuthContext } from './AuthContext'; // AuthContext 임포트
import axios from 'axios';

const UserImagesScreen = () => {
    const { userId, imageFileNames } = useContext(AuthContext); // AuthContext에서 userId, imageFileNames 가져오기
    const [images, setImages] = useState([]); // 사용자 이미지 목록
    const [loading, setLoading] = useState(false); // 로딩 상태 관리
    const [sending, setSending] = useState(false); // 데이터 전송 상태 관리

    // 사용자 이미지 목록을 설정하는 함수
    const fetchUserImages = () => {
        if (!userId) {
            Alert.alert('오류', '로그인이 필요합니다.');
            return;
        }

        setLoading(true);
        try {
            // 이미지 파일명을 기반으로 이미지 URL 생성
            const updatedImages = imageFileNames.map((fileName) => ({
                fileName: fileName,
                uri: `https://ec2-3-36-143-220.ap-northeast-2.compute.amazonaws.com/image_storage/synthesis/${fileName}`,
                title: `헤어스타일 ${fileName.replace('generated_', '').replace('.jpg', '').replace(/_/g, ' ')}`,
            }));
            setImages(updatedImages); // 업데이트된 이미지 목록 설정
        } catch (error) {
            console.error('이미지 목록 설정 오류:', error);
            Alert.alert('오류', '이미지 목록을 설정하는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 사용자 ID와 이미지 배열을 백엔드로 전송하는 함수
    const sendUserImages = async () => {
        if (!userId) {
            Alert.alert('오류', '로그인이 필요합니다.');
            return;
        }

        setSending(true);
        const payload = {
            userID: userId,
            images: imageFileNames,
        };

        try {
            const response = await axios.post('https://hairclip.store/api/user-images', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Send User Images Response:', response.data);
            // 필요에 따라 응답 처리
            // 예: 백엔드로부터 받은 데이터로 추가 처리
        } catch (error) {
            console.error('Send User Images Error:', error);
            Alert.alert('오류', '이미지 데이터를 전송하는 중 오류가 발생했습니다.');
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        fetchUserImages();
        sendUserImages(); // 화면 로드 시 데이터 전송
    }, [imageFileNames, userId]); // imageFileNames와 userId가 변경될 때마다 실행

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>저장된 헤어스타일 이미지</Text>
            {(loading || sending) ? (
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
        backgroundColor: '#f5f5f5',
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
        alignItems: 'center',
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
        backgroundColor: '#e0e0e0', // 이미지 로드 전에 표시될 배경색
    },
    imageTitle: {
        fontSize: 16,
        color: '#333',
    },
    noImageText: {
        textAlign: 'center',
        color: '#777',
        fontSize: 16,
        marginTop: 20,
    },
    activityIndicator: {
        marginTop: 20,
    },
});

export default UserImagesScreen;
