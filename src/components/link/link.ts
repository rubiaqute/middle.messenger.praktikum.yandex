import Handlebars from 'handlebars';
import LinkTemplate from './link.hbs?raw';
import { Block } from '../common/block';
import { getTemplateContent } from '../../utils/helpers';

interface LinkProps extends Record<string, unknown> {
    isAlert: boolean,
    href: string
    text: string
}

export class Link extends Block<LinkProps> {
    render() {
        const template = Handlebars.compile(LinkTemplate)
        const content = template(this.props)

        return getTemplateContent(content)
    }
}
