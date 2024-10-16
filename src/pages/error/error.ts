import { Block } from "../../components/common/block";
import ErrorPageTemplate from "./error.hbs?raw";
import { Link } from "../../components";

export interface ErrorPageProps extends Record<string, unknown> {
  title: string;
  subTitle: string;
}

class ErrorPage extends Block<ErrorPageProps> {
  constructor(props: ErrorPageProps) {
    super({
      ...props,
      Link: new Link({
        _id: "Link",
        href: "/chat",
        text: "Назад к чатам",
      }),
    });
  }
  render() {
    return ErrorPageTemplate;
  }
}

export class ErrorNotFoundPage extends ErrorPage {
  constructor() {
    super({
      title: "404",
      subTitle: "Не туда попали"
    })
  }
}

export class ErrorServerPage extends ErrorPage {
  constructor() {
    super({
      title: "500",
      subTitle: "Мы уже фиксим",
    })
  }
}
