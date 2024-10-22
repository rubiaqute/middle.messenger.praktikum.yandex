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
import { UserController } from "./controllers/user-controller";
import { ChatController } from "./controllers/chat-controller";

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
  userController = new UserController()
  chatContoller = new ChatController()

  constructor() {
    this.initApp()
  }

  initApp() {
    this.initRouter()
    this.initPathGuard()
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

  async initPathGuard() {
    if (router.currentPath === Page.login || router.currentPath === Page.signUp) {
      const isSuccess = await this.userController.getUserInfo()

      if (isSuccess) {
        router.go(Page.messenger)
      }
    }

    if ([Page.settings, Page.profileEdit, Page.messenger, Page.profilePassword].some((path) => path === router.currentPath)) {
      if (!store.getState().profile.profileData.id) {
        const isSuccess = await this.userController.getUserInfo()

        if (!isSuccess) {
          router.go(Page.login)
        }
      }
    }
  }

  render() {
    return ''
  }
}
