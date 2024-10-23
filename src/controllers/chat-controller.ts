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
        try {
            const result = await this.chatApi.getChats() as Response
            store.set('chat.chatsList', (result as unknown as { response: unknown }).response)

            return true
        } catch {
            return false
        }
    }

    async createChat(title: string) {
        try {
            await this.chatApi.createChat(title)
            await this.getChats()

            return true
        } catch {
            return false
        }
    }

    async deleteChat(chatId: number) {
        try {
            await this.chatApi.deleteChat(chatId)
            await this.getChats()

            return true
        } catch {
            return false
        }
    }

    async getChartUsers(chatId: number) {
        try {
            const result = await this.chatApi.getChartUsers(chatId) as { response: unknown }

            return result?.response ?? []
        } catch {
            return []
        }
    }

    async openChat(chatId: string) {
        try {
            const result = await this.chatApi.getToken(chatId) as { response: { token: string } }

            store.set('chat.activeChatToken', result.response.token)
            this.socket = new ChatWebsocket({
                userId: String(store.getState().profile.profileData.id),
                chatId,
                token: store.getState().chat.activeChatToken
            })

            return true
        } catch {
            return false
        }
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
        try {
            const result = await this.userApi.searchUsers(query) as { response: unknown }

            return result?.response ?? []
        } catch {
            return []
        }
    }

    async addUserToChat(userId: number) {
        try {
            const activeChatId = store.getState().chat.activeChat?.chatId

            if (activeChatId) {
                await this.chatApi.addUserToChat(activeChatId, userId)

                const newUsers = await this.getChartUsers(activeChatId)
                store.set('chat.activeChat.chatUsers', newUsers)
            }

            return true
        } catch {
            return false
        }
    }

    async deleteUserFromChat(userId: number) {
        try {
            const activeChatId = store.getState().chat.activeChat?.chatId

            if (activeChatId) {
                await this.chatApi.deleteUserFromChat(activeChatId, userId)

                const newUsers = await this.getChartUsers(activeChatId)
                store.set('chat.activeChat.chatUsers', newUsers)
            }

            return true
        } catch {
            return false
        }
    }

    async loadChatAvatar(formData: FormData) {
        try {
            await this.chatApi.loadChatsAvatar(formData)
            this.getChats()

            return true
        } catch {
            return false
        }
    }
}
