export enum FormInputs {
    FormInputEmail = 'FormInputEmail',
    FormInputLogin = 'FormInputLogin',
    FormInputFirstName = 'FormInputFirstName',
    FormInputSecondName = 'FormInputSecondName',
    FormInputPhone = 'FormInputPhone',
    FormInputPassword = 'FormInputPassword',
    FormInputRepeatPassword = 'FormInputRepeatPassword'
}

export const inputsLDataList = [
    {
        id: FormInputs.FormInputLogin,
        name: 'login',
        label: 'Логин',
        type: 'text'
    },
    {
        id: FormInputs.FormInputPassword,
        name: 'password',
        label: 'Пароль',
        type: 'password'
    },
    {
        id: FormInputs.FormInputEmail,
        name: 'email',
        label: 'Почта',
        type: 'email'
    },
    {
        id: FormInputs.FormInputFirstName,
        name: 'first_name',
        label: 'Имя',
        type: 'text'
    },
    {
        id: FormInputs.FormInputSecondName,
        name: 'second_name',
        label: 'Фамилия',
        type: 'text'
    },
    {
        id: FormInputs.FormInputPhone,
        name: 'phone',
        label: 'Телефон',
        type: 'text'
    },
    {
        id: FormInputs.FormInputRepeatPassword,
        name: 'repeat_password',
        label: 'Пароль (еще раз)',
        type: 'password'
    },
]
