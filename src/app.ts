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
import { connect, store } from "./utils/store";
import { ProfileData } from "./pages/profile/utils";
import { AuthApi } from "./api/auth-api";

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
  userApi = new AuthApi()

  constructor() {
    this.initApp()

  }

  async initApp() {
    this.initRouter()
    if (!store.getState().profile.profileData.id) {
      const info = await this.userApi.getInfo() as { response: string }

      if (info.response) {
        store.set('profile.profileData', info.response)
      }
    }

  }

  initRouter() {
    const profileSettingsPage = connect<ProfileData>(ProfileSettingsPage as unknown as typeof Block<BasicBlockProps>, (state) => state.profile.profileData)
    const profileChangePasswordPage = connect<ProfileData>(ProfileChangePasswordPage as unknown as typeof Block<BasicBlockProps>, (state) => state.profile.profileData)

    router
      .use(Page.login, LoginPage)
      .use(Page.signUp, RegistrationPage)
      .use(Page.messenger, ChatPage)
      .use(Page.settings, profileSettingsPage)
      .use(Page.profileEdit, ProfileEditPage as unknown as typeof Block<BasicBlockProps>)
      .use(Page.profilePassword, profileChangePasswordPage)
      .use(Page.notFoundError, ErrorNotFoundPage as unknown as typeof Block<BasicBlockProps>)
      .use(Page.serverError, ErrorServerPage as unknown as typeof Block<BasicBlockProps>)
      .start();
  }

  render() {
    return ''
  }
}
