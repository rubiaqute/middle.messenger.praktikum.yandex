import ProfileInputTemplate from "./profile-input.hbs?raw";
import { Events } from "../common/block";
import { Input } from "../common/input";

interface ProfileInputProps extends Record<string, unknown> {
  name: string;
  label: string;
  type: string;
  error: string;
  isDisabled: boolean;
  events: Events;
  _id: string;
}

export class ProfileInput extends Input<ProfileInputProps> {

  render() {
    return ProfileInputTemplate;
  }
}
