import { FetchData } from "../api/api-service";
import { ChatApi } from "../api/chat-api";
import { ChatWebsocket } from "../api/socket";
import { UserApi } from "../api/user-api";
import { store } from "../utils/store";

export interface ChatsGet extends FetchData {
    offset: number,
    limit: number,
    title?: string
}

export class ChatController {
    chatApi = new ChatApi()
    userApi = new UserApi()
    socket: ChatWebsocket | null = null

    async getChats() {
        const result = await this.chatApi.getChats() as Response
        const isSuccess = result.status === 200

        if (isSuccess) {
            store.set('chat.chatsList', (result as unknown as { response: unknown }).response)
        }

        return isSuccess
    }

    async createChat(title: string) {
        const result = await this.chatApi.createChat(title) as Response
        const isSuccess = result.status === 200

        if (isSuccess) {
            this.getChats()
        }

        return isSuccess
    }

    async deleteChat(chatId: number) {
        const result = await this.chatApi.deleteChat(chatId) as Response
        const isSuccess = result.status === 200

        if (isSuccess) {
            this.getChats()
        }

        return isSuccess
    }

    async getChartUsers(chatId: number) {
        const result = await this.chatApi.getChartUsers(chatId) as Response
        const isSuccess = result.status === 200
        const chartUsers = isSuccess ? (result as unknown as { response: unknown }).response : []

        return chartUsers
    }

    async openChat(chatId: string) {
        const result = await this.chatApi.getToken(chatId) as Response
        const isSuccess = result.status === 200

        if (isSuccess) {
            store.set('chat.activeChatToken', (result as unknown as { response: { token: string } }).response.token)
            this.socket = new ChatWebsocket({
                userId: String(store.getState().profile.profileData.id),
                chatId,
                token: store.getState().chat.activeChatToken
            })
        }

        return isSuccess
    }

    async sendMessage(message: string) {
        if (this.socket) {
            this.socket.send({
                content: message,
                type: 'message'
            })
        }
    }

    async closeChat() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
    }

    async searchUsers(query: string) {
        const result = await this.userApi.searchUsers(query) as Response

        const isSuccess = result.status === 200
        const searchedUsers = isSuccess ? (result as unknown as { response: unknown }).response : []

        return searchedUsers
    }

    async addUserToChat(userId: number) {
        const activeChatId = store.getState().chat.activeChat?.chatId
        let isSuccess = false

        if (activeChatId) {
            const result = await this.chatApi.addUserToChat(activeChatId, userId) as Response
            isSuccess = result.status === 200


            if (isSuccess) {
                const newUsers = await this.getChartUsers(activeChatId)
                store.set('chat.activeChat.chatUsers', newUsers)
            }
        }
        return isSuccess
    }
}
