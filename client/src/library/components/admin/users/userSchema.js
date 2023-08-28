import * as Yup from 'yup';

export const emailSchema = Yup.string()
  .lowercase()
  .required('Email is required')
  .email('Invalid email')
  .max(256, 'Maximum length is 256 characters');

export const userSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .max(256, 'Maximum length is 256 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .max(256, 'Maximum length is 256 characters'),
  email: emailSchema,
  company: Yup.string().max(256, 'Maximum length is 256 characters'),
  corporateCarparks: Yup.number().required('Allocated carparks is required'),
});
