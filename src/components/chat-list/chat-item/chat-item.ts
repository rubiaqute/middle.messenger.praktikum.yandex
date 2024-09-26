import { IMessage } from '../../../pages';
import { BasicBlockProps, Block } from '../../common/block';
import ChatItemTemplate from './chat-item.hbs?raw';

export interface ChatItemProps extends BasicBlockProps{
    _id: string,
    lastMessage: IMessage,
    name: string,
    id: number
}

export class ChatItem extends Block<ChatItemProps> {
    render() {
        return ChatItemTemplate
    }
}
