import ChatListTemplate from './chat-list.hbs?raw';
import { BasicBlockProps, Block } from '../common/block';
import { ChatItem } from './chat-item';
import { IChatItem } from '../../pages';

export interface ChatListProps extends BasicBlockProps {
    _id: string,
    chatList: IChatItem[]
}

export class ChatList extends Block<ChatListProps> {
    constructor(props: ChatListProps) {
    super({
        ...props,
        ChatList: props.chatList.map((chatItem)=>(
            new ChatItem({
                _id: `ChatItem${chatItem.id}`,
                lastMessage: chatItem.messages[0],
                id: chatItem.id,
                name: chatItem.chatName
            })
        )),
    })
    }
    render() {
        return ChatListTemplate
    }
}
