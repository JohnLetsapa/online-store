import { useState } from 'react';
import {
  auth,
  signInWithGooglePopup,
  createUserDocumentFromAuth,
  createAuthUserWithEmailAndPassword,
} from '../../utils/firebase/firebase.utils';
import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';
import './sign-up-form.styles.scss';

// use this object to track all inputs for th four form fields instead of using useState four times -> Cleaner
const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value }); // [name] dynamically takes the name of the relevant input
    // therefore, this line updates all properties formFields properties
  };

  const logGoogleUser = async () => {
    const { user } = await signInWithGooglePopup(); // {user} comes from destructuring the response object to target only the info we require
    createUserDocumentFromAuth(user);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      let { user } = await createAuthUserWithEmailAndPassword(email, password);
      user = { ...user, displayName: displayName };
      createUserDocumentFromAuth(user);
      resetFormFields();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Email address already in use');
      }
    }
  };

  return (
    <div className="sign-up-container">
      <h2>Already have an account</h2>
      <span>Sign in with your email and password</span>
      <FormInput
        label="Display Name"
        type="text"
        required
        onChange={handleChange}
        name="displayName"
        value={displayName}
      />

      <FormInput
        label="email"
        type="email"
        required
        onChange={handleChange}
        name="email"
        value={email}
      />

      <FormInput
        label="Password"
        type="password"
        required
        onChange={handleChange}
        name="password"
        value={password}
      />

      <FormInput
        label="ConfirmPassword"
        type="password"
        required
        onChange={handleChange}
        name="confirmPassword"
        value={password}
      />

      <Button type="submit" onClick={handleSubmit}>
        Sign In
      </Button>
    </div>
  );
};

export default SignUpForm;