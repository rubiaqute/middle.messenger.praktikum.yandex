import "./styles/mixins.pcss";
import "./styles/main.pcss";
import App from "./app";

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();

  app.render();
});
