import { ChatMessage, store } from "../utils/store";

export interface WebSocketProps {
    userId: string, chatId: string, token: string
}

export interface IMessage {
    content: string;
    type: string;
};

export class ChatWebsocket {
    socket: WebSocket
    constructor({ userId, chatId, token }: WebSocketProps) {
        this.socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`)
        this.initSocket()
    }

    initSocket() {
        this.socket.addEventListener('open', () => this.openConnection());
        this.socket.addEventListener('close', (e) => this.closeConnection(e));
        this.socket.addEventListener('message', (e) => this.message(e));
        this.socket.addEventListener('error', (e) => console.log(e));
    }

    public send(message: IMessage) {
        this.socket.send(JSON.stringify(message));
    }

    public disconnect() {
        this.socket.close()
    }

    private openConnection() {
        this.socket.send(JSON.stringify({
            content: '0',
            type: 'get old',
        }),
        );
    }

    closeConnection(event: CloseEvent) {
        if (event.wasClean) {
            console.log('Соединение закрыто чисто');
        } else {
            console.log('Обрыв соединения');
        }

        console.log(`Код: ${event.code} | Причина: ${event.reason}`);
    }

    message(event: MessageEvent) {
        let response: ChatMessage[] = []
        try {
            response = JSON.parse(event.data)
        }
        catch {
            response = []
        }

        if (Array.isArray(response)) {
            store.set('chat.activeChat.messages', response.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()))
        } else {
            const newMessages = [...(store.getState().chat.activeChat?.messages ?? []), response]
            store.set('chat.activeChat.messages', newMessages)
        }
    }
}
