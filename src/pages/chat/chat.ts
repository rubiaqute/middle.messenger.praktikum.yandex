import { ChatList } from "../../components";
import { ChatBody } from "../../components/chat-body";
import { BasicBlockProps, Block } from "../../components/common/block";
import { chatList } from "../../mock";
import ChatPageTemplate from "./chat.hbs?raw";
class ChatPage extends Block<BasicBlockProps> {
  constructor() {
    super({
      ChatList: new ChatList({
        _id: "ChatList",
        chatList,
        whenClickItem: (chatId) => this.changeActiveChat(chatId),
      }),
      ChatBody: new ChatBody({
        _id: "ChatBody",
        chat: chatList[0],
      }),
    });
  }

  changeActiveChat(chatId: number) {
    const newActiveChat =
      chatList.find((chatItem) => chatItem.id === chatId) ?? chatList[0];

    (this.childrenNodes.ChatBody as unknown as ChatBody).updateChatBody(
      newActiveChat,
    );
  }

  render() {
    return ChatPageTemplate;
  }
}

export const chatPage = new ChatPage();
