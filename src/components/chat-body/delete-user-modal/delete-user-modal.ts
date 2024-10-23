import { ChatController } from "../../../controllers/chat-controller";
import { store } from "../../../utils/store";
import { BasicBlockProps, Block } from "../../common/block";
import { Link } from "../../link";
import DeleteUserModalTemplate from "./delete-user-modal.hbs?raw";

interface DeleteUserModalProps extends Record<string, unknown> {
  whenClose: () => void
}

export class DeleteUserModal extends Block<DeleteUserModalProps> {
  chatController = new ChatController()

  constructor(props: DeleteUserModalProps) {
    super({
      ...props,
      UsersList: store.getState().chat.activeChat?.chatUsers.filter((user) => user.id !== store.getState().profile.profileData.id).map((user, index) => (
        new Link({
          _id: `LinkItem${index}`,
          text: user.login,
          events: {
            click: () => this.deleteUser(user.id)
          }
        })
      ))
    })
  }

  async deleteUser(userId: number) {
    await this.chatController.deleteUserFromChat(userId)
    this.updateContent()
  }

  getUserList() {
    return store.getState().chat.activeChat?.chatUsers.filter((user) => user.id !== store.getState().profile.profileData.id).map(
      (user, index) =>
        new Link({
          _id: `LinkItem${index}`,
          text: user.login,
          events: {
            click: () => this.deleteUser(user.id)
          }
        }),
    )
  }

  updateContent() {
    const usersNodes = this.getUserList()
    this.updateLists('UsersList', usersNodes as unknown as Block<BasicBlockProps>[])


    this.setProps({
      ...this.props,
      _id: 'DeleteUserModal',
    })
  }

  render() {
    return DeleteUserModalTemplate;
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
