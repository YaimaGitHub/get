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

      // actualizar AuthContext con datos
      updateUserAuth({ user, token });

      // mostrar toast de éxito
      toastHandler(ToastType.Success, `¡Registro exitoso! Bienvenido ${firstName} ${lastName}`);

      // si el usuario viene directamente a '/signup' desde url, entonces state será null, después del registro exitoso, el usuario debe ser dirigido a la página de inicio
      navigate(signupPageLocation?.state?.from ?? '/');
    } catch (error) {
      toastHandler(ToastType.Error, error.response.data.errors[0]);
      console.error(error.response);
    }

    setIsSignupFormLoading(false);
  };

  // si el usuario está registrado y trata de hacer Signup '/signup' a través de url, mostrar esto y navegar a home usando useNavigateIfRegistered().
  if (!!user) {
    return <main className='full-page'></main>;
  }

  return (
    <LoginAndSignupLayout>
      <Title>Crear Nueva Cuenta</Title>

      <form onSubmit={handleCreateAccount}>
        <FormRow
          text='Nombre'
          type='text'
          name='firstName'
          id='firstName'
          placeholder='Tu nombre'
          value={userInputs.firstName}
          handleChange={handleInputChange}
          disabled={isSignupFormLoading}
        />
        <FormRow
          text='Apellido'
          type='text'
          name='lastName'
          id='lastName'
          placeholder='Tu apellido'
          value={userInputs.lastName}
          handleChange={handleInputChange}
          disabled={isSignupFormLoading}
        />

        <FormRow
          text='Correo Electrónico'
          type='email'
          name='email'
          id='email'
          placeholder='tu.email@gmail.com'
          value={userInputs.email}
          handleChange={handleInputChange}
          disabled={isSignupFormLoading}
        />

        <PasswordRow
          text='Contraseña'
          name='passwordMain'
          id='passwordMain'
          placeholder='Crea una contraseña segura'
          value={userInputs.passwordMain}
          handleChange={handleInputChange}
          disabled={isSignupFormLoading}
        />
        <PasswordRow
          text='Confirmar Contraseña'
          name='passwordConfirm'
          id='passwordConfirm'
          placeholder='Repite tu contraseña'
          value={userInputs.passwordConfirm}
          handleChange={handleInputChange}
          disabled={isSignupFormLoading}
        />

        <button 
          className='btn btn-block' 
          type='submit'
          disabled={isSignupFormLoading}
        >
          {isSignupFormLoading ? (
            <span className='loader-2'></span>
          ) : (
            'Crear Cuenta'
          )}
        </button>
      </form>

      <div>
        <span>
          ¿Ya tienes una cuenta?{' '}
          <Link
            to='/login'
            state={{ from: signupPageLocation?.state?.from ?? '/' }}
          >
            inicia sesión aquí
          </Link>
        </span>
      </div>
    </LoginAndSignupLayout>
  );
};

export default SignupPage;