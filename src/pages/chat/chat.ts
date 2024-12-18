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

  async getChats() {
    await this.chatContoller.getChats()
  }

  sendMessage(message: string) {
    this.chatContoller.sendMessage(message)
  }

  async changeActiveChat(chatId: number) {
    if (chatId !== store.getState().chat.activeChat?.chatId) {
      this.chatContoller.closeChat()
      const chatList = store.getState().chat.chatsList
      const newActiveChat =
        chatList.find((chatItem) => chatItem.id === chatId) ?? null;

      if (newActiveChat?.id) {
        this.updateActiveChat(newActiveChat.title, newActiveChat.id)
        await this.chatContoller.openChat(String(newActiveChat.id))
      }
    }

  }

  async updateActiveChat(chatTitle: string, chatId: number) {
    const chatUsers = await this.chatContoller.getChartUsers(chatId)
    const newActiveChat = {
      chatTitle,
      chatId,
      chatUsers,
      messages: []
    }

    store.set('chat.activeChat', newActiveChat)
  }

  render() {
    return ChatPageTemplate;
  }
}
