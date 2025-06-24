import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FormRow,
  LoginAndSignupLayout,
  PasswordRow,
  Title,
} from '../components';
import { useFormInput, useNavigateIfRegistered } from '../hooks';
import { toastHandler } from '../utils/utils';
import { ToastType } from '../constants/constants';
import { useState } from 'react';
import { signupService } from '../Services/services';
import { useAuthContext } from '../contexts/AuthContextProvider';

const SignupPage = () => {
  const signupPageLocation = useLocation();
  const { updateUserAuth, user } = useAuthContext();

  const navigate = useNavigate();
  useNavigateIfRegistered(user);

  const { userInputs, handleInputChange } = useFormInput({
    firstName: '',
    lastName: '',
    email: '',
    passwordMain: '',
    passwordConfirm: '',
  });

  const [isSignupFormLoading, setIsSignupFormLoading] = useState(false);

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (userInputs.passwordMain !== userInputs.passwordConfirm) {
      toastHandler(
        ToastType.Error,
        '¡Las contraseñas no coinciden!'
      );
      return;
    }

    if (!userInputs.firstName.trim()) {
      toastHandler(ToastType.Error, 'Por favor completa todos los campos');
      return;
    }

    const { email, firstName, lastName, passwordMain: password } = userInputs;

    setIsSignupFormLoading(true);

    try {
      const { user, token } = await signupService({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // update AuthContext with data
      updateUserAuth({ user, token });

      // show success toast
      toastHandler(ToastType.Success, `Registro exitoso`);

      // if user directly comes to '/signup' from url, so state will be null, after successful registration, user should be directed to home page
      navigate(signupPageLocation?.state?.from ?? '/');
    } catch (error) {
      toastHandler(ToastType.Error, error.response.data.errors[0]);
      console.error(error.response);
    }

    setIsSignupFormLoading(false);
  };

  //  if user is registered and trying to Signup '/signup' through url, show this and navigate to home using useNavigateIfRegistered().
  if (!!user) {
    return <main className='full-page'></main>;
  }

  return (
    <LoginAndSignupLayout>
      <Title>Registrarse</Title>

      <form onSubmit={handleCreateAccount}>
        <FormRow
          text='Nombre'
          type='text'
          name='firstName'
          id='firstName'
          placeholder='Jethalal'
          value={userInputs.firstName}
          handleChange={handleInputChange}
          disabled={isSignupFormLoading}
        />
        <FormRow
          text='Apellido'
          type='text'
          name='lastName'
          id='lastName'
          placeholder='Gada'
          value={userInputs.lastName}
          handleChange={handleInputChange}
          disabled={isSignupFormLoading}
        />

        <FormRow
          text='Correo Electrónico'
          type='email'
          name='email'
          id='email'
          placeholder='jethalal.gada@gmail.com'
          value={userInputs.email}
          handleChange={handleInputChange}
          disabled={isSignupFormLoading}
        />

        <PasswordRow
          text='Ingresa tu Contraseña'
          name='passwordMain'
          id='passwordMain'
          placeholder='babitaji1234'
          value={userInputs.passwordMain}
          handleChange={handleInputChange}
          disabled={isSignupFormLoading}
        />
        <PasswordRow
          text='Confirmar Contraseña'
          name='passwordConfirm'
          id='passwordConfirm'
          placeholder=''
          value={userInputs.passwordConfirm}
          handleChange={handleInputChange}
          disabled={isSignupFormLoading}
        />

        <button className='btn btn-block' type='submit'>
          {isSignupFormLoading ? (
            <span className='loader-2'></span>
          ) : (
            'Crear Nueva Cuenta'
          )}
        </button>
      </form>

      <div>
        <span>
          ¿Ya estás registrado?{' '}
          <Link
            to='/login'
            state={{ from: signupPageLocation?.state?.from ?? '/' }}
          >
            iniciar sesión
          </Link>
        </span>
      </div>
    </LoginAndSignupLayout>
  );
};

export default SignupPage;