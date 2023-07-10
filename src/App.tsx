import { CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainPage from "./pages/MainPage";

import { useTranslation } from 'react-i18next'
import {useEffect} from "react";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
    const showToastMessage = () => {
        toast.success('Success Notification !', {
            position: toast.POSITION.TOP_RIGHT
        });
    };

    const { t, i18n } = useTranslation();

    useEffect(() => {
        const lng = navigator.language;
        i18n.changeLanguage(lng);
    }, [])

    const lng = navigator.language
  return (
      <>
        <ToastContainer />
        <CssBaseline />
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/main' element={<MainPage />} />
          <Route path='/new_password' element={<ForgotPasswordPage />} />
        </Routes>
      </>
  );
}

export default App;