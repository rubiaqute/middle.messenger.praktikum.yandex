import { UserChange, UserChangePassword, } from "../controllers/user-controller";
import { HTTPTransport } from "./api-service";
import { BaseAPI } from "./base-api";

const userApiInstance = new HTTPTransport();

const urlBase = '/user'

export class UserApi extends BaseAPI {
    changeProfile(payload: UserChange) {
        return userApiInstance.put(`${urlBase}/profile`, { data: payload });
    }

    changePassword(payload: UserChangePassword) {
        return userApiInstance.put(`${urlBase}/password`, { data: payload });
    }

    changeAvatar(payload: FormData) {
        return userApiInstance.put(`${urlBase}/profile/avatar`, { data: payload, contentType: 'multipart/form-data' });
    }
}
