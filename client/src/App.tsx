import { Routes, Route } from "react-router-dom";
import { useAppContext } from "./context/AppContext";

import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import FoodLog from "./pages/FoodLog";
import ActivityLog from "./pages/ActivityLog";
import Profile from "./pages/Profile";
import Login from "./pages/Login"; // make sure this exists
import Loading from "./components/ui/Loading";
import Onboarding from "./pages/Onboarding";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user, isUserFetched, onboardingComplete } = useAppContext();

  // If user not logged in
  if (!user) {
    return isUserFetched ? <Login /> : <Loading/>;
  }

  if(!onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <>
    <Toaster />
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="food" element={<FoodLog />} />
        <Route path="activity" element={<ActivityLog />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
    </>
  );
};

export default App;