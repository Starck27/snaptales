import LoginPresenter from "./login-presenter";
import * as SnapTalesAPI from "../../../data/api";
import * as AuthModel from "../../../utils/auth";

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
    <section>
      <div class="form-container">
        <h1 class="login-form__title">Masuk Akun</h1>
        <form id="login-form" class="login-form">
          <div class="form-control">
            <label for="email-input">Email</label>
            <input type="email" name="email-input" id="email-input" placeholder="nama@contoh.com" />
          </div>

          <div class="form-control">
            <label for="password-input">Password</label>
            <input
              type="password"
              name="password-input"
              id="password-input"
              placeholder="Masukkan password Anda"
            />
          </div>

          <div class="form-buttons">
            <div id="submit-button-container">
              <button class="btn" type="submit">Masuk</button>
            </div>
            <p class="login-form__do-not-have-account">Belum punya akun? <a href="#/register">Daftar</a></p>
          </div>
        </form>
      </div>
    </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: SnapTalesAPI,
      authModel: AuthModel,
    });

    this.#setupForm();
  }

  #setupForm() {
    document
      .getElementById("login-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
          email: document.getElementById("email-input").value,
          password: document.getElementById("password-input").value,
        };
        await this.#presenter.getLogin(data);
      });
  }

  loginSuccessfully(message) {
    console.log(message);

    // Redirect
    location.hash = "/";
  }

  loginFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Masuk
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit">Masuk</button>
    `;
  }
}
