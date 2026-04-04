import {
  createContext,
  useState,
  useEffect,
  useContext
} from "react";
import { useNavigate } from "react-router-dom";

import { initialState, type ActivityEntry, type FoodEntry, type AppContextType } from "../types";

// TEMP mock (remove later if you have real API)
const mockApi = {
  auth: {
    register: async (c: any) => ({ data: { user: c, jwt: "123" } }),
    login: async (c: any) => ({ data: { user: c, jwt: "123" } }),
  },
  user: {
    me: async () => ({ data: { name: "Test", age: 20, weight: 70, goal: "fit" } }),
  },
  foodLogs: {
    list: async () => ({ data: [] }),
  },
  activityLogs: {
    list: async () => ({ data: [] }),
  },
};

const AppContext = createContext<AppContextType>(initialState);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [isUserFetched, setIsUserFetched] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
  const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

  const signup = async (credentials: any) => {
    const { data } = await mockApi.auth.register(credentials);
    setUser(data.user);
    localStorage.setItem("token", data.jwt);
    
  };

  const login = async (credentials: any) => {
    const { data } = await mockApi.auth.login(credentials);
    setUser({ ...data.user, token: data.jwt });
    localStorage.setItem("token", data.jwt);
   
  };

  const fetchUser = async (token: string) => {
    const { data } = await mockApi.user.me();
    setUser({ ...data, token });

    if (data?.age && data?.weight && data?.goal) {
      setOnboardingComplete(true);
    }

    setIsUserFetched(true);
  };

  const fetchFoodLogs = async () => {
    const { data } = await mockApi.foodLogs.list();
    setAllFoodLogs(data);
  };

  const fetchActivityLogs = async () => {
    const { data } = await mockApi.activityLogs.list();
    setAllActivityLogs(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setOnboardingComplete(false);
    navigate("/");
  };

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    (async () => {
      await fetchUser(token);

      // ✅ LOAD ONBOARDING DATA FROM LOCALSTORAGE
      const fitnessData = JSON.parse(localStorage.getItem("fitnessuser") || "null");

      if (fitnessData) {
        setUser((prev: any) => ({
          ...prev,
          ...fitnessData,
        }));
      }

      await fetchFoodLogs();
      await fetchActivityLogs();
    })();
  } else {
    setIsUserFetched(true);
  }
}, []);


  const value: AppContextType= {
    user,
    isUserFetched,
    signup,
    login,
    logout,
    fetchUser,
    allFoodLogs,
    allActivityLogs,
    setAllFoodLogs,
    setAllActivityLogs,
    onboardingComplete,
    setOnboardingComplete,
    setUser,
  };

  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);