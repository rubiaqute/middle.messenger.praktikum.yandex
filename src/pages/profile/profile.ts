import { Block } from "../../components/common/block";
import ProfilePageTemplate from "./profile.hbs?raw";
import {
  Avatar,
  Button,
  Link,
  ProfileInput,
  SidePanel,
} from "../../components";
import {
  validateEmail,
  validateLogin,
  validateName,
  validatePassword,
  validatePhone,
  validateRepeatPassword,
} from "../../utils/validation";
import {
  ChangePasswodProfileForm,
  EditProfileForm,
  FilledProfileInputs,
  getProfileInputKey,
  inputsChangePasswordDataList,
  inputsProfileDataList,
  ProfileData,
  ProfileInputs,
} from "./utils";

export type ProfilePageMode = "basic" | "edit" | "changePassword";

export interface ProfilePageProps extends Record<string, unknown> {
  profileData: ProfileData;
  pageMode: ProfilePageMode;
}

export class ProfilePage extends Block<ProfilePageProps> {
  editFormValues: EditProfileForm;
  changePasswordFormValues: ChangePasswodProfileForm;

  constructor(props: ProfilePageProps) {
    super({
      SidePanel: new SidePanel({ _id: "SidePanel" }),
      Avatar: new Avatar({ _id: "Avatar" }),
      ...(props.pageMode === "changePassword"
        ? inputsChangePasswordDataList
        : inputsProfileDataList
      ).reduce<Partial<Record<ProfileInputs, ProfileInput>>>((acc, cur) => {
        acc[cur.id] = new ProfileInput({
          _id: cur.id,
          name: cur.name,
          label: cur.label,
          type: cur.type,
          isDisabled: props.pageMode === "basic",
          value:
            props.profileData[
              getProfileInputKey(cur.id as FilledProfileInputs)
            ] ?? "",
          error: "",
          events:
            props.pageMode === "basic"
              ? {}
              : {
                  change: (e: Event) => this.changeForm(e, cur.id),
                  blur: (e: Event) => this.validate(e, cur.id),
                },
        });
        return acc;
      }, {}),
      Button: new Button({
        _id: "Button",
        text: "Сохранить",
        id: "saveButton",
        events: {
          click: (e: Event) => this.submitForm(e),
        },
      }),
      LinkChangeData: new Link({
        _id: "LinkChangeData",
        href: "/profile-edit",
        text: "Изменить данные",
      }),
      LinkChangePassword: new Link({
        _id: "LinkChangePassword",
        href: "/profile-password",
        text: "Изменить пароль",
      }),
      LinkExit: new Link({
        _id: "LinkExit",
        href: "/",
        text: "Выйти",
        isAlert: true,
      }),
      pageMode: props.pageMode,
      profileData: props.profileData,
      isChangePasswordMode: props.pageMode === "changePassword",
      isWithSaveButton:
        props.pageMode === "changePassword" || props.pageMode === "edit",
    });

    this.changePasswordFormValues = {
      [ProfileInputs.ProfileInputOldPassword]:
        props.profileData[
          getProfileInputKey(ProfileInputs.ProfileInputOldPassword)
        ],
      [ProfileInputs.ProfileInputNewPassword]: "",
      [ProfileInputs.ProfileInputRepeatNewPassword]: "",
    };

    this.editFormValues = {
      [ProfileInputs.ProfileInputEmail]:
        props.profileData[getProfileInputKey(ProfileInputs.ProfileInputEmail)],
      [ProfileInputs.ProfileInputLogin]:
        props.profileData[getProfileInputKey(ProfileInputs.ProfileInputLogin)],
      [ProfileInputs.ProfileInputFirstName]:
        props.profileData[
          getProfileInputKey(ProfileInputs.ProfileInputFirstName)
        ],
      [ProfileInputs.ProfileInputSecondName]:
        props.profileData[
          getProfileInputKey(ProfileInputs.ProfileInputSecondName)
        ],
      [ProfileInputs.ProfileInputDisplayName]:
        props.profileData[
          getProfileInputKey(ProfileInputs.ProfileInputDisplayName)
        ],
      [ProfileInputs.ProfileInputPhone]:
        props.profileData[getProfileInputKey(ProfileInputs.ProfileInputPhone)],
    };
  }

  validate(e: Event, childKey: ProfileInputs) {
    const value = (e.target as HTMLInputElement)?.value ?? "";
    let error = "";

    switch (childKey) {
      case ProfileInputs.ProfileInputLogin: {
        error = validateLogin(value);
        break;
      }
      case ProfileInputs.ProfileInputNewPassword:
      case ProfileInputs.ProfileInputOldPassword: {
        error = validatePassword(value);
        break;
      }
      case ProfileInputs.ProfileInputRepeatNewPassword: {
        error = validateRepeatPassword(
          this.changePasswordFormValues[ProfileInputs.ProfileInputNewPassword],
          value,
        );
        break;
      }
      case ProfileInputs.ProfileInputFirstName:
      case ProfileInputs.ProfileInputDisplayName:
      case ProfileInputs.ProfileInputSecondName: {
        error = validateName(value);
        break;
      }
      case ProfileInputs.ProfileInputEmail: {
        error = validateEmail(value);
        break;
      }
      case ProfileInputs.ProfileInputPhone: {
        error = validatePhone(value);
        break;
      }
    }

    this.childrenNodes[childKey].setProps({
      ...this.childrenNodes[childKey].props,
      _id: this.childrenNodes[childKey].props._id as string,
      error,
      value:
        this.props.pageMode === "changePassword"
          ? this.changePasswordFormValues[
              childKey as keyof ChangePasswodProfileForm
            ]
          : this.editFormValues[childKey as keyof EditProfileForm],
    });
  }

  submitForm(e: Event): void {
    e.preventDefault();

    const errors =
      this.props.pageMode === "changePassword"
        ? {
            [ProfileInputs.ProfileInputOldPassword]: validatePassword(
              this.changePasswordFormValues[
                ProfileInputs.ProfileInputOldPassword
              ],
            ),
            [ProfileInputs.ProfileInputNewPassword]: validatePassword(
              this.changePasswordFormValues[
                ProfileInputs.ProfileInputNewPassword
              ],
            ),
            [ProfileInputs.ProfileInputRepeatNewPassword]:
              validateRepeatPassword(
                this.changePasswordFormValues[
                  ProfileInputs.ProfileInputNewPassword
                ],
                this.changePasswordFormValues[
                  ProfileInputs.ProfileInputRepeatNewPassword
                ],
              ),
          }
        : {
            [ProfileInputs.ProfileInputLogin]: validateLogin(
              this.editFormValues[ProfileInputs.ProfileInputLogin],
            ),
            [ProfileInputs.ProfileInputEmail]: validateEmail(
              this.editFormValues[ProfileInputs.ProfileInputEmail],
            ),
            [ProfileInputs.ProfileInputFirstName]: validateName(
              this.editFormValues[ProfileInputs.ProfileInputFirstName],
            ),
            [ProfileInputs.ProfileInputSecondName]: validateName(
              this.editFormValues[ProfileInputs.ProfileInputSecondName],
            ),
            [ProfileInputs.ProfileInputDisplayName]: validateName(
              this.editFormValues[ProfileInputs.ProfileInputDisplayName],
            ),
            [ProfileInputs.ProfileInputPhone]: validatePhone(
              this.editFormValues[ProfileInputs.ProfileInputPhone],
            ),
          };

    if (Object.values(errors).every((value) => value === "")) {
      console.log(
        this.props.pageMode === "changePassword"
          ? this.changePasswordFormValues
          : this.editFormValues,
      );
    }

    Object.keys(
      this.props.pageMode === "changePassword"
        ? this.changePasswordFormValues
        : this.editFormValues,
    ).forEach((key) => {
      this.childrenNodes[key].setProps({
        ...this.childrenNodes[key].props,
        _id: this.childrenNodes[key].props._id as string,
        error:
          errors[key as keyof (EditProfileForm | ChangePasswodProfileForm)],
        value:
          this.props.pageMode === "changePassword"
            ? this.changePasswordFormValues[
                key as keyof ChangePasswodProfileForm
              ]
            : this.editFormValues[key as keyof EditProfileForm],
      });
    });
  }

  changeForm = (e: Event, key: ProfileInputs) => {
    if (e.target instanceof HTMLInputElement) {
      if (this.props.pageMode === "changePassword") {
        this.changePasswordFormValues[key as keyof ChangePasswodProfileForm] =
          e.target.value;
      } else {
        this.editFormValues[key as keyof EditProfileForm] = e.target.value;
      }
    }
  };

  render() {
    return ProfilePageTemplate;
  }
}
