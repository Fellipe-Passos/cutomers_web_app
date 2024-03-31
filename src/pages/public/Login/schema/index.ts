import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
    cpf: Yup
        .string()
        .required('É necessário preencher este campo.'),

    type: Yup
        .string()
        .required('É necessário preencher este campo.'),

    password: Yup
        .string()
        .required('É necessário preencher este campo.')
});

const LoginSchemaInitialValues = {
    cpf: '',
    type: 'PF',
    password: ''
};

export { LoginSchema, LoginSchemaInitialValues };