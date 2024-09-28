export interface ProfileData {
  email: string;
  login: string;
  firstName: string;
  secondName: string;
  phone: string;
  displayName: string;
  password: string;
}

export enum ProfileInputs {
  ProfileInputEmail = "ProfileInputEmail",
  ProfileInputLogin = "ProfileInputLogin",
  ProfileInputFirstName = "ProfileInputFirstName",
  ProfileInputSecondName = "ProfileInputSecondName",
  ProfileInputDisplayName = "ProfileInputDisplayName",
  ProfileInputPhone = "ProfileInputPhone",
  ProfileInputOldPassword = "ProfileInputOldPassword",
  ProfileInputNewPassword = "ProfileInputNewPassword",
  ProfileInputRepeatNewPassword = "ProfileInputRepeatNewPassword",
}

export type ChangePasswordModeProfileInputs = Extract<
  ProfileInputs,
  | ProfileInputs.ProfileInputRepeatNewPassword
  | ProfileInputs.ProfileInputNewPassword
  | ProfileInputs.ProfileInputOldPassword
>;
export type EditModeProfileInputs = Exclude<
  ProfileInputs,
  ChangePasswordModeProfileInputs
>;

export type FilledProfileInputs = Exclude<
  ProfileInputs,
  | ProfileInputs.ProfileInputRepeatNewPassword
  | ProfileInputs.ProfileInputNewPassword
>;

export const getProfileInputKey = (profileInputId: FilledProfileInputs) => {
  const dictionary: Record<FilledProfileInputs, keyof ProfileData> = {
    [ProfileInputs.ProfileInputEmail]: "email",
    [ProfileInputs.ProfileInputLogin]: "login",
    [ProfileInputs.ProfileInputFirstName]: "firstName",
    [ProfileInputs.ProfileInputSecondName]: "secondName",
    [ProfileInputs.ProfileInputDisplayName]: "displayName",
    [ProfileInputs.ProfileInputPhone]: "phone",
    [ProfileInputs.ProfileInputOldPassword]: "password",
  };

  return dictionary[profileInputId] ?? "";
};

export const inputsProfileDataList = [
  {
    id: ProfileInputs.ProfileInputEmail,
    name: "email",
    label: "Почта",
    type: "email",
  },
  {
    id: ProfileInputs.ProfileInputLogin,
    name: "login",
    label: "Логин",
    type: "text",
  },
  {
    id: ProfileInputs.ProfileInputFirstName,
    name: "first_name",
    label: "Имя",
    type: "text",
  },
  {
    id: ProfileInputs.ProfileInputSecondName,
    name: "second_name",
    label: "Фамилия",
    type: "text",
  },
  {
    id: ProfileInputs.ProfileInputDisplayName,
    name: "display_name",
    label: "Имя в чате",
    type: "text",
  },
  {
    id: ProfileInputs.ProfileInputPhone,
    name: "phone",
    label: "Телефон",
    type: "text",
  },
];

export const inputsChangePasswordDataList = [
  {
    id: ProfileInputs.ProfileInputOldPassword,
    name: "oldPassword",
    label: "Старый пароль",
    type: "password",
  },
  {
    id: ProfileInputs.ProfileInputNewPassword,
    name: "newPassword",
    label: "Новый пароль",
    type: "password",
  },
  {
    id: ProfileInputs.ProfileInputRepeatNewPassword,
    name: "repeat_newPassword",
    label: "Повторите новый пароль",
    type: "password",
  },
];

export type EditProfileForm = Record<EditModeProfileInputs, string>;
export type ChangePasswodProfileForm = Record<
  ChangePasswordModeProfileInputs,
  string
>;