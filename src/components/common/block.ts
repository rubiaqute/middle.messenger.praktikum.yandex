import { EventBus } from "../../utils/event-bus";
import Handlebars from 'handlebars';

export interface Events {
    [eventName: string]: Function
}

export type BasicBlockProps = Record<string, unknown>
export type ChildProps = Block<{ _id: string, [key: string]: unknown }>

export abstract class Block<Props extends BasicBlockProps>{
    static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_RENDER: "flow:render",
        UPDATE: "flow:component-did-update",
    };

    private children: Record<string, ChildProps> = {}
    private lists: Record<string, Block<BasicBlockProps>[]> = {};

    _element: HTMLElement | null = null;
    _meta: Partial<{
        tagName: string,
        props: BasicBlockProps
    }> | null = null;
    props: BasicBlockProps
    eventBus: ()=>EventBus

    constructor(propsWithChildren: BasicBlockProps, tagName = "div") {

        const { props, children, lists } = this._getChildrenPropsAndProps(propsWithChildren);
        this.props = this._makePropsProxy(props);
        this.children = children;
        this.lists = lists;
        const eventBus = new EventBus();

        this._meta = {
            tagName,
            props: propsWithChildren
        };


        this.props = this._makePropsProxy(props);

        this.eventBus = () => eventBus;

        this._registerEvents(eventBus);
        eventBus.emit(Block.EVENTS.INIT);
    }

    _registerEvents(eventBus: EventBus) {
        eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
        eventBus.on(Block.EVENTS.UPDATE, this._componentDidUpdate.bind(this));
    }

    _addEvents() {
        const events = (this.props.events ?? {}) as Events
        Object.keys(events).forEach((eventName)=> {
            this._element?.addEventListener(eventName, events[eventName] as EventListenerOrEventListenerObject)
        })

        this.addSpecificEvents()
    }

    addSpecificEvents(){}

    _removeEvents() {
        const events = (this.props.events ?? {}) as Events
        Object.keys(events).forEach((eventName) => {
            this._element?.addEventListener(eventName, events[eventName] as EventListenerOrEventListenerObject)
        })

        this.removeSpecificEvents()
    }

   removeSpecificEvents() { }

    public getContent(): HTMLElement {
        if (!this._element) {
            throw new Error('Element is not created');
        }
        return this._element;
    }

    dispatchComponentDidMount() {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }

    updateLists(key: string, newList: Block<BasicBlockProps>[]) {
        this.lists[key] = newList
    }

    getEvents(): Events {
        return {}
    }

    _createResources() {
        const tagName = this._meta?.tagName;

        if (tagName) {
            this._element = this._createDocumentElement(tagName);
        }
    }

    init() {
        this._createResources();
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    _componentDidMount() {
        this.componentDidMount()
    }
    
    componentDidMount () {}

    _componentDidUpdate(oldProps: Props, newProps: Props) {
        const response = this.componentDidUpdate(oldProps, newProps);
        if (!response) {
            return;
        }
        if (this.element) {
            this.element.innerHTML = ''
            this._removeEvents
        }

        this._render();
        this.dispatchComponentDidMount()
    }

    componentDidUpdate(oldProps: Props, newProps: Props) {
        return true
    }

    setProps = (nextProps: Props)=> {
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

    private _getChildrenPropsAndProps(propsAndChildren: BasicBlockProps): {
        children: Record<string, ChildProps>,
        props: BasicBlockProps,
        lists: Record<string, Block<BasicBlockProps>[]>
    } {
        const children: Record<string, ChildProps> = {};
        const props: BasicBlockProps = {};
        const lists: Record<string, Block<BasicBlockProps>[]> = {};

        Object.entries(propsAndChildren).forEach(([key, value]) => {
            if (value instanceof Block) {
                children[key] = value;
            } else if (Array.isArray(value) && value.every((item)=> item instanceof Block)) {
                lists[key] = value;
            } else {
                props[key] = value;
            }
        });

        return { children, props, lists };
    }

    

    _render() {
        const propsAndStubs: Record<string, unknown> = { ...this.props };
        const _tmpId = Math.floor(100000 + Math.random() * 900000);

        Object.entries(this.children).forEach(([key, child]) => {
            propsAndStubs[key] = `<div data-id="${child.props._id}"></div>`;
        });

        Object.entries(this.lists).forEach(([key]) => {
            propsAndStubs[key] = `<div data-id="__l_${_tmpId}"></div>`;
        });

        const fragment = this._createDocumentElement('template') as HTMLTemplateElement;
        const template = Handlebars.compile(this.render())
        fragment.innerHTML = template(propsAndStubs);

        Object.values(this.children).forEach(child => {
            const stub = fragment.content.querySelector(`[data-id="${child.props._id}"]`);
            if (stub) {
                stub.replaceWith(child.getContent());
            }
        });

        Object.entries(this.lists).forEach(([, child]) => {
            const listCont = this._createDocumentElement('template') as HTMLTemplateElement;

            child.forEach(item => {
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

    render(): string {
        return ''
    }

    _makePropsProxy(props: BasicBlockProps) {
        const self = this

        return new Proxy(props, {
            get(target, prop) {
                const value = target[prop as keyof BasicBlockProps];
                return typeof value === "function" ? value.bind(target) : value;
            },
            set(target, prop, value) {
                target[prop as keyof BasicBlockProps] = value;

                self.eventBus().emit(Block.EVENTS.UPDATE, target, target);
                return true;
            },
            deleteProperty() {
                throw new Error("Нет доступа");
            }
        });
        

        
    }

    _createDocumentElement(tagName: string) {
        return document.createElement(tagName);
    }

    show() {
        if (this.element) {
            this.element.style.display = "block";
        }
    }

    hide() {
        if (this.element) {
            this.element.style.display = "none";
        }
    }
}
