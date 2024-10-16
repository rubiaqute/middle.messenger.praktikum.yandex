import "./pages/error/error.pcss";

import {
  ChatPage,
  ErrorNotFoundPage,
  ErrorServerPage,
  LoginPage,
  ProfileChangePasswordPage,
  ProfileEditPage,
  ProfileSettingsPage,
  RegistrationPage,
} from "./pages";

import { BasicBlockProps, Block } from "./components/common/block";
import { Router } from "./utils/router";
import { connect } from "./utils/store";
import { ProfileData } from "./pages/profile/utils";

export enum Page {
  login = "/",
  signUp = "/sign-up",
  settings = "/settings",
  messenger = "/messenger",
  notFoundError = "/404",
  serverError = "/500",
  profileEdit = "/profile-edit",
  profilePassword = "/profile-password",
}

export const router = new Router('app');

export default class App {
  constructor() {

    const profileSettingsPage = connect<ProfileData>(ProfileSettingsPage as unknown as typeof Block<BasicBlockProps>, (state) => state.profile.profileData)
    const profileEditPage = connect<ProfileData>(ProfileEditPage as unknown as typeof Block<BasicBlockProps>, (state) => state.profile.profileData)
    const profileChangePasswordPage = connect<ProfileData>(ProfileChangePasswordPage as unknown as typeof Block<BasicBlockProps>, (state) => state.profile.profileData)

    router
      .use(Page.login, LoginPage)
      .use(Page.signUp, RegistrationPage)
      .use(Page.messenger, ChatPage)
      .use(Page.settings, profileSettingsPage)
      .use(Page.profileEdit, profileEditPage)
      .use(Page.profilePassword, profileChangePasswordPage)
      .use(Page.notFoundError, ErrorNotFoundPage as unknown as typeof Block<BasicBlockProps>)
      .use(Page.serverError, ErrorServerPage as unknown as typeof Block<BasicBlockProps>)
      .start();
  }

  render() {
    return ''
  }
}
