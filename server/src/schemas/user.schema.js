import * as Yup from 'yup';

export const emailSchema = Yup.string()
  .lowercase()
  .required('Please enter your email.')
  .email('Invalid email.')
  .max(256, 'Maximum length is 256 characters.');

export const passwordSchema = Yup.string()
  .required('Please enter a password.')
  .min(6, 'Password must be at least 6 characters long.')
  .max(256, 'Maximum length is 256 characters.');

export const updatePasswordSchema = Yup.object().shape({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});

export const forgotPasswordSchema = Yup.object().shape({
  email: emailSchema,
});

export const resetPasswordSchema = Yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
  resetPasswordToken: Yup.string()
    .required('Reset token is required')
    .length(40, 'Token must be 40 characters long'),
});

export const updateUserSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Please enter your first name.')
    .max(256, 'Maximum length is 256 characters.'),
  lastName: Yup.string()
    .required('Please enter your last name.')
    .max(256, 'Maximum length is 256 characters.'),
  email: emailSchema,
  company: Yup.string().max(256, 'Maximum length is 256 characters.'),
});

export const userSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Please enter your first name.')
    .max(256, 'Maximum length is 256 characters.'),
  lastName: Yup.string()
    .required('Please enter your last name.')
    .max(256, 'Maximum length is 256 characters.'),
  email: emailSchema,
  // Password not required on update (put request)
  password: passwordSchema,
  company: Yup.string().max(256, 'Maximum length is 256 characters.'),
});
