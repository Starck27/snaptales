import { showLocalNotification } from "../../utils/notification-helper";

export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error("showNewFormMap: error:", error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postNewStory({ description, storyImage, lat, lon }) {
    this.#view.showSubmitLoadingButton();
    try {
      const data = {
        description,
        photo: storyImage,
      };

      if (lat !== null && lon !== null) {
        data.lat = lat;
        data.lon = lon;
      }

      const response = await this.#model.storeNewStory(data);

      if (!response.ok) {
        console.error("postNewStory: response:", response);
        this.#view.storeFailed(response.message);

        return;
      }

      this.#view.storeSuccessfully(response.message, response.story);

      const shortDesc =
        description.length > 100
          ? `${description.slice(0, 100).trim()}...`
          : description;

      showLocalNotification("Cerita Baru Ditambahkan", description);
    } catch (error) {
      console.error("postNewStory: error:", error);
      this.#view.storeFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
