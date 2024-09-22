import Handlebars from 'handlebars';
import * as Pages from './pages';
import './pages/error/error.pcss';

import { SidePanel, ProfileInput, Avatar } from './components';
import { profileData } from './mock';
import { ErrorPage, loginPage } from './pages';
import {  renderInDom } from './utils/helpers';
import { LoginPageProps } from './pages/login/login';

Handlebars.registerPartial('SidePanel', SidePanel);
Handlebars.registerPartial('ProfileInput', ProfileInput);
Handlebars.registerPartial('Avatar', Avatar);

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
                    renderInDom<LoginPageProps>(".app", loginPage);

                    break;
                }
                case Page.notFoundError: {
                    const page = new ErrorPage({
                        title: '404',
                        subTitle: 'Не туда попали'
                    }).element

                    if (page) {
                        this.appElement.appendChild(page)
                    }
                    break;
                }
                case Page.serverError: {
                    const page = new ErrorPage({
                        title: '500',
                        subTitle: 'Мы уже фиксим'
                    }).element

                    if (page) {
                        this.appElement.appendChild(page)
                    }
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
