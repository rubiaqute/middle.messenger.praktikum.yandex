import Handlebars from 'handlebars';
import * as Pages from './pages';

import { FormInput, Link, Button } from './components';


Handlebars.registerPartial('FormInput', FormInput);
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Link', Link);

enum Page {
    login='login',
    registration = 'registration',
    profile = 'profile',
    chat = 'chat',
    notFoundError = '404',
    serverError = '500'
}

export default class App {
    private currentPage = Page.login
    private appElement: HTMLElement | null

    constructor() {
        this.appElement = document.getElementById('app');
    }

    private updateCurrentPage(urlPath?: string) {
        const path = urlPath?.replace('/', '') 

        if (path === '/' || !path) {
            this.currentPage = Page.login
        } else {
            this.currentPage = Object.values(Page).includes(path as Page) ? path as Page : Page.notFoundError
        }
    }


    render(urlPath?: string) {
        if (this.appElement) {
            this.updateCurrentPage(urlPath)
            let template;

            switch (this.currentPage) {
                case Page.login: {
                    template = Handlebars.compile(Pages.LoginPage);
                    this.appElement.innerHTML = template({})
                    break;
                }
                case Page.notFoundError: {
                    template = Handlebars.compile(Pages.ErrorPage);
                    this.appElement.innerHTML = template({
                        title: '404',
                        subTitle: 'Не туда попали'
                    })
                    break;
                }
                case Page.serverError: {
                    template = Handlebars.compile(Pages.ErrorPage);
                    this.appElement.innerHTML = template({
                        title: '500',
                        subTitle: 'Мы уже фиксим'
                    })
                    break;
                }
                case Page.registration: {
                    template = Handlebars.compile(Pages.RegistrationPage);
                    this.appElement.innerHTML = template({})
                    break;
                }
                case Page.chat: {
                    template = Handlebars.compile(Pages.ChatPage);
                    this.appElement.innerHTML = template({})
                    break;
                }
                case Page.profile: {
                    template = Handlebars.compile(Pages.ProfilePage);
                    this.appElement.innerHTML = template({})
                    break;
                }
            }

            this.attachEventListeners();
        }
    }
    

    private attachEventListeners() {
        const links = document.querySelectorAll('.link');
        links.forEach(link => link.addEventListener('click', (e) => this.changePage((e.target as HTMLLinkElement).dataset?.page as Page)));

        const formLogin = document.querySelector('#formLogin');
        formLogin?.addEventListener('submit', (e)=> {
            e.preventDefault()
            console.log("Send login")
        })

        const formRegistration = document.querySelector('#formRegistration');
        formRegistration?.addEventListener('submit', (e) => {
            e.preventDefault()
            console.log("Send registration")
        })
    }

    private changePage(page: Page) {
        this.render(page);
    }
}