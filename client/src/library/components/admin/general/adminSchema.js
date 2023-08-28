import * as Yup from 'yup';

export const passwordSchema = Yup.string()
  .required('Please enter a password.')
  .min(6, 'Password must be at least 6 characters long.')
  .max(256, 'Maximum length is 256 characters.');

export const emailSchema = Yup.string()
  .lowercase()
  .required('Email is required')
  .email('Invalid email')
  .max(256, 'Maximum length is 256 characters');

export const authSchema = Yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
});

export const adminAddSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .max(256, 'Maximum length is 256 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .max(256, 'Maximum length is 256 characters'),
  email: emailSchema,
  company: Yup.string().max(256, 'Maximum length is 256 characters'),
  password: passwordSchema,
});

export const adminEditSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .max(256, 'Maximum length is 256 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .max(256, 'Maximum length is 256 characters'),
  email: emailSchema,
  company: Yup.string().max(256, 'Maximum length is 256 characters'),
});
