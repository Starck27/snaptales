import RegisterPresenter from "./register-presenter";
import * as SnapTalesAPI from "../../../data/api";

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
    <section>
      <div class="form-container">
        <h1 class="register-form__title">Registrasi Akun</h1>
        <form id="register" class="register-form">
          <div class="form-control">
            <label for="name-input">Nama Lengkap</label>
            <input type="text" name="name-input" id="name-input" placeholder="John Doe">
          </div>

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
              <button class="btn" type="submit">
                <i class="fas fa-spinner loader-button"></i> Daftar akun
              </button>
            </div>
            <p class="register-form__already-have-account">Sudah punya akun? <a href="#/login">Masuk</a></p>
          </div>
        </form>
      </div>
    </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: SnapTalesAPI,
    });

    this.#setupForm();
  }

  #setupForm() {
    document
      .getElementById("register-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
          name: document.getElementById("name-input").value,
          email: document.getElementById("email-input").value,
          password: document.getElementById("password-input").value,
        };
        await this.#presenter.getRegistered(data);
      });
  }

  registeredSuccessfully(message) {
    console.log(message);

    // Redirect
    location.hash = "/login";
  }

  registeredFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Daftar akun
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit">Daftar akun</button>
    `;
  }
}
