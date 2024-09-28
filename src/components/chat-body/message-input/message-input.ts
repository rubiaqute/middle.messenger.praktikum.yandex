import { Events } from "../../common/block";
import { Input } from "../../common/input";
import MessageInputTemplate from "./message-input.hbs?raw";

interface MessageInputProps extends Record<string, unknown> {
  value: string;
  error: string;
  events: Events;
  whenSend: () => void;
  _id: string;
}

export class MessageInput extends Input<MessageInputProps> {
  addSpecificEvents() {
    super.addSpecificEvents()

    Array.from(
      this.element?.getElementsByClassName("send") ?? [],
    )[0].addEventListener(
      "click",
      this.props.whenSend as EventListenerOrEventListenerObject,
    );
  }

  removeSpecificEvents(): void {
    super.removeSpecificEvents()

    Array.from(
      this.element?.getElementsByClassName("send") ?? [],
    )[0]?.removeEventListener(
      "click",
      this.props.whenSend as EventListenerOrEventListenerObject,
    );
  }

  render() {
    return MessageInputTemplate;
  }
}
