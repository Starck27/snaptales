import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import {
  generateAuthenticatedNavigationListTemplate,
  generateUnauthenticatedNavigationListTemplate,
} from "../template";
import { setupSkipToContent, transitionHelper } from "../utils";
import { getToken, getLogout } from "../utils/auth";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #skipLinkButton = null;

  constructor({ navigationDrawer, drawerButton, content, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }

  #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);

    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  #setupNavigationList() {
    const isLogin = !!getToken();
    const navList = this.#navigationDrawer.children.namedItem("navlist");

    if (!isLogin) {
      navList.innerHTML = "";
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();

      return;
    }

    navList.innerHTML = generateAuthenticatedNavigationListTemplate();

    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();

      if (confirm("Apakah Anda yakin ingin keluar?")) {
        getLogout();

        // Redirect
        location.hash = "/login";
      }
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];

    // Get page instance
    const page = route();

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render();
        page.afterRender();
      },
    });

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: "instant" });
      this.#setupNavigationList();
    });
  }
}

export default App;
