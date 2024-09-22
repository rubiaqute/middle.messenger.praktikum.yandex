import { Button, FormInput, Link } from "../components"
import Handlebars from 'handlebars';

export const registerFormInput = ()=> {
    Handlebars.registerHelper('FormInput', ({ hash }) => {
    const inputBlock = new FormInput({
        type: hash.type,
        label: hash.label,
        name: hash.name,
        value: hash.value,
        error: hash.error
    })

    return inputBlock.element?.innerHTML
    })
}

export const registerButton = () => {
    Handlebars.registerHelper('Button', ({ hash }) => {
        const button = new Button({
            text: hash.text,
            buttonId: hash.buttonId,
        })

        return button.element?.innerHTML
    })
}

export const registerLink = () => {
    Handlebars.registerHelper('Link', ({ hash }) => {
        const link = new Link({
            text: hash.text,
            href: hash.href,
            isAlert: hash.isAlert
        })

        return link.element?.innerHTML
    })
}
