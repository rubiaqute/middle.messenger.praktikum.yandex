import { ChatController } from "../../../controllers/chat-controller";
import { IChatUser } from "../../../utils/store";
import { Button } from "../../button";
import { BasicBlockProps, Block } from "../../common/block";
import { FormInput } from "../../form-input";
import { Link } from "../../link";
import AddUserModalTemplate from "./add-user-modal.hbs?raw";

interface AddUserModalProps extends Record<string, unknown> {
  whenClose: () => void
}

export class AddUserModal extends Block<AddUserModalProps> {
  chatController = new ChatController()
  searchInputValue = ''

  constructor(props: AddUserModalProps) {
    super({
      ...props,
      Button: new Button({
        _id: 'searchUserButton',
        buttonId: "searchUserButton",
        text: "Поиск",
        events: {
          click: () => this.searchUsers()
        }
      }),
      UsersList: [],
      TitleInput: new FormInput({
        _id: "TitleInput",
        name: "title",
        label: "Поиск по login",
        type: "text",
        value: "",
        error: "",
        events: {
          input: (e: Event) => this.changeQuery(e),
        },
      })
    })
  }

  async changeQuery(e: Event) {
    if (e.target instanceof HTMLInputElement) {
      this.searchInputValue = e.target.value;
    }
  }

  async searchUsers() {
    if (this.searchInputValue) {
      const users = await this.chatController.searchUsers(this.searchInputValue) as IChatUser[]

      const usersNodes = users.map(
        (user, index) =>
          new Link({
            _id: `LinkItem${index}`,
            text: user.login,
            events: {
              click: () => this.addUser(user.id)
            }
          }),
      )

      this.updateLists('UsersList', usersNodes as unknown as Block<BasicBlockProps>[])


      this.setProps({
        ...this.props,
        _id: 'AddUserModal',
      })
    }
  }

  async addUser(userId: number) {
    await this.chatController.addUserToChat(userId)
  }

  render() {
    return AddUserModalTemplate;
  }

  close() {
    this.props.whenClose()
  }

  override removeSpecificEvents() {
    Array.from(
      this.element?.getElementsByClassName('close') ?? [],
    )[0].removeEventListener(
      'click',
      () => this.close(),
    );
  }

  override addSpecificEvents() {
    Array.from(
      this.element?.getElementsByClassName('close') ?? [],
    )[0].addEventListener(
      'click',
      () => this.close(),
    );
  }
}
