import LinkTemplate from "./link.hbs?raw";
import { Block, Events } from "../common/block";

interface LinkProps extends Record<string, unknown> {
  isAlert?: boolean;
  href?: string;
  text: string;
  events?: Events
}

export class Link extends Block<LinkProps> {
  render() {
    return LinkTemplate;
  }
}
