import FormInputTemplate from "./form-input.hbs?raw";
import { Block, Events } from "../common/block";

interface FormInputProps extends Record<string, unknown> {
  name: string;
  label: string;
  type: string;
  error: string;
  events: Events;
  _id: string;
}

export class FormInput extends Block<FormInputProps> {
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
  }

  render() {
    return FormInputTemplate;
  }
}
