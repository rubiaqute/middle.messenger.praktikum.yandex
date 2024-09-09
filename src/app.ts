import Handlebars from 'handlebars';
import * as Pages from './pages';

import { FormInput, Link, Button, SidePanel, ProfileInput } from './components';
import { profileData } from './mock';


Handlebars.registerPartial('FormInput', FormInput);
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('SidePanel', SidePanel);
Handlebars.registerPartial('ProfileInput', ProfileInput);

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

            switch (this.currentPage) {
                case Page.login: {
                    const template = Handlebars.compile(Pages.LoginPage);
                    this.appElement.innerHTML = template({})
                    break;
                }
                case Page.notFoundError: {
                    const template = Handlebars.compile(Pages.ErrorPage);
                    this.appElement.innerHTML = template({
                        title: '404',
                        subTitle: 'Не туда попали'
                    })
                    break;
                }
                case Page.serverError: {
                    const template = Handlebars.compile(Pages.ErrorPage);
                    this.appElement.innerHTML = template({
                        title: '500',
                        subTitle: 'Мы уже фиксим'
                    })
                    break;
                }
                case Page.registration: {
                    const template = Handlebars.compile(Pages.RegistrationPage);
                    this.appElement.innerHTML = template({})
                    break;
                }
                case Page.chat: {
                    const template = Handlebars.compile(Pages.ChatPage);
                    this.appElement.innerHTML = template({})
                    break;
                }
                case Page.profile: {
                    const template = Handlebars.compile(Pages.ProfilePage);
                    this.appElement.innerHTML = template({
                        profileData,
                        disabled: 'disabled',
                        isWithSaveButton: false,
                    })
                    break;
                }
                case Page.profileEdit: {
                    const template = Handlebars.compile(Pages.ProfilePage);
                    this.appElement.innerHTML = template({
                        profileData,
                        isWithSaveButton: true,
                    })
                    break;
                }
                case Page.profilePassword: {
                    const template = Handlebars.compile(Pages.ProfilePage);
                    this.appElement.innerHTML = template({
                        profileData,
                        isWithSaveButton: true,
                        isChangePasswordMode: true
                    })
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
        })

        const formRegistration = document.querySelector('#formRegistration');
        formRegistration?.addEventListener('submit', (e) => {
            e.preventDefault()
            console.log("Send registration")
        })
    }

}
