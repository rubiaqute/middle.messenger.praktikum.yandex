import { EventBus } from "../../utils/event-bus";
import Handlebars from "handlebars";

export interface Events {
  [eventName: string]: (...args: never) => unknown;
}

export type BasicBlockProps = Record<string, unknown>;

type ChildProps = BasicBlockProps & {
  _id: string
}
type Children = Block<ChildProps>

export abstract class Block<Props extends BasicBlockProps> {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_RENDER: "flow:render",
    UPDATE: "flow:component-did-update",
  };

  private children: Record<string, Children> = {};
  private lists: Record<string, Block<BasicBlockProps>[]> = {};

  private _element: HTMLElement | null = null;
  private _meta: Partial<{
    tagName: string;
    props: BasicBlockProps;
  }> | null = null;
  public props: Props;
  eventBus: () => EventBus;

  constructor(propsWithChildren: Props, tagName = "div") {
    const { props, children, lists } = this._getChildrenPropsAndProps(propsWithChildren);
    this.props = this._makePropsProxy(props);
    this.children = children;
    this.lists = lists;
    const eventBus = new EventBus();

    this._meta = {
      tagName,
      props: propsWithChildren,
    };

    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    eventBus.on(Block.EVENTS.UPDATE, this._componentDidUpdate.bind(this));
  }

  private _addEvents() {
    const events = (this.props.events ?? {}) as Events;
    Object.keys(events).forEach((eventName) => {
      this._element?.addEventListener(
        eventName,
        events[eventName] as EventListenerOrEventListenerObject,
      );
    });

    this.addSpecificEvents();
  }

  public addSpecificEvents() {}

  private _removeEvents() {
    const events = (this.props.events ?? {}) as Events;
    Object.keys(events).forEach((eventName) => {
      this._element?.addEventListener(
        eventName,
        events[eventName] as EventListenerOrEventListenerObject,
      );
    });

    this.removeSpecificEvents();
  }

  public removeSpecificEvents() {}

  public getContent(): HTMLElement {
    if (!this._element) {
      throw new Error("Element is not created");
    }
    return this._element;
  }

  public dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  public updateLists(key: string, newList: Block<BasicBlockProps>[]) {
    this.lists[key] = newList;
  }

  private _createResources() {
    const tagName = this._meta?.tagName;

    if (tagName) {
      this._element = this._createDocumentElement(tagName);
    }
  }

  public init() {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount() {
    this.componentDidMount();
  }

  public componentDidMount() {}

  private _componentDidUpdate() {
    if (this.element) {
      this._removeEvents();
      this.element.innerHTML = "";
    }

    this._render();
    this.dispatchComponentDidMount();
  }

  public setProps = (nextProps: Props) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  get element() {
    return this._element;
  }

  get childrenNodes() {
    return this.children;
  }

  private _getChildrenPropsAndProps(propsAndChildren: Props): {
    children: Record<string, Children>;
    props: Props;
    lists: Record<string, Block<BasicBlockProps>[]>;
  } {
    const children: Record<string, Children> = {};
    const props: BasicBlockProps = {}
    const lists: Record<string, Block<BasicBlockProps>[]> = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else if (
        Array.isArray(value) &&
        value.every((item) => item instanceof Block)
      ) {
        lists[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props: props as Props, lists };
  }

  private _render() {
    const propsAndStubs: Record<string, unknown> = { ...this.props };
    const _tmpId = Math.floor(Math.random() * 100000);

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child.props._id}"></div>`;
    });

    Object.entries(this.lists).forEach(([key]) => {
      propsAndStubs[key] = `<div data-id="__l_${_tmpId}"></div>`;
    });

    const fragment = this._createDocumentElement(
      "template",
    ) as HTMLTemplateElement;
    const template = Handlebars.compile(this.render());
    fragment.innerHTML = template(propsAndStubs);

    Object.values(this.children).forEach((child) => {
      const stub = fragment.content.querySelector(
        `[data-id="${child.props._id}"]`,
      );
      if (stub) {
        stub.replaceWith(child.getContent());
      }
    });

    Object.entries(this.lists).forEach(([, child]) => {
      const listCont = this._createDocumentElement(
        "template",
      ) as HTMLTemplateElement;

      child.forEach((item) => {
        if (item instanceof Block) {
          listCont.content.append(item.getContent());
        } else {
          listCont.content.append(`${item}`);
        }
      });

      const stub = fragment.content.querySelector(`[data-id="__l_${_tmpId}"]`);

      if (stub) {
        stub.replaceWith(listCont.content);
      }
    });

    const newElement = fragment.content.firstElementChild as HTMLElement;

    if (this._element && newElement) {
      this._element.replaceWith(newElement);
    }

    this._element = newElement;
    this._addEvents();
  }

  public render(): string {
    return "";
  }

  private _makePropsProxy(props: Props) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    return new Proxy(props, {
      get(target, prop) {
        const value = target[prop as keyof BasicBlockProps];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target, prop, value) {
        target[prop as keyof Props] = value;

        self.eventBus().emit(Block.EVENTS.UPDATE, target, target);
        return true;
      },
      deleteProperty() {
        throw new Error("Нет доступа");
      },
    });
  }

  private _createDocumentElement(tagName: string) {
    return document.createElement(tagName);
  }

  public show() {
    if (this.element) {
      this.element.style.display = "block";
    }
  }

  public hide() {
    if (this.element) {
      this.element.style.display = "none";
    }
  }
}
