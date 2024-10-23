import AvatarTemplate from "./avatar.hbs?raw";
import { Input } from "../common/input";
import { Events } from "../common/block";

interface AvatarProps extends Record<string, unknown> {
  avatarUrl: string;
  events?: Events
  isSmall?: boolean
  isStatic?: boolean
  avatarId: string
}

export class Avatar extends Input<AvatarProps> {

  render() {
    return AvatarTemplate;
  }
}
