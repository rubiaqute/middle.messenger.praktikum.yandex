import AvatarTemplate from './avatar.hbs?raw';
import { BasicBlockProps, Block } from '../common/block';

export class Avatar extends Block<BasicBlockProps> {
    render() {
        return AvatarTemplate
    }
}
