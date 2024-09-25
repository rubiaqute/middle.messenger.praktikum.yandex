import SidePanelTemplate from './side-panel.hbs?raw';
import { BasicBlockProps, Block } from '../common/block';

export class SidePanel extends Block<BasicBlockProps> {
    render() {
        return SidePanelTemplate
    }
}
