import { ChatList } from "../../components";
import { ChatBody } from "../../components/chat-body";
import { BasicBlockProps, Block } from "../../components/common/block";
import { ChatController } from "../../controllers/chat-controller";
import { store } from "../../utils/store";
import ChatPageTemplate from "./chat.hbs?raw";

export class ChatPage extends Block<BasicBlockProps> {
  chatContoller = new ChatController()
  constructor() {
    super({
      ChatList: new ChatList({
        _id: "ChatList",
        chatList: [],
        whenClickItem: (chatId) => this.changeActiveChat(chatId),
      }),
      ChatBody: new ChatBody({
        _id: "ChatBody",
        chat: null,
        whenSendMessage: (message) => this.sendMessage(message)
      }),
    });

    this.getChats()
  }

  getChats() {
    this.chatContoller.getChats()
  }

  sendMessage(message: string) {
    this.chatContoller.sendMessage(message)
  }

  async changeActiveChat(chatId: number) {
    this.chatContoller.closeChat()
    const chatList = store.getState().chat.chatsList
    const newActiveChat =
      chatList.find((chatItem) => chatItem.id === chatId) ?? null;

    if (newActiveChat?.id) {
      await this.chatContoller.openChat(String(newActiveChat.id))
      this.updateActiveChat(newActiveChat.title)
    }
  }

  updateActiveChat(chatTitle: string) {
    store.set('chat.activeChat.chatTitle', chatTitle)
    store.set('chat.activeChat.messages', [])
  }

  render() {
    return ChatPageTemplate;
  }
}

export const chatPage = new ChatPage();
