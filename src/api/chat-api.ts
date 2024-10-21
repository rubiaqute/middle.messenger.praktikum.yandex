import { HTTPTransport } from "./api-service";
import { BaseAPI } from "./base-api";

const chatApiInstance = new HTTPTransport();

const urlBase = '/chats'

export class ChatApi extends BaseAPI {
    getChats() {
        return chatApiInstance.get(urlBase);
    }

    createChat(title: string) {
        return chatApiInstance.post(urlBase, { data: { title } });
    }

    getToken(chatId: string) {
        return chatApiInstance.post(`${urlBase}/token/${chatId}`);
    }

    // changePassword(payload: UserChangePassword) {
    //     return userApiInstance.put(`${urlBase}/password`, { data: payload });
    // }

    // changeAvatar(payload: FormData) {
    //     return userApiInstance.put(`${urlBase}/profile/avatar`, { data: payload, contentType: 'multipart/form-data' });
    // }
}
