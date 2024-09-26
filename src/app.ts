import Handlebars from 'handlebars';
import * as Pages from './pages';
import './pages/error/error.pcss';

import { profileData } from './mock';
import { ErrorPage, ErrorPageProps, loginPage, ProfilePage, ProfilePageProps, registrationPage } from './pages';
import { renderInDom } from './utils/helpers';
import { BasicBlockProps } from './components/common/block';


enum Page {
    login='login',
    registration = 'registration',
    profile = 'profile',
    chat = 'chat',
    notFoundError = '404',
    serverError = '500',
    profileEdit="profile-edit",
    profilePassword="profile-password"
}

export default class App {
    private currentPage = Page.login
    private appElement: HTMLElement | null

    constructor() {
        this.appElement = document.getElementById('app');
    }

    private updateCurrentPage(urlPath?: string) {
        const path = urlPath?.replace('/', '') 

        if (!path) {
            this.currentPage = Page.login
        } else {
            this.currentPage = Object.values(Page).includes(path as Page) ? path as Page : Page.notFoundError
        }
    }

    render(urlPath?: string) {
        if (this.appElement) {
            this.updateCurrentPage(urlPath)
            this.appElement.innerHTML = ''

            switch (this.currentPage) {
                case Page.login: {
                    renderInDom<BasicBlockProps>(".app", loginPage);

                    break;
                }
                case Page.notFoundError: {
                    const page = new ErrorPage({
                        title: '404',
                        subTitle: 'Не туда попали'
                    })

                    if (page) {
                        renderInDom<ErrorPageProps>(".app", page);
                    }
                    break;
                }
                case Page.serverError: {
                    const page = new ErrorPage({
                        title: '500',
                        subTitle: 'Мы уже фиксим'
                    })

                    if (page) {
                        renderInDom<ErrorPageProps>(".app", page);
                    }
                    break;
                }
                case Page.registration: {
                    renderInDom<BasicBlockProps>(".app", registrationPage);
                    break;
                }
                case Page.chat: {
                    const template = Handlebars.compile(Pages.ChatPage);
                    this.appElement.innerHTML = template({})
                    break;
                }
                case Page.profile: {
                    const page = new ProfilePage({
                        profileData,
                        pageMode: 'basic'
                    })

                    renderInDom<ProfilePageProps>(".app", page);
                    break;
                }
                case Page.profileEdit: {
                    const page = new ProfilePage({
                        profileData,
                        pageMode: 'edit'
                    })

                    renderInDom<ProfilePageProps>(".app", page);
                    break;
                }
                case Page.profilePassword: {
                    const page = new ProfilePage({
                        profileData,
                        pageMode: 'changePassword'
                    })

                    renderInDom<ProfilePageProps>(".app", page);
                    break;
                }
            }

            this.attachEventListeners();
        }
    }
    

    private attachEventListeners() {
        const formLogin = document.querySelector('#formLogin');
        formLogin?.addEventListener('submit', (e) => {
            e.preventDefault()
            console.log("Send login")
            window.location.pathname = `/${Page.chat}`
        })

        const formRegistration = document.querySelector('#formRegistration');
        formRegistration?.addEventListener('submit', (e) => {
            e.preventDefault()
            console.log("Send registration")
            window.location.pathname = `/${Page.login}`
        })

        const formProfile = document.querySelector('#formProfile');
        formProfile?.addEventListener('submit', (e) => {
            e.preventDefault()
            console.log("Save profile")
            window.location.pathname = `/${Page.profile}`
        })
    }

}
