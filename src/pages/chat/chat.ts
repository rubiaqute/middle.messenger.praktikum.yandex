import { ChatList, Link } from "../../components";
import { BasicBlockProps, Block } from "../../components/common/block";
import { chatList } from "../../mock";
import ChatPageTemplate from './chat.hbs?raw';

class ChatPage extends Block<BasicBlockProps> {
    constructor() {
        super({
            ChatList: new ChatList({
                _id: 'ChatList',
                chatList
            }),
            Link: new Link({
                _id: 'Link',
                href: "/profile",
                text: "Профиль",
            }),
        })
    }



    render() {
        return ChatPageTemplate
    }
}

export const chatPage = new ChatPage()
