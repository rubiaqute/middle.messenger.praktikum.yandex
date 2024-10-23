import { ChatController } from "../../../controllers/chat-controller";
import { deleteFromDom, renderInDom } from "../../../utils/helpers";
import { store } from "../../../utils/store";
import { BasicBlockProps, Block } from "../../common/block";
import { AddUserModal } from "../add-user-modal";
import { DeleteUserModal } from "../delete-user-modal";
import { DropdownContentItem } from "../dropdown-content-item";
import DropdownTemplate from "./dropdown.hbs?raw";

export class Dropdown extends Block<BasicBlockProps> {
  chatController = new ChatController()

  constructor() {
    super({
      DropdownAddUser: new DropdownContentItem({
        text: "Добавить пользователя",
        events: {
          click: () => this.clickAddUser()
        }
      }),
      DropdownDeleteChat: new DropdownContentItem({
        text: "Удалить чат",
        events: {
          click: () => this.deleteChat()
        }
      }),
      DropdownDeleteUser: new DropdownContentItem({
        text: "Удалить пользователя",
        events: {
          click: () => this.clickDeleteUser()
        }
      }),
    })
  }

  async deleteChat() {
    const activeChatId = store.getState().chat.activeChat?.chatId
    if (activeChatId) {
      const isSucces = await this.chatController.deleteChat(activeChatId)

      if (isSucces) {
        store.set('chat.activeChatToken', null)
        store.set('chat.activeChat', null)
      }
    }
  }

  clickAddUser() {
    const modal = new AddUserModal({
      whenClose: () => deleteFromDom('.app', modal)
    })

    renderInDom('.app', modal)
  }

  clickDeleteUser() {
    const modal = new DeleteUserModal({
      whenClose: () => deleteFromDom('.app', modal)
    })

    renderInDom('.app', modal)
  }

  render() {
    return DropdownTemplate;
  }
}
