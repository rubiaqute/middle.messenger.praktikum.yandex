import { IMessage } from "../../../pages";
import { getDateFormat } from "../../../utils/helpers";
import { BasicBlockProps, Block } from "../../common/block";
import ChatItemTemplate from "./chat-item.hbs?raw";

export interface ChatItemProps extends BasicBlockProps {
  _id: string;
  lastMessage: IMessage;
  unreadCount: number;
  name: string;
  id: number;
}

export class ChatItem extends Block<ChatItemProps> {
  constructor(props: ChatItemProps) {
    super({
      ...props,
      lastMessage: {
        ...props.lastMessage,
        time: getDateFormat(new Date(props.lastMessage.time)),
      },
    });
  }

  render() {
    return ChatItemTemplate;
  }
}
