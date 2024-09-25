import ButtonTemplate from './button.hbs?raw';
import { Block } from '../common/block';

interface ButtonProps extends Record<string, unknown> {
    buttonId: string,
    text: string
}

export class Button extends Block<ButtonProps> {
    render() {
        return ButtonTemplate
    }

}
