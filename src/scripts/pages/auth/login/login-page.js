import LoginPresenter from "./login-presenter";
import * as SnapTalesAPI from "../../../data/api";
import * as AuthModel from "../../../utils/auth";

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
    <section>
        <div class="form-container">
            <h1>Masuk Akun</h1>
            <form id="login-form">
                <div class="form-control">
                    <label for="email">Email</label>
                    <input type="email" name="" id="email-input" placeholder="nama@contoh.com" />
                </div>

                <div class="form-control">
                    <label for="email">Password</label>
                    <input
                        type="password"
                        name=""
                        id="password-input"
                        placeholder="Masukkan password Anda"
                        />
                </div>

                <div class="form-buttons login-form__form-buttons">
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
