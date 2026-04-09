import {
  createContext,
  useState,
  useEffect,
  useContext
} from "react";
import { useNavigate } from "react-router-dom";

import { initialState, type ActivityEntry, type FoodEntry, type AppContextType } from "../types";
import api from "../configs/api";
import toast from "react-hot-toast";


const AppContext = createContext<AppContextType>(initialState);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [isUserFetched, setIsUserFetched] = useState(localStorage.getItem('token')?false: true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
  const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

  const signup = async (credentials: any) => {
    try{
      const { data } = await api.post('/api/auth/local/register', credentials);
    setUser({ ...data.user, token: data.jwt });
    if(data?.user?.age && data?.user?.weight && data?.user?.goal){
      setOnboardingComplete(true)
    }
    localStorage.setItem("token", data.jwt);
   api.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`
    } catch (error: any){
      console.log(error);
      toast.error(error?.respons?.data?.error?.message || error?.message)
    }
  };

  const login = async (credentials: any) => {
    try{
      const { data } = await api.post('/api/auth/local', {identifier: credentials.email, password: credentials.password})

    setUser({ ...data.user, token: data.jwt });
    if(data?.user?.age && data?.user?.weight && data?.user?.goal){
      setOnboardingComplete(true)
    }
    localStorage.setItem("token", data.jwt);
    api.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`;
    } catch(error: any){
      console.log(error);
      toast.error(error?.response?.data?.error?.message || error?.message)
    }
  };

  const fetchUser = async (token: string) => {
    try{
      const { data } = await api.get('/api/user/me', {headers: {Authorization: `Bearer ${token}`}})
    setUser({ ...data, token });

    if (data?.age && data?.weight && data?.goal) {
      setOnboardingComplete(true);
    }
    api.defaults.headers.common['Authorization']=`Bearer $ {token}`;
    }    catch(error: any){
      console.log(error);
      toast.error(error?.response?.data?.error?.message || error?.message)
    }
    setIsUserFetched(true)
  };

  const fetchFoodLogs = async (token: string) => {
    try{
      const{data}= await api.get('/api/food-logs', {headers: {Authorization: `Bearer ${token}`}})
      setAllFoodLogs(data)
    }catch(error:any){
      console.log(error);
      toast.error(error?.response?.data?.error?.message || error?.message)
    }
  };

  const fetchActivityLogs = async (token: string) => {
   try{
      const{data}= await api.get('/api/activity-logs', {headers: {Authorization: `Bearer ${token}`}})
      setAllActivityLogs(data)
    }catch(error:any){
      console.log(error);
      toast.error(error?.response?.data?.error?.message || error?.message)
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setOnboardingComplete(false);
    api.defaults.headers.common['Authorization']= '';
    navigate("/");
  };

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    (async () => {
      
      await fetchUser(token);
      await fetchFoodLogs(token);
      await fetchActivityLogs(token);
    })();
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