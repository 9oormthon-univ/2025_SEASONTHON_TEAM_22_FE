import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
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

  // 앱 로딩 시 사용자 정보 확인
  const verifyUser = useCallback(async () => {
    try {
      // axios를 사용해서 사용자 정보 확인
      const response = await axios.get('/api/v1/members/me');
      if (response.data && response.data.success) {
        setCurrentUser(response.data.data);
      }
    } catch (error) {
      console.log('사용자 정보 확인 실패:', error);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  // login 함수는 사용자 데이터를 받아 처리
  const login = async (userData) => {
    try {
      // axios를 사용해서 사용자 정보 재확인
      const response = await axios.get('/api/v1/members/me');
      if (response.data && response.data.success) {
        setCurrentUser(response.data.data);
      } else {
        setCurrentUser(userData);
      }
    } catch (error) {
      console.log('로그인 후 사용자 정보 확인 실패, 전달받은 데이터 사용:', error);
      setCurrentUser(userData);
    }
  };

  const logout = async () => {
    try {
      // axios를 사용해서 로그아웃 API 호출
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
    } finally {
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
