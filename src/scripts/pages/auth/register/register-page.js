import RegisterPresenter from "./register-presenter";
import * as SnapeTalesAPI from "../../../data/api";

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
    <section>
        <div class="form-container">
            <h1>Registrasi Akun</h1>
            <form id="register-form">
                <div class="form-control">
                    <label for="name">Nama Lengkap</label>
                    <input type="name" name="" id="" placeholder="John Doe" />
                </div>

                <div class="form-control">
                    <label for="email">Email</label>
                    <input type="email" name="" id="" placeholder="nama@contoh.com" />
                </div>

                <div class="form-control">
                    <label for="email">Password</label>
                    <input
                        type="password"
                        name=""
                        id=""
                        minlength="8"
                        placeholder="Masukkan password"
                        />
                </div>

                <div class="form-buttons register-form__form-buttons">
                    <div id="submit-button-container">
                        <button class="btn" type="submit">Daftar akun</button>
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
      model: SnapeTalesAPI,
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
        <i class="fas fa-spinner loader-button"></i> Masuk
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit">Daftar akun</button>
    `;
  }
}
