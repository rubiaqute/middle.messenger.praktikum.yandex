import { IMessage } from "../../../pages";
import { getDateFormat } from "../../../utils/helpers";
import { Block } from "../../common/block";
import MessageTemplate from "./message-item.hbs?raw";

interface MessageInputProps extends Record<string, unknown> {
  message: IMessage;
  _id: string;
}

export class MessageItem extends Block<MessageInputProps> {
  constructor(props: MessageInputProps) {
    super({
      ...props,
      message: {
        ...props.message,
        time: getDateFormat(new Date(props.message.time)),
      },
    });
  }
  render() {
    return MessageTemplate;
  }
}
