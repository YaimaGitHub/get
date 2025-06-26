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

  // usado para ambos botones
  const handleSubmit = async (e, clickType) => {
    e.preventDefault();

    const isGuestClick = clickType === LOGIN_CLICK_TYPE.GuestClick;
    const userInfo = isGuestClick ? TEST_USER : userInputs;

    setActiveBtnLoader(clickType);

    if (isGuestClick) {
      setUserInputs(TEST_USER);
    }

    try {
      const { user, token } = await loginUserService(userInfo);

      // actualizar AuthContext con datos
      updateUserAuth({ user, token });

      // almacenar estos datos en localStorage
      setIntoLocalStorage(LOCAL_STORAGE_KEYS.User, user);
      setIntoLocalStorage(LOCAL_STORAGE_KEYS.Token, token);

      // mostrar toast de éxito
      toastHandler(
        ToastType.Success,
        `Bienvenido ${user.firstName} ${user.lastName} 😎`
      );
      // si el usuario no registrado viene de escribir '/login' en la url, después del éxito redirigirlo a '/'
      navigate(locationOfLogin?.state?.from ?? '/');
    } catch ({ response }) {
      const errorText = response?.data?.errors[0].split('.')[0];
      toastHandler(ToastType.Error, errorText);
    }

    setActiveBtnLoader('');
  };

  // si el usuario está registrado y trata de hacer login a través de url, mostrar esto y navegar a home usando useNavigateIfRegistered().
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
          placeholder='jethalal.gada@gmail.com'
          value={userInputs.email}
          handleChange={handleUserInput}
          disabled={!!activeBtnLoader}
        />
        <PasswordRow
          text='Ingresa tu Contraseña'
          name='password'
          id='password'
          placeholder='babitaji1234'
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

        {/* este botón de Login de Invitado está fuera del formulario */}
        <button
          disabled={!!activeBtnLoader}
          className='btn btn-block'
          type='button'
          onClick={(e) => handleSubmit(e, LOGIN_CLICK_TYPE.GuestClick)}
        >
          {activeBtnLoader === LOGIN_CLICK_TYPE.GuestClick ? (
            <span className='loader-2'></span>
          ) : (
            'Iniciar como Invitado (Jethalal Gada)'
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