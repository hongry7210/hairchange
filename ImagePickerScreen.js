// ImagePickerScreen.js 

import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Text,
    Dimensions,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ImagePickerScreen = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigation = useNavigation();

    const selectImage = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: true,
            quality: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                Alert.alert('취소', '이미지 선택이 취소되었습니다.');
            } else if (response.errorCode) {
                Alert.alert('에러', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                
                // 파일 형식 검증
                if (asset.type !== 'image/jpeg') {
                    Alert.alert('오류', 'jpg 파일만 업로드할 수 있습니다.');
                    console.log("jpg파일 아님");
                    console.log(asset.type);
                    setSelectedImage(null);
                    return;
                }
                setSelectedImage(asset);
            }
        });
    };

    const takePhoto = () => { // 촬영 기능 추가
        const options = {
            mediaType: 'photo',
            includeBase64: true,
            quality: 1,
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                Alert.alert('취소', '사진 촬영이 취소되었습니다.');
            } else if (response.errorCode) {
                Alert.alert('에러', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                
                // 파일 형식 검증
                if (asset.type !== 'image/jpeg') {
                    Alert.alert('오류', 'jpg 파일만 업로드할 수 있습니다.');
                    console.log("jpg파일 아님");
                    console.log(asset.type);
                    setSelectedImage(null);
                    return;
                }
                Alert.alert(asset.fileName);
                setSelectedImage(asset);
            }
        });
    };

    const uploadImage = async () => {
        if (!selectedImage) {
            Alert.alert('오류', '업로드할 이미지를 선택해주세요.');
            return;
        }

        // 추가적인 파일 형식 검증 (선택 사항)
        if (selectedImage.type !== 'image/jpeg') {
            Alert.alert('오류', 'jpg 파일만 업로드할 수 있습니다.');
            setSelectedImage(null);
            return;
        }

        const { base64, fileName, type } = selectedImage;

        const payload = {
            image: base64,
            name: fileName || asset.fileName,
            type: type || 'image/jpeg',
        };

        setUploading(true);

        try {
            await axios.post('https://hairclip.store/api/image', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            Alert.alert('성공', '이미지가 성공적으로 업로드되었습니다.');
            console.log('성공');
        } catch (error) {
            Alert.alert('업로드 실패', '이미지 업로드에 실패했습니다.');
            console.error(error);
        } finally {
            setSelectedImage(null); // 업로드 후 이미지 초기화
            console.log("이미지 초기화");
            setUploading(false);
            navigation.navigate('DetailPicAndText'); // 업로드 완료 후 DetailPicAndText로 이동
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>이미지 업로드</Text>
                </View>
                <TouchableOpacity style={styles.imageBox} onPress={selectImage}>
                    {selectedImage ? (
                        <Image source={{ uri: selectedImage.uri }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Icon name="image-outline" size={50} color="#555555" />
                            <Text style={styles.placeholderText}>사진을 선택해주세요</Text>
                        </View>
                    )}
                    {selectedImage && (
                        <TouchableOpacity style={styles.removeButton} onPress={() => setSelectedImage(null)}>
                            <Icon name="trash-outline" size={20} color="#ffffff" />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>

                {/* 카메라 버튼 추가 */}
                <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
                    <Icon name="camera-outline" size={24} color="#ffffff" style={styles.cameraIcon} />
                    <Text style={styles.buttonText}>카메라</Text>
                </TouchableOpacity>

                {uploading ? (
                    <ActivityIndicator size="large" color="#3EB489" style={styles.activityIndicator} />
                ) : (
                    <TouchableOpacity
                        style={[
                            styles.uploadButton,
                            !selectedImage && styles.disabledButton,
                        ]}
                        onPress={uploadImage}
                        disabled={!selectedImage}
                    >
                        <Icon name="cloud-upload-outline" size={24} color="#ffffff" style={styles.uploadIcon} />
                        <Text style={styles.buttonText}>업로드</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    header: {
        width: '100%',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1c1c1c',
        textAlign: 'center',
    },
    imageBox: {
        width: width * 0.8,
        height: width * 0.8,
        borderWidth: 2,
        borderColor: '#555555',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        position: 'relative',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555555',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3EB489',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        marginTop: 20,
        width: width * 0.8,
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: '#a9a9a9',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
    },
    uploadIcon: {
        marginRight: 10,
    },
    activityIndicator: {
        marginTop: 20,
        width: width * 0.8,
    },
    removeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 20,
    },
    cameraButton: { // 촬영 버튼 스타일 수정
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E90FF', // 파란색
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        marginTop: 20,
        width: width * 0.8,
        justifyContent: 'center',
    },
    cameraIcon: {
        marginRight: 10,
    },
    cameraButtonText: { // 촬영 버튼 텍스트 스타일 추가
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default ImagePickerScreen;