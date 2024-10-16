import { BasicBlockProps, Block } from "../components/common/block";

function render(query: string, block: Block<BasicBlockProps>) {
    const root = document.getElementById(query);
    if (root) {
        root.appendChild(block.getContent());
    }

    return root;
}

function unMount(query: string, block: Block<BasicBlockProps>) {
    const root = document.getElementById(query);
    if (root) {
        root.removeChild(block.getContent());
    }

    return root;
}

export class Route {
    _pathname: string
    _blockClass: typeof Block<BasicBlockProps>
    _props: BasicBlockProps
    _block: Block<BasicBlockProps> | null

    constructor(pathname: string, view: typeof Block<BasicBlockProps>, props: BasicBlockProps) {
        this._pathname = pathname;
        this._blockClass = view;
        this._block = null;
        this._props = props;
    }

    navigate(pathname: string) {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }

    leave() {
        if (this._block) {
            unMount(this._props.rootQuery as string, this._block)
        }

    }

    match(pathname: string) {
        return pathname === this._pathname;
    }

    render() {
        if (!this._block) {
            this._block = new this._blockClass({});
            render(this._props.rootQuery as string, this._block);
            return;
        }
    }
}

export class Router {
    static __instance: Router;
    routes: Route[] = []
    history: History
    _rootQuery: string
    _currentRoute: Route | null

    constructor(rootQuery: string) {
        this.routes = [];
        this.history = window.history;
        this._currentRoute = null;
        this._rootQuery = rootQuery;
        if (Router.__instance) {
            return Router.__instance;
        }

        Router.__instance = this;
    }

    use(pathname: string, block: typeof Block<BasicBlockProps>) {
        const route = new Route(pathname, block, { rootQuery: this._rootQuery });
        this.routes.push(route);
        return this
    }

    start() {
        window.onpopstate = (event: PopStateEvent) => {
            this._onRoute((event.currentTarget as Window).location.pathname);
        };

        this._onRoute(window.location.pathname);
    }

    _onRoute(pathname: string) {
        const route = this.getRoute(pathname);

        if (this._currentRoute) {
            this._currentRoute.leave();
        }

        if (route) {
            this._currentRoute = route;
            route.render();
        }

    }

    go(pathname: string) {
        this.history.pushState({}, "", pathname);
        this._onRoute(pathname);
    }

    back() {
        this.history.back()
    }

    forward() {
        this.history.forward()
    }

    getRoute(pathname: string) {
        return this.routes.find(route => route.match(pathname));
    }
}
