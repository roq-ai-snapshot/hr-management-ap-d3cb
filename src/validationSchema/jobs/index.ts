import * as yup from 'yup';

export const jobValidationSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  salary: yup.number().integer().required(),
  location: yup.string().required(),
  company_id: yup.string().nullable().required(),
});
