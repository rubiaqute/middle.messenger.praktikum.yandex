import { Block, Events } from "../../common/block";
import DropdownContentItemTemplate from "./dropdown-content-item.hbs?raw";

interface DropdownContentItemProps extends Record<string, unknown> {
  text: string;
  events: Events;
}

export class DropdownContentItem extends Block<DropdownContentItemProps> {

  render() {
    return DropdownContentItemTemplate;
  }
}
