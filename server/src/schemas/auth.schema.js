import * as Yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const authSchema = Yup.object().shape({
  email: Yup.string()
    .lowercase()
    .required('Please enter your email.')
    .email('Invalid email.')
    .max(256, 'Maximum length is 256 characters.'),
  password: Yup.string()
    .required('Please enter a password.')
    .min(6, 'Password must be at least 6 characters long.')
    .max(256, 'Maximum length is 256 characters.'),
});
