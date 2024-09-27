export interface IMessage {
    isSelf: boolean,
    time: string,
    text: string
}

export interface IChatItem {
    id: number,
    chatName: string,
    messages: IMessage[]
    unreadCount: number,
}
