import ProfileInputTemplate from "./profile-input.hbs?raw";
import { Block, Events } from "../common/block";

interface ProfileInputProps extends Record<string, unknown> {
  name: string;
  label: string;
  type: string;
  error: string;
  isDisabled: boolean;
  events: Events;
  _id: string;
}

export class ProfileInput extends Block<ProfileInputProps> {
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
    return ProfileInputTemplate;
  }
}
