import ButtonTemplate from "./button.hbs?raw";
import { Block, Events } from "../common/block";

interface ButtonProps extends Record<string, unknown> {
  buttonId: string;
  text: string;
  events?: Events
  isDisabled?: boolean
}

export class Button extends Block<ButtonProps> {
  render() {
    return ButtonTemplate;
  }
}
