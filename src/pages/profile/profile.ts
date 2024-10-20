import { BasicBlockProps, Block } from "../../components/common/block";
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
import { connect, store, StoreEvents } from "../../utils/store";
import { UserController } from "../../controllers/user-controller";
import { Page, router } from "../../app";
import { showNotification } from "../../utils/helpers";
import { BASE_URL } from "../../api/api-service";

export type ProfilePageMode = "basic" | "edit" | "changePassword";

export interface ProfilePageProps extends Record<string, unknown> {
  profileData: ProfileData;
  pageMode: ProfilePageMode;
}

export class ProfilePage extends Block<ProfilePageProps> {
  editFormValues: EditProfileForm;
  changePasswordFormValues: ChangePasswodProfileForm;
  userController = new UserController()

  constructor(props: ProfilePageProps) {
    super({
      SidePanel: new SidePanel({ _id: "SidePanel" }),
      Avatar: new (connect(Avatar as typeof Block, state => ({ avatarUrl: `${BASE_URL}/Resources/${state.profile.profileData.avatar}` })) as unknown as typeof Avatar)({
        _id: "Avatar",
        avatarUrl: './union.svg',
        events: {
          change: (e) => this.changeAvatar(e)
        }
      }),
      ...(props.pageMode === "changePassword"
        ? inputsChangePasswordDataList
        : inputsProfileDataList
      ).reduce<Partial<Record<ProfileInputs, ProfileInput>>>((acc, cur) => {
        const withStoreInput = connect(ProfileInput as unknown as typeof Block<BasicBlockProps>, (state) => ({ value: state.profile.profileData[getProfileInputKey(cur.id as FilledProfileInputs)] }))

        acc[cur.id] = new withStoreInput({
          _id: cur.id,
          name: cur.name,
          label: cur.label,
          type: cur.type,
          isDisabled: props.pageMode === "basic",
          value: props.profileData[getProfileInputKey(cur.id as FilledProfileInputs)] ?? "",
          error: "",
          events: props.pageMode === "basic"
            ? {}
            : {
              change: (e: Event) => this.changeForm(e, cur.id),
              blur: (e: Event) => this.validate(e, cur.id),
            },
        }) as unknown as ProfileInput;
        return acc;
      }, {}),
      Button: new Button({
        _id: "Button",
        text: "Сохранить",
        buttonId: "saveButton",
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
        '',
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
    } as EditProfileForm;
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

  async submitForm(e: Event): Promise<void> {
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
      if (this.props.pageMode === 'edit') {
        const result = await this.userController.changeProfile({
          login: this.editFormValues.ProfileInputLogin,
          first_name: this.editFormValues.ProfileInputFirstName,
          second_name: this.editFormValues.ProfileInputSecondName,
          display_name: this.editFormValues.ProfileInputDisplayName,
          phone: this.editFormValues.ProfileInputPhone,
          email: this.editFormValues.ProfileInputEmail
        })

        if (result.isSuccess) {
          router.go(Page.settings)
        } else {
          showNotification(result.error)
        }
      } else {
        const result = await this.userController.changePassword({
          oldPassword: this.changePasswordFormValues.ProfileInputOldPassword,
          newPassword: this.changePasswordFormValues.ProfileInputNewPassword
        })

        if (result.isSuccess) {
          router.go(Page.settings)
        } else {
          showNotification(result.error)
        }
      }
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

  async changeAvatar(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]

    if (file) {
      const payload = new FormData()
      payload.append('avatar', file)
      const result = await this.userController.changeAvatar(payload)

      if (!result.isSuccess) {
        showNotification(result.error)
      }
    }

    // const file = (e.target as HTMLInputElement)?.files?.[0]
    // if (file) {
    //   const formData = new FormData()
    //   formData.set('avatar', file)
    //   console.log(formData.values())
    //   this.userController.changeAvatar(formData)
    // }
  }


}

export class ProfileEditPage extends ProfilePage {
  constructor(profileData: ProfileData) {
    super({
      pageMode: 'edit',
      profileData,
    })

    store.on(StoreEvents.Updated, () => {
      this.setProps({ ...this.props, profileData: store.getState().profile.profileData } as ProfilePageProps);

      this.editFormValues = {
        [ProfileInputs.ProfileInputEmail]:
          this.props.profileData[getProfileInputKey(ProfileInputs.ProfileInputEmail)],
        [ProfileInputs.ProfileInputLogin]:
          this.props.profileData[getProfileInputKey(ProfileInputs.ProfileInputLogin)],
        [ProfileInputs.ProfileInputFirstName]:
          this.props.profileData[
          getProfileInputKey(ProfileInputs.ProfileInputFirstName)
          ],
        [ProfileInputs.ProfileInputSecondName]:
          this.props.profileData[
          getProfileInputKey(ProfileInputs.ProfileInputSecondName)
          ],
        [ProfileInputs.ProfileInputDisplayName]:
          this.props.profileData[
          getProfileInputKey(ProfileInputs.ProfileInputDisplayName)
          ],
        [ProfileInputs.ProfileInputPhone]:
          this.props.profileData[getProfileInputKey(ProfileInputs.ProfileInputPhone)],
      } as EditProfileForm;
    });

  }
}

export class ProfileChangePasswordPage extends ProfilePage {
  constructor(profileData: ProfileData) {
    super({
      pageMode: 'changePassword',
      profileData
    })
  }
}

export class ProfileSettingsPage extends ProfilePage {
  constructor(profileData: ProfileData) {
    super({
      pageMode: 'basic',
      profileData,
    })
  }
}
