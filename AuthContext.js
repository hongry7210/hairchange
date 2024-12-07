// AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentRequest, setCurrentRequest] = useState(null); // 현재 요청 상태 추가
    const [imageFileNames, setImageFileNames] = useState([]); // 이미지 파일명 목록

    const addImageFileName = (fileName) => {
        setImageFileNames((prevFileNames) => [...prevFileNames, fileName]);
    };

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                const storedImageFileNames = await AsyncStorage.getItem('imageFileNames');
                if (storedUserId) {
                    setUserId(storedUserId);
                }
                if (storedImageFileNames) {
                    setImageFileNames(JSON.parse(storedImageFileNames));
                }
            } catch (error) {
                console.error('사용자 정보 로드 오류:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    useEffect(() => {
        const saveImageFileNames = async () => {
            try {
                await AsyncStorage.setItem('imageFileNames', JSON.stringify(imageFileNames));
            } catch (error) {
                console.error('이미지 파일명 저장 오류:', error);
            }
        };

        saveImageFileNames();
    }, [imageFileNames]);
    
    const login = async (id) => {
        try {
            await AsyncStorage.setItem('userId', id.toString());
            setUserId(id);
            console.log('로그인 성공, userId 저장:', id); // 디버깅 로그 추가
        } catch (error) {
            console.error('로그인 저장 오류:', error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userId');
            setUserId(null);
            console.log('로그아웃 성공, userId 삭제'); // 디버깅 로그 추가
        } catch (error) {
            console.error('로그아웃 오류:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ userId, login, logout, isLoading, currentRequest, setCurrentRequest, imageFileNames, addImageFileName,}}>
            {children}
        </AuthContext.Provider>
    );
};
