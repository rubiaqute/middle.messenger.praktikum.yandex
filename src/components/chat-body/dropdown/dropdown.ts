import { BasicBlockProps, Block } from "../../common/block";
import DropdownTemplate from "./dropdown.hbs?raw";

// interface MessageInputProps extends Record<string, unknown> {
//   value: string;
//   error: string;
//   events: Events;
//   whenSend: (e: Event) => void;
//   _id: string;
// }

export class Dropdown extends Block<BasicBlockProps> {

  render() {
    return DropdownTemplate;
  }
}
