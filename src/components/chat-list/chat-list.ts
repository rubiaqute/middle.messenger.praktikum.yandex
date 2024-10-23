import ChatListTemplate from "./chat-list.hbs?raw";
import { BasicBlockProps, Block } from "../common/block";
import { ChatItem } from "./chat-item";
import { SearchInput } from "../search-input";
import { Link } from "../link";
import { IChatItemRaw, store, StoreEvents } from "../../utils/store";
import { Button } from "../button";
import { deleteFromDom, renderInDom } from "../../utils/helpers";
import { ChatCreate } from "./chat-create";
import { ChatController } from "../../controllers/chat-controller";
import { Page, router } from "../../app";

export interface ChatListProps extends BasicBlockProps {
  _id: string;
  chatList: IChatItemRaw[];
  whenClickItem: (id: number) => void;
}

export class ChatList extends Block<ChatListProps> {
  chatController = new ChatController()

  constructor(props: ChatListProps) {
    super({
      ...props,
      Button: new Button({
        _id: 'createChat',
        buttonId: 'createChat',
        text: 'Создать чат',
        events: {
          click: () => this.createChat()
        }
      }),
      Link: new Link({
        _id: "Link",
        events: {
          click: () => router.go(Page.settings)
        },
        text: "Профиль >",
      }),
      SearchInput: new SearchInput({
        _id: "SearchInput",
        value: "",
        events: {
          change: (e: Event) => this.search(e),
        },
      }),
      ChatList: []
    });

    store.on(StoreEvents.Updated, () => {
      const chatList = store.getState().chat.chatsList
      const chatsNodes = chatList.map(
        (chatItem) => {
          return new ChatItem({
            _id: `ChatItem${chatItem.id}`,
            lastMessage: {
              isSelf: chatItem?.last_message?.user?.login === store.getState().profile.profileData.login,
              time: chatItem?.last_message?.time,
              text: chatItem?.last_message?.content
            },
            id: chatItem.id,
            name: chatItem.title,
            unreadCount: chatItem.unread_count,
            events: {
              click: () => props.whenClickItem(chatItem.id),
            },
          })
        })

      this.updateLists('chatList', chatsNodes as unknown as Block<BasicBlockProps>[])

      this.setProps({
        ...this.props,
        _id: 'ChatList',
        chatList,
      })
    });
  }


  createChat() {
    const modal = new ChatCreate({
      whenCreateChat: async (title) => {
        const isSucces = await this.chatController.createChat(title);
        if (isSucces) {
          deleteFromDom('.app', modal)
        }
      },
      whenClose: () => deleteFromDom('.app', modal)
    })

    renderInDom('.app', modal)
  }

  search(e: Event) {
    console.log(e.target);
  }

  render() {
    return ChatListTemplate;
  }
}
