import Handlebars from 'handlebars';
import { Block } from "../../components/common/block";
import ErrorPageTemplate from './error.hbs?raw';
import { getTemplateContent } from '../../utils/helpers';
import { registerLink } from '../../utils/handlebars-helpers';

interface ErrorPageProps extends Record<string, unknown>  {
    title: string,
    subTitle: string,
}

export class ErrorPage extends Block<ErrorPageProps> {
    render() {
        registerLink()
        
        const template = Handlebars.compile(ErrorPageTemplate)
        const content = template(this.props)

        return getTemplateContent(content)
    }
}
