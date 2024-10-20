import { BasicBlockProps, Block } from "../components/common/block";
import { ProfileData } from "../pages/profile/utils";
import { EventBus } from "./event-bus";
import set from "./helpers";

export function connect<T>(Component: typeof Block<BasicBlockProps>, mapStateToProps: (state: IStore) => T) {
    return class extends Component {
        constructor(props: BasicBlockProps) {
            super({ ...props, ...mapStateToProps(store.getState()) });

            store.on(StoreEvents.Updated, () => {
                this.setProps({ ...props, ...mapStateToProps(store.getState()) } as BasicBlockProps);
            });
        }
    }
}

export enum StoreEvents {
    Updated = 'updated',
}

export type IStore = {
    profile: {
        profileData: ProfileData,
        avatarUrl: string
    }
}

class Store extends EventBus {
    private state: IStore = {
        profile: {
            profileData: {
                first_name: '',
                second_name: '',
                display_name: null,
                login: '',
                avatar: null,
                email: '',
                phone: ''
            },
            avatarUrl: ''
        }
    };

    public getState() {
        return this.state;
    }

    public set(path: string, value: unknown) {
        set(this.state, path, value);

        this.emit(StoreEvents.Updated);
    };
}

export const store = new Store()
