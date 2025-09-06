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

  // 앱 로딩 시 사용자 정보 로드
  const verifyUser = useCallback(async () => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  // login 함수는 사용자 데이터를 받아 처리
  const login = async (userData) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
    } finally {
      localStorage.removeItem("currentUser");
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
