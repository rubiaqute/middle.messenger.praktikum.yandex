import { Block } from "../components/common/block";

export function renderInDom<K extends Record<string, unknown>>(
  query: string,
  block: Block<K>,
) {
  const root = document.querySelector(query);

  const content = block.getContent();

  if (content) {
    root?.appendChild(content);
  }

  block.dispatchComponentDidMount();

  return root;
}

export const getDateFormat = (date: Date) => {
  const today = new Date();

  if (
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth()
  ) {
    return date.toLocaleTimeString("ru-Ru", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("ru-Ru", { month: "short", day: "2-digit" });
};

export function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
  if (typeof path !== 'string') {
    throw new Error('path must be string')
  }
  if (typeof object !== 'object') {
    return object
  }

  const source = path.split('.').reduceRight((acc, cur) => {
    return {
      [cur]: acc
    }
  }, value)

  return merge(object as Indexed, source as Indexed)

}

type Indexed<T = any> = {
  [key in string]: T;
};

function merge(lhs: Indexed, rhs: Indexed): Indexed {
  for (let p in rhs) {
    if (!rhs.hasOwnProperty(p)) {
      continue;
    }

    try {
      if (rhs[p].constructor === Object) {
        rhs[p] = merge(lhs[p] as Indexed, rhs[p] as Indexed);
      } else {
        lhs[p] = rhs[p];
      }
    } catch (e) {
      lhs[p] = rhs[p];
    }
  }

  return lhs;
}

export default set
