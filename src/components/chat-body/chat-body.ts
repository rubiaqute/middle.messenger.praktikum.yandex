import ChatBodyTemplate from "./chat-body.hbs?raw";
import { BasicBlockProps, Block } from "../common/block";
import { IChatItem } from "../../pages";
import { MessageInput } from "./message-input";
import { MessageItem } from "./message-item";
import { validateMessage } from "../../utils/validation";
import { store, StoreEvents } from "../../utils/store";
import { Dropdown } from "./dropdown";

export interface ChatBodyProps extends BasicBlockProps {
  _id: string;
  chat: IChatItem | null;
  whenSendMessage: (message: string) => void
}

export class ChatBody extends Block<ChatBodyProps> {
  message: string = "";

  constructor(props: ChatBodyProps) {
    super({
      ...props,
      Dropdown: new Dropdown({}),
      MessageInput: new MessageInput({
        _id: "MessageInput",
        value: "",
        error: '',
        whenSend: (e: Event) => this.sendMessage(e),
        events: {
          change: (e: Event) => this.changeMessage(e),
        },
      }),
      MessageList: []
    });

    store.on(StoreEvents.Updated, () => {
      const chat = {
        id: store.getState().chat.activeChat?.chatTitle,
        unreadCount: 0,
        chatName: store.getState().chat.activeChat?.chatTitle,
        messages: (store.getState().chat.activeChat?.messages ?? []).map((message) => ({
          isSelf: message.user_id === store.getState().profile.profileData.id,
          time: message.time,
          text: message.content,
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
