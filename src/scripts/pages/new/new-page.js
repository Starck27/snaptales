import * as SnapTalesAPI from "../../data/api";
import {
  generateLoaderAbsoluteTemplate,
  generateNewFormLocation,
} from "../../template";
import { convertBase64ToBlob } from "../../utils";
import Camera from "../../utils/camera";
import Map from "../../utils/map";
import NewPresenter from "./new-presenter";

export default class NewPage {
  #presenter;
  #form;
  #camera;
  #isCameraOpen = false;
  #takenDocumentation = null;
  #map = null;

  async render() {
    return `
        <section>
            <div class="new-form__container">
                <h1 class="new-story__title">Cerita Baru</h1>
                <form id="new-form" class="new-form">
                    <div class="form-control">
                        <label for="description-input">Deskripsi Cerita</label>
                        <textarea
                            name="description-input"
                            id="description-input"
                            placeholder="Ceritakan apa yang terjadi kepadamu."
                        ></textarea>
                    </div>

                    <div class="form-control">
                        <label for="documentation-input">Dokumentasi Cerita</label>
                        <div class="new-form__documentation__container">
                            <div class="new-form__documentation__buttons">
                                <button
                                    id="documentation-input-button"
                                    class="btn btn-outline"
                                    type="button"
                                >
                                    Ambil Gambar
                                </button>
                                <input
                                    id="documentation-input"
                                    class="new-form__documentation__input"
                                    name="documentation"
                                    type="file"
                                    accept="image/*"
                                    aria-describedby="documentation-more-info"
                                />
                                <button
                                    id="open-documentation-camera-button"
                                    class="btn btn-outline"
                                    type="button"
                                >
                                    Buka Kamera
                                </button>
                            </div>

                            <div id="camera-container" class="new-form__camera__container">
                                <video id="camera-video" class="new-form__camera__video">
                                    Video stream not available.
                                </video>
                                <canvas
                                    id="camera-canvas"
                                    class="new-form__camera__canvas"
                                ></canvas>

                                <div class="new-form__camera__tools">
                                    <select id="camera-select"></select>
                                    <div class="new-form__camera__tools_button">
                                        <button id="camera-take-button" class="btn" type="button">
                                            Ambil Gambar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <ul
                            id="documentation-taken-list"
                            class="new-form__documentation__output"
                            ></ul>
                        </div>
                    </div>

                    <div class="form-control inline">
                        <input
                            type="checkbox"
                            name="location-input-checkbox"
                            id="location-input-checkbox"
                        />
                        <label for="location-input-checkbox">Tambah Lokasi</label>
                    </div>

                    <div id="location-input-container" class="new-form__location__input-container"></div>

                    <div class="form-buttons">
                        <span id="submit-button-container">
                            <button class="btn" type="submit">Buat Cerita</button>
                        </span>
                        <a class="btn" href="#/">Batal</a>
                    </div>
                </form>
            </div>
        </section>
    `;
  }

  async afterRender() {
    this.#presenter = new NewPresenter({
      view: this,
      model: SnapTalesAPI,
    });
    this.#takenDocumentation = null;

    this.#setupForm();
  }

  #setupForm() {
    this.#form = document.getElementById("new-form");
    const locationCheckbox = this.#form.elements.namedItem(
      "location-input-checkbox"
    );
    const locationContainer = document.getElementById(
      "location-input-container"
    );

    locationCheckbox.addEventListener("change", async (event) => {
      if (event.target.checked) {
        locationContainer.innerHTML = generateNewFormLocation();

        // Load Map
        await this.#presenter.showNewFormMap();
      } else {
        locationContainer.innerHTML = "";
      }
    });

    this.#form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const descriptionInput =
        this.#form.elements.namedItem("description-input");
      if (!descriptionInput.value.trim()) {
        alert("Deskripsi cerita harus diisi.");
        return;
      }

      if (!this.#takenDocumentation) {
        alert("Dokumentasi cerita (gambar) harus diunggah atau diambil.");
        return;
      }

      const locationChecked = locationCheckbox.checked;
      const data = {
        description: this.#form.elements.namedItem("description-input").value,
        storyImage: this.#takenDocumentation?.blob ?? null,
        ...(locationChecked && {
          lat: this.#form.elements.namedItem("latitude").value,
          lon: this.#form.elements.namedItem("longitude").value,
        }),
      };

      await this.#presenter.postNewStory(data);
    });

    document
      .getElementById("documentation-input")
      .addEventListener("change", async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image")) {
          alert("File harus berupa gambar.");

          return;
        }

        if (file.size > 1024 * 1024) {
          alert("Ukuran gambar maksimal 1MB.");

          return;
        }

        await this.#addTakenPicture(file);
        await this.#populateTakenPicture();
      });

    document
      .getElementById("documentation-input-button")
      .addEventListener("click", () => {
        this.#form.elements.namedItem("documentation-input").click();
      });

    const cameraContainer = document.getElementById("camera-container");
    document
      .getElementById("open-documentation-camera-button")
      .addEventListener("click", async (event) => {
        cameraContainer.classList.toggle("open");

        this.#isCameraOpen = cameraContainer.classList.contains("open");

        if (this.#isCameraOpen) {
          event.currentTarget.textContent = "Tutup Kaemera";
          this.#setupCamera();
          this.#camera.launch();

          return;
        }

        event.currentTarget.textContent = "Buka Kamera";
        this.#camera.stop();
      });

    if (locationCheckbox.checked) {
      locationContainer.innerHTML = generateNewFormLocation();
      this.#presenter.showNewFormMap();
    }
  }

  async initialMap() {
    this.#map = await Map.build("#map", {
      zoom: 15,
      locate: true,
    });

    // Preparing marker for select coordinate
    const centerCoordinate = this.#map.getCenter();

    this.#updateLatLngInput(
      centerCoordinate.latitude,
      centerCoordinate.longitude
    );

    const draggableMarker = this.#map.addMarker(
      [centerCoordinate.latitude, centerCoordinate.longitude],
      { draggable: "true" }
    );

    draggableMarker.addEventListener("move", (event) => {
      const coordinate = event.target.getLatLng();
      this.#updateLatLngInput(coordinate.lat, coordinate.lng);
    });

    this.#map.addEventListener("click", (event) => {
      draggableMarker.setLatLng(event.latlng);

      // Keep center with user view
      event.sourceTarget.flyTo(event.latlng);
    });
  }

  #updateLatLngInput(latitude, longitude) {
    this.#form.elements.namedItem("latitude").value = latitude;
    this.#form.elements.namedItem("longitude").value = longitude;
  }

  #setupCamera() {
    if (!this.#camera) {
      this.#camera = new Camera({
        video: document.getElementById("camera-video"),
        cameraSelect: document.getElementById("camera-select"),
        canvas: document.getElementById("camera-canvas"),
      });
    }

    this.#camera.addCheeseButtonListener("#camera-take-button", async () => {
      const image = await this.#camera.takePicture();
      await this.#addTakenPicture(image);
      await this.#populateTakenPicture();
    });
  }

  async #addTakenPicture(image) {
    let blob = image;

    if (image instanceof String) {
      blob = await convertBase64ToBlob(image, "image/png");
    }

    this.#takenDocumentation = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      blob: blob,
    };
  }

  async #populateTakenPicture() {
    const container = document.getElementById("documentation-taken-list");

    if (!this.#takenDocumentation) {
      container.innerHTML = "";

      return;
    }

    const imageUrl = URL.createObjectURL(this.#takenDocumentation.blob);

    container.innerHTML = `
        <li class="new-form__documentation-output-item">
            <button type="button" data-deletepictureid="${
              this.#takenDocumentation.id
            }" class="new-form__documentation-output-item__delete-btn">
                <img src="${imageUrl}" alt="Dokumentasi">
            </button>
        </li>
    `;

    document
      .querySelector("button[data-deletepictureid]")
      .addEventListener("click", () => {
        this.#takenDocumentation = null;

        // Updating taken picture
        this.#populateTakenPicture();
      });
  }

  storeSuccessfully(message) {
    console.log(message);
    this.clearForm();

    // Redirect page
    location.hash = "/";
  }

  storeFailed(message) {
    alert(message);
  }

  clearForm() {
    this.#form.reset();
    this.#takenDocumentation = null;
    this.#populateTakenPicture();
  }

  showMapLoading() {
    const container = document.getElementById("map-loading-container");

    if (container) {
      container.innerHTML = generateLoaderAbsoluteTemplate();
    }
  }

  hideMapLoading() {
    const container = document.getElementById("map-loading-container");

    if (container) {
      container.innerHTML = "";
    }
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Buat Cerita
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit">Buat Cerita</button>
    `;
  }
}
