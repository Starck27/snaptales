import {
  generateFavoriteStoryButtonTemplate,
  generateLoaderAbsoluteTemplate,
  generateRemoveFavoriteStorytButtonTemplate,
  generateStoryDetailErrorTemplate,
  generateStoryDetailTemplate,
} from "../../template";
import storyDetailPresenter from "./story-detail-presenter";
import { parseActivePathname } from "../../routes/url-parser";
import Map from "../../utils/map";
import * as SnapTalesAPI from "../../data/api";
import template from "./story-detail-page.html";
import Database from "../../data/database";

export default class StoryDetailPage {
  #presenter = null;
  #map = null;

  async render() {
    return template;
  }

  async afterRender() {
    this.#presenter = new storyDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: SnapTalesAPI,
      dbModel: Database,
    });

    this.#presenter.showStoryDetail();
  }

  async populateStoryDetailAndInitialMap(message, story) {
    document.getElementById("story-detail").innerHTML =
      generateStoryDetailTemplate({
        storyTeller: story.name,
        description: story.description,
        storyImage: story.photoUrl,
        createdAt: story.createdAt,
        placeName: story.placeName,
        lat: story.lat,
        lon: story.lon,
      });

    // Map
    const hasCoordinates = story.lat !== null && story.lon !== null;

    if (hasCoordinates) {
      await this.#presenter.showStoryDetailMap();

      if (this.#map) {
        const storyCoordinate = [story.lat, story.lon];
        const markerOptions = { alt: story.id };
        const popupOptions = { content: story.name };

        this.#map.changeCamera(storyCoordinate);
        this.#map.addMarker(storyCoordinate, markerOptions, popupOptions);
      }
    }

    this.#presenter.showFavoriteButton();
  }

  populateStoryDetailError(message) {
    document.getElementById("story-detail").innerHTML =
      generateStoryDetailErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build("#map", {
      zoom: 15,
    });
  }

  renderFavoriteButton() {
    document.getElementById("favor-action-container").innerHTML =
      generateFavoriteStoryButtonTemplate();

    document
      .getElementById("story-detail-favorite")
      .addEventListener("click", async () => {
        await this.#presenter.favorStory();
        await this.#presenter.showFavoriteButton();
      });
  }

  addToFavoriteSuccessfully(message) {
    console.log(message);
  }

  addToFavoriteFailed(message) {
    alert(message);
  }

  renderRemoveButton() {
    document.getElementById("favor-action-container").innerHTML =
      generateRemoveFavoriteStorytButtonTemplate();

    document
      .getElementById("story-detail-favorite")
      .addEventListener("click", async () => {
        alert("Fitur simpan laporan akan segera hadir!");
        await this.#presenter.removeStory();
        await this.#presenter.showFavoriteButton();
      });
  }

  removeFromFavoriteSuccessfully(message) {
    console.log(message);
  }

  removeFromFavoriteFailed(message) {
    alert(message);
  }

  showStoryDetailLoading() {
    document.getElementById("story-detail-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStoryDetailLoading() {
    document.getElementById("story-detail-loading-container").innerHTML = "";
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
}
