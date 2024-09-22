import Handlebars from 'handlebars';
import ButtonTemplate from './button.hbs?raw';
import { Block } from '../common/block';
import { getTemplateContent } from '../../utils/helpers';

interface ButtonProps extends Record<string, unknown> {
    buttonId: string,
    text: string
}

export class Button extends Block<ButtonProps> {
    render() {
        const template = Handlebars.compile(ButtonTemplate)
        const content = template(this.props)

        return getTemplateContent(content)
    }

}
