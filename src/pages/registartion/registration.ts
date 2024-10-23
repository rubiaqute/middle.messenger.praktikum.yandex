import { BasicBlockProps, Block } from "../../components/common/block";
import RegistrationTemplate from "./registration.hbs?raw";
import { Button, FormInput, Link } from "../../components";
import {
  validateEmail,
  validateLogin,
  validateName,
  validatePassword,
  validatePhone,
  validateRepeatPassword,
} from "../../utils/validation";
import { FormInputs, inputsLDataList } from "./utils";
import { UserController } from "../../controllers/user-controller";
import { Page, router } from "../../app";
import { showNotification } from "../../utils/helpers";

type RegistrationPageForm = Record<FormInputs, string>;

export class RegistrationPage extends Block<BasicBlockProps> {
  formValues: RegistrationPageForm = {
    [FormInputs.FormInputLogin]: "",
    [FormInputs.FormInputPassword]: "",
    [FormInputs.FormInputEmail]: "",
    [FormInputs.FormInputFirstName]: "",
    [FormInputs.FormInputSecondName]: "",
    [FormInputs.FormInputPhone]: "",
    [FormInputs.FormInputRepeatPassword]: "",
  };

  userController = new UserController()

  constructor() {
    super({
      ...inputsLDataList.reduce<Partial<Record<FormInputs, FormInput>>>(
        (acc, cur) => {
          acc[cur.id] = new FormInput({
            _id: cur.id,
            name: cur.name,
            label: cur.label,
            type: cur.type,
            value: "",
            error: "",
            events: {
              change: (e: Event) => this.changeForm(e, cur.id),
              blur: (e: Event) => this.validate(e, cur.id),
            },
          });

          return acc;
        },
        {},
      ),
      Link: new Link({
        _id: "Link",
        events: {
          click: () => router.go(Page.login)
        },
        text: "Войти",
      }),
      Button: new Button({
        _id: "Button",
        text: "Зарегистрироваться",
        buttonId: "registration",
        events: {
          click: (e: Event) => this.submitForm(e),
        },
      }),
    });
  }

  validate(e: Event, childKey: FormInputs) {
    const value = (e.target as HTMLInputElement)?.value ?? "";
    let error = "";

    switch (childKey) {
      case FormInputs.FormInputLogin: {
        error = validateLogin(value);
        break;
      }
      case FormInputs.FormInputPassword: {
        error = validatePassword(value);
        break;
      }
      case FormInputs.FormInputRepeatPassword: {
        error = validateRepeatPassword(
          this.formValues[FormInputs.FormInputPassword],
          value,
        );
        break;
      }
      case FormInputs.FormInputFirstName:
      case FormInputs.FormInputSecondName: {
        error = validateName(value);
        break;
      }
      case FormInputs.FormInputEmail: {
        error = validateEmail(value);
        break;
      }
      case FormInputs.FormInputPhone: {
        error = validatePhone(value);
        break;
      }
    }

    this.childrenNodes[childKey].setProps({
      ...this.childrenNodes[childKey].props,
      _id: this.childrenNodes[childKey].props._id as string,
      error,
      value: this.formValues[childKey],
    });
  }

  async submitForm(e: Event): Promise<void> {
    e.preventDefault();

    const errors = {
      [FormInputs.FormInputLogin]: validateLogin(
        this.formValues[FormInputs.FormInputLogin],
      ),
      [FormInputs.FormInputPassword]: validatePassword(
        this.formValues[FormInputs.FormInputPassword],
      ),
      [FormInputs.FormInputEmail]: validateEmail(
        this.formValues[FormInputs.FormInputEmail],
      ),
      [FormInputs.FormInputFirstName]: validateName(
        this.formValues[FormInputs.FormInputFirstName],
      ),
      [FormInputs.FormInputSecondName]: validateName(
        this.formValues[FormInputs.FormInputSecondName],
      ),
      [FormInputs.FormInputPhone]: validatePhone(
        this.formValues[FormInputs.FormInputPhone],
      ),
      [FormInputs.FormInputRepeatPassword]: validateRepeatPassword(
        this.formValues[FormInputs.FormInputPassword],
        this.formValues[FormInputs.FormInputRepeatPassword],
      ),
    };

    if (Object.values(errors).every((value) => value === "")) {
      const result = await this.userController.signUp({
        first_name: this.formValues.FormInputFirstName,
        second_name: this.formValues.FormInputSecondName,
        login: this.formValues.FormInputLogin,
        email: this.formValues.FormInputEmail,
        password: this.formValues.FormInputPassword,
        phone: this.formValues.FormInputPhone
      })

      if (result.isSuccess) {
        router.go(Page.messenger)
      } else {
        showNotification(result.error)
      }
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

  changeForm = (e: Event, key: keyof RegistrationPageForm) => {
    if (e.target instanceof HTMLInputElement) {
      this.formValues[key] = e.target.value;
    }
  };

  render() {
    return RegistrationTemplate;
  }
}

export const registrationPage = new RegistrationPage();
