import Handlebars from 'handlebars';
import FormInputTemplate from './form-input.hbs?raw';
import { Block } from '../common/block';
import { getTemplateContent } from '../../utils/helpers';

interface FormInputProps extends Record <string, unknown> {
    name: string,
    label: string
    type: string
    error: string
}

export class FormInput extends Block<FormInputProps> {
    render() {
        const template = Handlebars.compile(FormInputTemplate)
        const content = template(this.props)

        return getTemplateContent(content)
    }

}
