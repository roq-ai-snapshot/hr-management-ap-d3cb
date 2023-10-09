import * as yup from 'yup';

export const hrValidationSchema = yup.object().shape({
  position: yup.string().required(),
  start_date: yup.date().required(),
  end_date: yup.date().nullable(),
  salary: yup.number().integer().required(),
  user_id: yup.string().nullable().required(),
  company_id: yup.string().nullable().required(),
});
