import FormInputTemplate from "./form-input.hbs?raw";
import { Events } from "../common/block";
import { Input } from "../common/input";

interface FormInputProps extends Record<string, unknown> {
  name: string;
  label: string;
  type: string;
  error: string;
  events: Events;
  _id: string;
}

export class FormInput extends Input<FormInputProps> {

  render() {
    return FormInputTemplate;
  }
}
