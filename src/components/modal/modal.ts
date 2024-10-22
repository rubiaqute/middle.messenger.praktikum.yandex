import ModalTemplate from "./modal.hbs?raw";
import { Block } from "../common/block";

interface ModalProps extends Record<string, unknown> {
  isAlert?: boolean;
  text: string;
  whenClose: () => void
}

export class Modal extends Block<ModalProps> {
  render() {
    return ModalTemplate;
  }

  close() {
    this.props.whenClose()
  }

  override removeSpecificEvents() {
    Array.from(
      this.element?.getElementsByClassName('close') ?? [],
    )[0].removeEventListener(
      'click',
      () => this.close(),
    );
  }

  override addSpecificEvents() {
    Array.from(
      this.element?.getElementsByClassName('close') ?? [],
    )[0].addEventListener(
      'click',
      () => this.close(),
    );
  }
}
