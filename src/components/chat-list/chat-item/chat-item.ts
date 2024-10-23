import { BASE_URL } from "../../../api/api-service";
import { IMessage } from "../../../pages";
import { getDateFormat } from "../../../utils/helpers";
import { IStore } from "../../../utils/store";
import { Avatar } from "../../avatar";
import { BasicBlockProps, Block } from "../../common/block";
import ChatItemTemplate from "./chat-item.hbs?raw";

export interface ChatItemProps extends BasicBlockProps {
  _id: string;
  lastMessage: IMessage;
  unreadCount: number;
  name: string;
  id: number;
  avatar: string
}

export class ChatItem extends Block<ChatItemProps> {
  constructor(props: ChatItemProps) {
    super({
      ...props,
      lastMessage: {
        ...props.lastMessage,
        time: getDateFormat(new Date(props.lastMessage.time)),
      },
      Avatar: new Avatar({
        _id: "Avatar",
        avatarId: "chatListAvatar",
        avatarUrl: props.avatar ? `${BASE_URL}/Resources/${props.avatar}` : './union.svg',
        isStatic: true,
        isSmall: true,
      }),
    });
  }

  getAvatarUrl(state: IStore) {
    const avatarPartUrl = state.chat.chatsList.find((chat) => chat.id === this.props.id)?.avatar
    return avatarPartUrl ? `${BASE_URL}/Resources/${avatarPartUrl}` : './union.svg'

  }

  render() {
    return ChatItemTemplate;
  }
}
