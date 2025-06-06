import {
  generateLoaderAbsoluteTemplate,
  generateStoryDetailErrorTemplate,
  generateStoryDetailTemplate,
} from "../../template";
import storyDetailPresenter from "./story-detail-presenter";
import { parseActivePathname } from "../../routes/url-parser";
import Map from "../../utils/map";
import * as SnapTalesAPI from "../../data/api";
import template from "./story-detail-page.html";

export default class StoryDetailPage {
  #presenter = null;
  #form = null;
  #map = null;

  async render() {
    return template;
  }

  async afterRender() {
    this.#presenter = new storyDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: SnapTalesAPI,
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
