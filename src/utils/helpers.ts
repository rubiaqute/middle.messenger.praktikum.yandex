import { Block } from "../components/common/block";

export function renderInDom<K extends Record<string, unknown>>(query: string, block: Block<K>) {
    const root = document.querySelector(query);

    const content = block.getContent()

    if (content) {
        root?.appendChild(content);
    }


    block.dispatchComponentDidMount();

    return root;
}
