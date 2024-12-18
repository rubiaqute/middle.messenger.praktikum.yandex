import ChatBodyTemplate from "./chat-body.hbs?raw";
import { BasicBlockProps, Block } from "../common/block";
import { IChatItem } from "../../pages";
import { MessageInput } from "./message-input";
import { MessageItem } from "./message-item";
import { validateMessage } from "../../utils/validation";
import { connect, store, StoreEvents } from "../../utils/store";
import { Dropdown } from "./dropdown";
import { Avatar } from "../avatar";
import { BASE_URL } from "../../api/api-service";
import { ChatController } from "../../controllers/chat-controller";

export interface ChatBodyProps extends BasicBlockProps {
  _id: string;
  chat: IChatItem | null;
  whenSendMessage: (message: string) => void
}

export class ChatBody extends Block<ChatBodyProps> {
  message: string = "";
  chatController = new ChatController()

  constructor(props: ChatBodyProps) {
    super({
      ...props,
      Dropdown: new Dropdown(),
      MessageInput: new MessageInput({
        _id: "MessageInput",
        value: "",
        error: '',
        whenSend: (e: Event) => this.sendMessage(e),
        events: {
          change: (e: Event) => this.changeMessage(e),
        },
      }),
      MessageList: [],
      Avatar: new (connect(Avatar as typeof Block, state => {
        const avatarPartUrl = state.chat.chatsList.find((chat) => chat.id === state.chat.activeChat?.chatId)?.avatar
        return { avatarUrl: avatarPartUrl ? `${BASE_URL}/Resources/${avatarPartUrl}` : './union.svg' }
      }) as unknown as typeof Avatar)({
        _id: "AvatarChat",
        avatarId: "chatAvatar",
        avatarUrl: './union.svg',
        events: {
          change: (e) => this.changeChatAvatar(e),
        },
        isSmall: true,
      }),
    });

    store.on(StoreEvents.Updated, () => {
      const chat = {
        id: store.getState().chat.activeChat?.chatTitle,
        unreadCount: 0,
        chatName: store.getState().chat.activeChat?.chatTitle,
        chatUsers: (store.getState().chat.activeChat?.chatUsers ?? []).map((user) => user.display_name ?? user.login).join(', '),
        messages: (store.getState().chat.activeChat?.messages ?? []).map((message) => ({
          isSelf: message.user_id === store.getState().profile.profileData.id,
          time: message.time,
          text: message.content,
          user: store.getState().chat.activeChat?.chatUsers?.find((user) => user.id === message.user_id)?.display_name ?? store.getState().chat.activeChat?.chatUsers?.find((user) => user.id === message.user_id)?.login
        }))
      } as unknown as IChatItem

      const messagesNodes = chat?.messages.map(
        (messageItem, index) =>
          new MessageItem({
            _id: `MessageItem${index}`,
            message: messageItem,
          }),
      )

      this.updateLists('MessageList', messagesNodes as unknown as Block<BasicBlockProps>[])

      this.setProps({
        ...this.props,
        _id: 'ChatBody',
        chat,
      })
    });

  }

  changeMessage(e: Event) {
    if (e.target instanceof HTMLInputElement) {
      this.message = e.target.value;
    }
  }

  async changeChatAvatar(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]

    if (file) {
      const activeChatId = store.getState().chat.activeChat?.chatId
      const payload = new FormData()
      payload.append('chatId', String(activeChatId))
      payload.append('avatar', file)

      await this.chatController.loadChatAvatar(payload)
    }
  }


  sendMessage(e: Event): void {
    e.preventDefault();
    const error = validateMessage(this.message);

    this.childrenNodes.MessageInput.setProps({
      ...this.childrenNodes.MessageInput.props,
      _id: this.childrenNodes.MessageInput.props._id as string,
      error,
      value: this.message,
    });

    if (!error) {
      this.props.whenSendMessage(this.message)
    }
  }

  render() {
    return ChatBodyTemplate;
  }
}
