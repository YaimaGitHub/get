import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FormRow,
  LoginAndSignupLayout,
  PasswordRow,
  Title,
} from '../components';
import {
  TEST_USER,
  ToastType,
  LOCAL_STORAGE_KEYS,
  LOGIN_CLICK_TYPE,
} from '../constants/constants';
import { useState } from 'react';
import { loginUserService } from '../Services/services';
import { setIntoLocalStorage, toastHandler } from '../utils/utils';

import { useAuthContext } from '../contexts/AuthContextProvider';
import { useNavigateIfRegistered } from '../hooks';

const LoginPage = () => {
  const { updateUserAuth, user } = useAuthContext();
  const navigate = useNavigate();

  useNavigateIfRegistered(user);

  const initialLoginState = {
    email: '',
    password: '',
  };
  const [userInputs, setUserInputs] = useState(initialLoginState);
  const [activeBtnLoader, setActiveBtnLoader] = useState('');
  const locationOfLogin = useLocation();

  const handleUserInput = (e) => {
    setUserInputs({ ...userInputs, [e.target.name]: e.target.value });
  };

  // used for both the buttons
  const handleSubmit = async (e, clickType) => {
    e.preventDefault();

    const isGuestClick = clickType === LOGIN_CLICK_TYPE.GuestClick;
    const userInfo = isGuestClick ? TEST_USER : userInputs;

    // Validaciones básicas para login manual
    if (!isGuestClick) {
      if (!userInputs.email.trim()) {
        toastHandler(ToastType.Error, 'Por favor ingresa tu email');
        return;
      }
      if (!userInputs.password.trim()) {
        toastHandler(ToastType.Error, 'Por favor ingresa tu contraseña');
        return;
      }
    }

    setActiveBtnLoader(clickType);

    if (isGuestClick) {
      setUserInputs(TEST_USER);
    }

    try {
      const { user, token } = await loginUserService(userInfo);

      // update AuthContext with data
      updateUserAuth({ user, token });

      // store this data in localStorage
      setIntoLocalStorage(LOCAL_STORAGE_KEYS.User, user);
      setIntoLocalStorage(LOCAL_STORAGE_KEYS.Token, token);

      // show success toast
      toastHandler(
        ToastType.Success,
        `¡Bienvenido ${user.firstName} ${user.lastName}! 😎`
      );
      // if non-registered user comes from typing '/login' at the url, after success redirect it to '/'
      navigate(locationOfLogin?.state?.from ?? '/');
    } catch (error) {
      console.error('Error de login:', error);
      let errorText = 'Error al iniciar sesión. Intenta nuevamente.';
      
      if (error?.response?.data?.errors && error.response.data.errors.length > 0) {
        errorText = error.response.data.errors[0];
      } else if (error?.message) {
        errorText = error.message;
      }
      
      toastHandler(ToastType.Error, errorText);
    }

    setActiveBtnLoader('');
  };

  //  if user is registered and trying to login through url, show this and navigate to home using useNavigateIfRegistered().
  if (!!user) {
    return <main className='full-page'></main>;
  }

  return (
    <LoginAndSignupLayout>
      <Title>Iniciar Sesión</Title>

      <form onSubmit={(e) => handleSubmit(e, LOGIN_CLICK_TYPE.RegisterClick)}>
        <FormRow
          text='Correo Electrónico'
          type='email'
          name='email'
          id='email'
          placeholder='tu-email@ejemplo.com'
          value={userInputs.email}
          handleChange={handleUserInput}
          disabled={!!activeBtnLoader}
        />
        <PasswordRow
          text='Ingresa tu Contraseña'
          name='password'
          id='password'
          placeholder='Tu contraseña'
          value={userInputs.password}
          handleChange={handleUserInput}
          disabled={!!activeBtnLoader}
        />

        <button
          disabled={!!activeBtnLoader}
          className='btn btn-block'
          type='submit'
        >
          {activeBtnLoader === LOGIN_CLICK_TYPE.RegisterClick ? (
            <span className='loader-2'></span>
          ) : (
            'Iniciar Sesión'
          )}
        </button>

        {/* this Guest Login button is out of the form  */}
        <button
          disabled={!!activeBtnLoader}
          className='btn btn-block'
          type='button'
          onClick={(e) => handleSubmit(e, LOGIN_CLICK_TYPE.GuestClick)}
        >
          {activeBtnLoader === LOGIN_CLICK_TYPE.GuestClick ? (
            <span className='loader-2'></span>
          ) : (
            'Iniciar como Invitado'
          )}
        </button>
      </form>

      <div>
        <span>
          ¿No tienes una cuenta?{' '}
          <Link
            to='/signup'
            state={{ from: locationOfLogin?.state?.from ?? '/' }}
          >
            regístrate aquí
          </Link>
        </span>
      </div>
    </LoginAndSignupLayout>
  );
};

export default LoginPage;