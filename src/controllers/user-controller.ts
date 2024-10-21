import { FetchData } from "../api/api-service";
import { AuthApi } from "../api/auth-api";
import { ResourcesApi } from "../api/resources-api";
import { UserApi } from "../api/user-api";
import { store } from "../utils/store";

export interface UserCreate extends FetchData {
    first_name: string,
    second_name: string,
    login: string,
    email: string,
    password: string,
    phone: string
}

export interface UserLogin extends FetchData {
    login: string,
    password: string
}

export interface UserChange extends FetchData {
    first_name: string,
    second_name: string,
    display_name: string,
    login: string,
    email: string,
    phone: string
}

export interface UserChangePassword extends FetchData {
    oldPassword: string,
    newPassword: string
}

export class UserController {
    authApi = new AuthApi()
    userApi = new UserApi()
    resourcesApi = new ResourcesApi()

    async signUp(profileData: UserCreate) {
        const response = await this.authApi.signUp(profileData)

        return {
            isSuccess: (response as Response).status === 200,
            error: `Не удалось зарегистрироваться ${JSON.stringify((response as { response: string }).response ?? '')}`
        }
    }

    async getUserInfo() {
        const result = await this.authApi.getInfo() as Response
        const info = (result as unknown as { response: string }).response
        const isSuccess = result.status === 200

        if (info && isSuccess) {
            store.set('profile.profileData', info)
        }

        return isSuccess
    }

    async signIn(payload: UserLogin) {
        const response = await this.authApi.signIn(payload)

        const reason = (response as { response: { reason: string } })?.response?.reason ?? ''
        const isAuthorised = (response as Response).status === 200 || ((response as Response).status === 400 && reason === "User already in system")


        if (isAuthorised) {
            this.getUserInfo()
        }

        return {
            isSuccess: isAuthorised,
            error: `Не удалось авторизоваться ${(response as { response: { reason: string } }).response?.reason ?? ''}`
        }
    }

    async changeProfile(payload: UserChange) {
        const response = await this.userApi.changeProfile(payload)

        if ((response as Response).status === 200) {
            this.getUserInfo()
        }

        return {
            isSuccess: (response as Response).status === 200,
            error: `Не удалось сохранить данные ${(response as { response: { reason: string } }).response?.reason ?? ''}`
        }
    }

    async changePassword(payload: UserChangePassword) {
        const response = await this.userApi.changePassword(payload)

        return {
            isSuccess: (response as Response).status === 200,
            error: `Не удалось изменить пароль ${(response as { response: { reason: string } }).response?.reason ?? ''}`
        }
    }

    async changeAvatar(formData: FormData) {
        const response = await this.userApi.changeAvatar(formData)

        if ((response as Response).status === 200) {
            this.getUserInfo()
        }

        return {
            isSuccess: (response as Response).status === 200,
            error: `Не удалось изменить пароль ${(response as { response: { reason: string } }).response?.reason ?? ''}`
        }
    }
}
