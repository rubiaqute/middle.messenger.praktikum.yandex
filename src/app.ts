import Handlebars from 'handlebars';
import * as Pages from './pages';

// Register partials
// import Input from './components/Input.js';
// import Button from './components/Button.js';
// import Select from './components/Select.js';
// import ErrorMessage from './components/ErrorMessage.js';
// import Link from './components/Link.js';
// import Label from './components/Label.js';
// import Footer from './components/Footer.js';

// Handlebars.registerPartial('Input', Input);
// Handlebars.registerPartial('Button', Button);
// Handlebars.registerPartial('Select', Select);
// Handlebars.registerPartial('ErrorMessage', ErrorMessage);
// Handlebars.registerPartial('Link', Link);
// Handlebars.registerPartial('Label', Label);
// Handlebars.registerPartial('Footer', Footer);

enum Page {
    login='login',
    registration = 'registration',
    profile = 'profile',
    chat = 'chat',
    notFoundError = '404',
    serverError = '500'
}

export default class App {
    currentPage = Page.login
    appElement: HTMLElement | null

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
            }

            this.attachEventListeners();
        }
    }
    

    attachEventListeners() {
        const links = document.querySelectorAll('.link');
        links.forEach(link => link.addEventListener('click', (e) => this.changePage((e.target as HTMLLinkElement).dataset?.page as Page)));
    }

    changePage(page: Page) {
        this.render(page);
    }

    // addQuestion() {
    //     const questionInput = document.getElementById('question-input');
    //     if (questionInput.value.trim()) {
    //         this.state.questions.push(questionInput.value);
    //         questionInput.value = '';
    //         this.render();
    //     }
    // }

    // createQuestionnaire() {
    //     if (this.state.questions.length > 0) {
    //         this.state.currentPage = 'answerQuestionnaire';
    //         this.render();
    //     }
    // }

    // submitAnswers() {
    //     alert('Answers submitted!');
    // }
}