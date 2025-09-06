import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService, memberService } from "../services/memberService";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 로딩 시 토큰 유효성 검사 및 사용자 정보 로드
  const verifyUser = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        // 토큰으로 사용자 정보를 가져와서 유효성 검증
        const userData = await memberService.getMyInfo();
        setCurrentUser(userData);
      } catch (error) {
        console.error("자동 로그인 실패 (토큰 만료 등):", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentUser"); // 불일치 방지를 위해 함께 제거
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  // login 함수는 사용자 데이터와 토큰을 받아 처리
  const login = async (userData, token) => {
    localStorage.setItem("accessToken", token);
    
    localStorage.setItem("currentUser", JSON.stringify(userData));

    // 3. Axios 헤더에 토큰을 즉시 설정 (로그인 직후 API 호출 대비)
    // apiClient가 별도 파일에 있다면 import 해야 합니다.
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // 4. 앱의 현재 상태를 업데이트
    setCurrentUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser"); // currentUser도 함께 제거
      setCurrentUser(null);
    }
  };

  const value = {
    // isAuthenticated는 currentUser의 존재 여부로 판단
    isAuthenticated: !!currentUser,
    currentUser,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
    );
};
