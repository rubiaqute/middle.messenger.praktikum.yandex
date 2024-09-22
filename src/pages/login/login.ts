import Handlebars from 'handlebars';
import { Block } from "../../components/common/block";
import LoginPageTemplate from './login.hbs?raw';
import { registerButton, registerFormInput, registerLink } from '../../utils/handlebars-helpers';
import { getTemplateContent } from '../../utils/helpers';

type LoginPageForm = {
    login: string,
    password: string
}

export interface  LoginPageProps extends Record<string, unknown> {
    state: {
        values: LoginPageForm
        errors: LoginPageForm
    },
}

const state = {
    values: {
        login: '',
        password: ''
    },
    errors:  {
        login: '',
        password: ''
    }
}

class LoginPage extends Block<LoginPageProps> {
    formValues: LoginPageForm = {
        login: '',
        password: ''
    }


    validate() {
        console.log(this.formValues)
            // this.setProps({
            //     state: {
            //         values: {
            //             ...this.form,
            //         },
            //         errors: {
            //             ...this.props.state.errors,
            //             [key]: ''
            //         }
            //     }
            // })      
    }

    getEvents() {
        return {
                input: {
                    input: (e: Event) => this.changeForm(e),
                    blur: () => this.validate()
                },
                button: {
                    click: (e: Event) => this.submitForm(e),
                }
        }
    }

    submitForm(e: Event): void {
        this.validate()
        e.preventDefault()
    }


    changeForm = (e: Event) => {
        if (e.target instanceof HTMLInputElement) {
            const key = e.target.name as keyof LoginPageForm
            this.formValues[key] = e.target.value
        }
    }

    render() {
        registerFormInput()
        registerButton()
        registerLink()
             
        const template = Handlebars.compile(LoginPageTemplate)
        const content = template(this.props.state)

        return getTemplateContent(content)
    }
}

export const loginPage = new LoginPage({state})
 
