import { Button } from "../../button";
import { Block } from "../../common/block";
import { FormInput } from "../../form-input";
import ChatCreateTemplate from "./chat-create.hbs?raw";

interface ChatCreateProps extends Record<string, unknown> {
  whenCreateChat: (title: string) => void
  whenClose: () => void
}

export class ChatCreate extends Block<ChatCreateProps> {
  title = ''
  constructor(props: ChatCreateProps) {
    super({
      ...props,
      Button: new Button({
        _id: 'confirmCreateButton',
        buttonId: "confirmCreateButton",
        text: "Создать",
        isDisabled: true,
        events: {
          click: () => props.whenCreateChat(this.title)
        }
      }),
      TitleInput: new FormInput({
        _id: "TitleInput",
        name: "title",
        label: "Название чата",
        type: "text",
        value: "",
        error: "",
        events: {
          change: (e: Event) => this.changeTitle(e),
        },
      })
    })
  }

  changeTitle(e: Event) {
    if (e.target instanceof HTMLInputElement) {
      this.title = e.target.value;

      if (this.title) {
        this.childrenNodes.Button.setProps({
          ... this.childrenNodes.Button.props,
          isDisabled: false
        })
      }
    }
  }

  render() {
    return ChatCreateTemplate;
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
