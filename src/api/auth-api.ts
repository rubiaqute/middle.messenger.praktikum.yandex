import { UserCreate, UserLogin } from "../controllers/user-controller";
import { HTTPTransport } from "./api-service";
import { BaseAPI } from "./base-api";

const authApiInstance = new HTTPTransport();

const urlBase = '/auth'

export class AuthApi extends BaseAPI {
    signUp(profileData: UserCreate) {
        return authApiInstance.post(`${urlBase}/signup`, { data: profileData });
    }

    signIn(payload: UserLogin) {
        return authApiInstance.post(`${urlBase}/signin`, { data: payload });
    }

    getInfo() {
        return authApiInstance.get(`${urlBase}/user`);
    }

    logout() {
        return authApiInstance.post(`${urlBase}/logout`);
    }
}
