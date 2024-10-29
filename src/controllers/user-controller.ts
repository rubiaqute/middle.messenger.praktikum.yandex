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
        try {
            await this.authApi.signUp(profileData)

            return {
                isSuccess: true,
                error: ''
            }
        } catch (e) {
            return {
                isSuccess: false,
                error: `Не удалось зарегистрироваться ${JSON.stringify((e as { response: { reason: string } }).response?.reason ?? '')}`
            }
        }
    }

    async getUserInfo() {
        try {
            const result = await this.authApi.getInfo() as Response
            const info = (result as unknown as { response: string }).response

            store.set('profile.profileData', info)

            return true
        } catch {
            return false
        }
    }

    async signIn(payload: UserLogin) {
        try {
            await this.authApi.signIn(payload)



            this.getUserInfo()

            return {
                isSuccess: true,
                error: ""
            }
        } catch (e) {
            const reason = (e as { response: { reason: string } })?.response?.reason ?? ''
            const isAlreadyAuthorised = (e as Response).status === 400 && reason === "User already in system"

            return {
                isSuccess: isAlreadyAuthorised,
                error: isAlreadyAuthorised ? '' : `Не удалось авторизоваться ${reason}`
            }
        }
    }

    async changeProfile(payload: UserChange) {
        try {
            await this.userApi.changeProfile(payload)
            this.getUserInfo()

            return {
                isSuccess: true,
                error: ""
            }
        } catch (e) {
            return {
                isSuccess: false,
                error: `Не удалось сохранить данные ${(e as { response: { reason: string } }).response?.reason ?? ''}`
            }
        }
    }

    async changePassword(payload: UserChangePassword) {
        try {
            await this.userApi.changePassword(payload)

            return {
                isSuccess: true,
                error: ""
            }
        } catch (e) {
            return {
                isSuccess: false,
                error: `Не удалось изменить пароль ${(e as { response: { reason: string } }).response?.reason ?? ''}`
            }
        }
    }

    async changeAvatar(formData: FormData) {
        try {
            await this.userApi.changeAvatar(formData)
            this.getUserInfo()

            return {
                isSuccess: true,
                error: ""
            }
        } catch (e) {
            return {
                isSuccess: false,
                error: `Не удалось изменить пароль ${(e as { response: { reason: string } }).response?.reason ?? ''}`
            }
        }
    }

    async logout() {
        try {
            await this.authApi.logout()

            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }
}
