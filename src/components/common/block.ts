import { EventBus } from "../../utils/event-bus";

export interface Events {
    [tag: string]: {
        [eventName: string]: Function
    }
}

export abstract class Block<Props extends Record<string, unknown>>{
    static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_RENDER: "flow:render",
        UPDATE: "flow:component-did-update",

    };

    _element: HTMLElement | null = null;
    _meta: Partial<{
        tagName: string,
        props: Props
    }> | null = null;
    props: Props
    eventBus: ()=>EventBus

    constructor(props:Props, tagName = "div") {
        const eventBus = new EventBus();
        this._meta = {
            tagName,
            props
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
        const events = this.getEvents()

        Object.keys(events).forEach((tag)=> {
            Array.from(this.element?.getElementsByTagName(tag) ?? []).forEach((el) => {
                const eventsTypes = Object.keys(events[tag])

                eventsTypes.forEach((eventType) => el.addEventListener(eventType, events[tag][eventType] as EventListenerOrEventListenerObject))
                })
        })
    }

    _removeEvents() {
        const events = this.getEvents()

        Object.keys(events).forEach((tag) => {
            Array.from(this.element?.getElementsByTagName(tag) ?? []).forEach((el) => {
                const eventsTypes = Object.keys(events[tag])

                eventsTypes.forEach((eventType) => el.removeEventListener(eventType, events[tag][eventType] as EventListenerOrEventListenerObject))
            })
        })
    }

    getContent() {
        return this.element;
    }

    dispatchComponentDidMount() {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
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
    
    componentDidMount () {
        this._addEvents()
    }

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

    setProps = (nextProps :Props)=> {
        if (!nextProps) {
            return;
        }

        Object.assign(this.props, nextProps);
    };

    get element() {
        return this._element;
    }

    _render() {
        const block = this.render();

        if (this._element && block) {
            this._element.appendChild(block)
        }     
    }

    render(): Node | null {
        return null
    }

    _makePropsProxy(props:Props) {
        const self = this

        return new Proxy(props, {
            get(target, prop) {
                const value = target[prop as keyof Props];
                return typeof value === "function" ? value.bind(target) : value;
            },
            set(target, prop, value) {
                target[prop as keyof Props] = value;

                self.eventBus().emit(Block.EVENTS.UPDATE, JSON.parse(JSON.stringify(target)), target);
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
