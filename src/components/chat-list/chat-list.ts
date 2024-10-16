import ChatListTemplate from "./chat-list.hbs?raw";
import { BasicBlockProps, Block } from "../common/block";
import { ChatItem } from "./chat-item";
import { IChatItem } from "../../pages";
import { SearchInput } from "../search-input";
import { Link } from "../link";

export interface ChatListProps extends BasicBlockProps {
  _id: string;
  chatList: IChatItem[];
  whenClickItem: (id: number) => void;
}

export class ChatList extends Block<ChatListProps> {
  constructor(props: ChatListProps) {
    super({
      ...props,
      Link: new Link({
        _id: "Link",
        href: "/settings",
        text: "Профиль >",
      }),
      SearchInput: new SearchInput({
        _id: "SearchInput",
        value: "",
        events: {
          change: (e: Event) => this.search(e),
        },
      }),
      ChatList: props.chatList.map(
        (chatItem) =>
          new ChatItem({
            _id: `ChatItem${chatItem.id}`,
            lastMessage: chatItem.messages[0],
            id: chatItem.id,
            name: chatItem.chatName,
            unreadCount: chatItem.unreadCount,
            events: {
              click: () => props.whenClickItem(chatItem.id),
            },
          }),
      ),
    });
  }

  search(e: Event) {
    console.log(e.target);
  }
  render() {
    return ChatListTemplate;
  }
}
