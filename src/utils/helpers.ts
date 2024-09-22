import { Block } from "../components/common/block";

export const isDeepEqual = (obj1: object, obj2: object) =>{
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length != keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!keys2.includes(key) || !isDeepEqual(obj1[key as keyof object], obj2[key as keyof object])) {
            return false;
        }
    }

    return true;
}

export function renderInDom<K extends Record<string, unknown>>(query: string, block: Block<K>) {
    const root = document.querySelector(query);

    const content = block.getContent()

    if (content) {
        root?.appendChild(content);
    }


    block.dispatchComponentDidMount();

    return root;
}

export const getTemplateContent = (content: string)=> {
    const templateNode = document.createElement('template')
    templateNode.innerHTML = content

    return templateNode.content
}
