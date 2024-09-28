import { Block, Events } from "../../common/block";
import MessageInputTemplate from "./message-input.hbs?raw";

interface MessageInputProps extends Record<string, unknown> {
  value: string;
  error: string;
  events: Events;
  whenSend: () => void;
  _id: string;
}

export class MessageInput extends Block<MessageInputProps> {
  addSpecificEvents() {
    const events = (this.props.events ?? {}) as Events;
    Object.keys(events).forEach((eventName) => {
      Array.from(
        this._element?.getElementsByTagName("input") ?? [],
      )[0].addEventListener(
        eventName,
        events[eventName] as EventListenerOrEventListenerObject,
      );
    });

    Array.from(
      this._element?.getElementsByClassName("send") ?? [],
    )[0].addEventListener(
      "click",
      this.props.whenSend as EventListenerOrEventListenerObject,
    );
  }

  removeSpecificEvents(): void {
    const events = (this.props.events ?? {}) as Events;
    Object.keys(events).forEach((eventName) => {
      Array.from(
        this._element?.getElementsByTagName("input") ?? [],
      )[0]?.removeEventListener(
        eventName,
        events[eventName] as EventListenerOrEventListenerObject,
      );
    });

    Array.from(
      this._element?.getElementsByClassName("send") ?? [],
    )[0]?.removeEventListener(
      "click",
      this.props.whenSend as EventListenerOrEventListenerObject,
    );
  }

  render() {
    return MessageInputTemplate;
  }
}
