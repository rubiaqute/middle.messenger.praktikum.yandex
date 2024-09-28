import { BasicBlockProps, Block } from "../../components/common/block";
import LoginPageTemplate from "./login.hbs?raw";
import { Button, FormInput, Link } from "../../components";
import { validateLogin, validatePassword } from "../../utils/validation";

enum FormInputs {
  FormInputLogin = "FormInputLogin",
  FormInputPassword = "FormInputPassword",
}

type LoginPageForm = Record<FormInputs, string>;

class LoginPage extends Block<BasicBlockProps> {
  formValues: LoginPageForm = {
    [FormInputs.FormInputLogin]: "",
    [FormInputs.FormInputPassword]: "",
  };

  constructor() {
    super({
      [FormInputs.FormInputLogin]: new FormInput({
        _id: "FormInputLogin",
        name: "login",
        label: "Логин",
        type: "text",
        value: "",
        error: "",
        events: {
          change: (e: Event) => this.changeForm(e, FormInputs.FormInputLogin),
          blur: (e: Event) => this.validate(e, FormInputs.FormInputLogin),
        },
      }),
      [FormInputs.FormInputPassword]: new FormInput({
        _id: "FormInputPassword",
        name: "password",
        label: "Пароль",
        type: "password",
        value: "",
        error: "",
        events: {
          change: (e: Event) =>
            this.changeForm(e, FormInputs.FormInputPassword),
          blur: (e: Event) => this.validate(e, FormInputs.FormInputPassword),
        },
      }),
      Link: new Link({
        _id: "Link",
        href: "/registration",
        text: "Нет аккаунта?",
      }),
      Button: new Button({
        _id: "Button",
        text: "Авторизоваться",
        id: "login",
        events: {
          click: (e: Event) => this.submitForm(e),
        },
      }),
    });
  }

  validate(e: Event, childKey: FormInputs) {
    const value = (e.target as HTMLInputElement)?.value ?? "";
    const error =
      childKey === FormInputs.FormInputLogin
        ? validateLogin(value)
        : validatePassword(value);

    this.childrenNodes[childKey].setProps({
      ...this.childrenNodes[childKey].props,
      _id: this.childrenNodes[childKey].props._id as string,
      error,
      value: this.formValues[childKey],
    });
  }

  submitForm(e: Event): void {
    e.preventDefault();

    const errors = {
      [FormInputs.FormInputLogin]: validateLogin(
        this.formValues[FormInputs.FormInputLogin],
      ),
      [FormInputs.FormInputPassword]: validatePassword(
        this.formValues[FormInputs.FormInputPassword],
      ),
    };

    if (Object.values(errors).every((value) => value === "")) {
      console.log(this.formValues);
    }

    Object.values(FormInputs).forEach((input) => {
      this.childrenNodes[input].setProps({
        ...this.childrenNodes[input].props,
        _id: this.childrenNodes[input].props._id as string,
        error: errors[input],
        value: this.formValues[input],
      });
    });
  }

  changeForm = (e: Event, key: keyof LoginPageForm) => {
    if (e.target instanceof HTMLInputElement) {
      this.formValues[key] = e.target.value;
    }
  };

  render() {
    return LoginPageTemplate;
  }
}

export const loginPage = new LoginPage();
