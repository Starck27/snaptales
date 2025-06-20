import { storyMapper } from "../../data/api-mapper";
import { showLocalNotification } from "../../utils/notification-helper";

export default class storyDetailPresenter {
  #storyId;
  #view;
  #apiModel;
  #dbModel;

  constructor(storyId, { view, apiModel, dbModel }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#apiModel = apiModel;
    this.#dbModel = dbModel;
  }

  async showStoryDetailMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error("showStoryDetailMap: error:", error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async showStoryDetail() {
    this.#view.showStoryDetailLoading();
    try {
      const response = await this.#apiModel.getStoryById(this.#storyId);

      if (!response.ok) {
        console.error("showStoryDetailMap: response:", response);
        this.#view.populateStoryDetailError(response.message);

        return;
      }

      const story = await storyMapper(response.story);

      this.#view.populateStoryDetailAndInitialMap(response.story, story);
    } catch (error) {
      console.error("showStoryDetailAndMap: error:", error);
      this.#view.populateStoryDetailError(error.message);
    } finally {
      this.#view.hideStoryDetailLoading();
    }
  }

  async favorStory() {
    try {
      const story = await this.#apiModel.getStoryById(this.#storyId);
      await this.#dbModel.putStory(story.story);

      this.#view.addToFavoriteSuccessfully("Success to favorite the story");

      const storedStory = await this.#dbModel.getStoryById(this.#storyId);
      showLocalNotification(
        "Cerita difavoritkan",
        `Menfavoritkan cerita dari ${storedStory.name}`
      );
    } catch (error) {
      console.error("favorStory: error:", error);
      this.#view.addToFavoriteFailed(error.message);
    }
  }

  async removeStory() {
    try {
      const removedStory = await this.#dbModel.getStoryById(this.#storyId);
      await this.#dbModel.removeStory(this.#storyId);

      this.#view.removeFromFavoriteSuccessfully(
        "Success to remove from favorite"
      );

      if (removedStory) {
        showLocalNotification(
          "Cerita Dihapus dari Favorit",
          `Menghapus cerita ${removedStory.name} dari Favorit`
        );
      }
    } catch (error) {
      console.error("removeStory: error:", error);
      this.#view.removeFromFavoriteFailed(error.message);
    }
  }

  async showFavoriteButton() {
    if (await this.#isStoryFavorited()) {
      this.#view.renderRemoveButton();

      return;
    }

    this.#view.renderFavoriteButton();
  }

  async #isStoryFavorited() {
    return !!(await this.#dbModel.getStoryById(this.#storyId));
  }
}
