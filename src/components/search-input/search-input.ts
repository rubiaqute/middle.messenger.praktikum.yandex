import SearchInputTemplate from "./search-input.hbs?raw";
import { Block, Events } from "../common/block";

interface SearchInputProps extends Record<string, unknown> {
  value: string;
  events: Events;
  _id: string;
}

export class SearchInput extends Block<SearchInputProps> {
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
    return SearchInputTemplate;
  }
}
