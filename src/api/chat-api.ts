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

    deleteChat(chatId: number) {
        return chatApiInstance.delete(urlBase, { data: { chatId } });
    }

    getChartUsers(chatId: number) {
        return chatApiInstance.get(`${urlBase}/${chatId}/users`);
    }

    addUserToChat(chatId: number, userId: number) {
        return chatApiInstance.put(`${urlBase}/users`, {
            data: {
                users: [userId],
                chatId
            }
        });
    }

    deleteUserFromChat(chatId: number, userId: number) {
        return chatApiInstance.delete(`${urlBase}/users`, {
            data: {
                users: [userId],
                chatId
            }
        });
    }

    loadChatsAvatar(payload: FormData) {
        return chatApiInstance.put(`${urlBase}/avatar`, {
            data: payload,
            contentType: 'multipart/form-data'
        });
    }
}
