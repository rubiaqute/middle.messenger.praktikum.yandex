const ERRORS = {
    requiredField: 'Обязательное поле',
    loginLength: 'Длина логина должна быть о 3 до 20 символов',
    loginContent: 'Логин должен состоять из латинских букв и цифр без специальных символов',
    passworLength: 'Длина пароля должна быть от 8 до 40 символов',
    passwordContent: 'Пароль должен содержать хотя бы одну заглавную букву и цифру'
}
export const validateLogin = (login: string)=> {
    if (!login) {
        return ERRORS.requiredField
    }
    if (login.length < 3 || login.length > 20) {
        return ERRORS.loginLength
    }
    if (!/^[a-zA-Z0-9_-]*[a-zA-Z][a-zA-Z0-9_-]*$/.test(login)) {
        return ERRORS.loginContent
    }

    return ''
}

export const validatePassword = (password: string) => {
    if (!password) {
        return ERRORS.requiredField
    }
    
    if (password.length < 8 || password.length > 40) {
        return ERRORS.passworLength
    }

    if (!/^(?=.*[A-Z])(?=.*\d).*$/.test(password)) {
        return ERRORS.passwordContent
    }

    return ''
}
