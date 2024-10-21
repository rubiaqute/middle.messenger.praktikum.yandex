import { FetchData } from "../api/api-service";
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

export interface IChatItemRaw extends FetchData {
    id: number,
    title: string,
    avatar: string,
    unread_count: number,
    created_by: number,
    last_message: {
        user: {
            first_name: string,
            second_name: string,
            avatar: string,
            email: string,
            login: string,
            phone: string
        },
        time: string,
        content: string
    }
}

export interface ChatMessage {
    id: number,
    user_id: number,
    chat_id: number,
    type: string,
    time: string,
    content: string,
    is_read: boolean,
    file: null
}

export interface IActiveChat extends FetchData {
    messages: ChatMessage[],
    chatTitle: string
}

export type IStore = {
    profile: {
        profileData: ProfileData,
    },
    chat: {
        chatsList: IChatItemRaw[],
        activeChatToken: string
        activeChat: IActiveChat | null
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
        },
        chat: {
            chatsList: [],
            activeChatToken: '',
            activeChat: null
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
