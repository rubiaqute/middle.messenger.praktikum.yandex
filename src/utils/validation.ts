const ERRORS = {
    requiredField: 'Обязательное поле',
    loginLength: 'Длина логина должна быть о 3 до 20 символов',
    loginContent: 'Логин должен состоять из латинских букв и цифр без специальных символов',
    passworLength: 'Длина пароля должна быть от 8 до 40 символов',
    passwordContent: 'Пароль должен содержать хотя бы одну заглавную букву и цифру',
    repeatPassword: 'Не совпадает с паролем',
    nameContent: 'Может содержать только латинские символы или кириллицу первая буква должна быть заглавной, допустим дефис',
    emailContent: 'Некорректная почта',
    phoneContent: 'Некорректный номер телефона'
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

export const validateRepeatPassword = (password: string, repeatPassword: string) => {
    if (password !== repeatPassword) {
        return ERRORS.repeatPassword
    }

    return ''
}

export const validateName = (name: string) => {
    if (!name) {
        return ERRORS.requiredField
    }
    if (!/^[A-ZА-Я][a-zA-ZА-Яа-я-]*$/.test(name)) {
        return ERRORS.nameContent
    }

    return ''
}

export const validateEmail = (email: string) => {
    if (!email) {
        return ERRORS.requiredField
    }
    if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,30}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,30}[a-zA-Z0-9])?)*$/.test(email)) {
        return ERRORS.emailContent
    }

    return ''
}

export const validatePhone = (phone: string) => {
    if (!phone) {
        return ERRORS.requiredField
    }
    if (!/^\+?\d{10,15}$/.test(phone)) {
        return ERRORS.phoneContent
    }

    return ''
}
