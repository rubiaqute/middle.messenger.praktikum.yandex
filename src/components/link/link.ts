import LinkTemplate from './link.hbs?raw';
import { Block } from '../common/block';

interface LinkProps extends Record<string, unknown> {
    isAlert?: boolean,
    href: string
    text: string
}

export class Link extends Block<LinkProps> {
    render() {
        return LinkTemplate
    } 
}
