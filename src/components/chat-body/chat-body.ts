import ChatBodyTemplate from "./chat-body.hbs?raw";
import { BasicBlockProps, Block } from "../common/block";
import { IChatItem } from "../../pages";
import { MessageInput } from "./message-input";
import { MessageItem } from "./message-item";
import { validateMessage } from "../../utils/validation";

export interface ChatBodyProps extends BasicBlockProps {
  _id: string;
  chat: IChatItem;
}

export class ChatBody extends Block<ChatBodyProps> {
  message: string = "";

  constructor(props: ChatBodyProps) {
    super({
      ...props,
      MessageInput: new MessageInput({
        _id: "MessageInput",
        value: "",
        error: '',
        whenSend: (e: Event) => this.sendMessage(e),
        events: {
          change: (e: Event) => this.changeMessage(e),
        },
      }),
      MessageList: props.chat.messages.map(
        (messageItem, index) =>
          new MessageItem({
            _id: `MessageItem${index}`,
            message: messageItem,
          }),
      ),
    });
  }

  updateChatBody(newChat: IChatItem) {
    const newMessagesNodes = newChat.messages.map(
      (messageItem, index) => new MessageItem({
        _id: `MessageItem${index}`,
        message: messageItem,
        error: '',
      })
    ) as unknown as Block<BasicBlockProps>[]

    this.updateLists("MessageList", newMessagesNodes);

    this.setProps({
      ...this.props,
      _id: "ChatBody",
      chat: newChat,
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

    if (!error) {
      console.log(`SendMessage ${this.message}`);
    }

    this.childrenNodes.MessageInput.setProps({
      ...this.childrenNodes.MessageInput.props,
      _id: this.childrenNodes.MessageInput.props._id as string,
      error,
      value: this.message,
    });
  }

  render() {
    return ChatBodyTemplate;
  }
}
