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

export const getDateFormat = (date: Date) => {
    const today = new Date()

    if (today.getDate() === date.getDate() && today.getMonth() === date.getMonth()) {
        return date.toLocaleTimeString('ru-Ru', { hour: '2-digit', minute: '2-digit' })
    }

    return date.toLocaleDateString('ru-Ru', { month: 'short', day: '2-digit' })
}
