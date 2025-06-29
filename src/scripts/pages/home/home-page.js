import {
  generateLoaderAbsoluteTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
  generateStoryItemTemplate,
} from "../../template";
import HomePresenter from "./home-presenter";
import Map from "../../utils/map";
import * as SnapTalesAPI from "../../data/api";
import template from "./home-page.html";

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return template;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: SnapTalesAPI,
    });

    await this.#presenter.initialGalleryAndMap();
  }

  populateStoriesList(message, stories) {
    if (stories.length <= 0) {
      this.populateStoriesListEmpty();

      return;
    }

    const html = stories.reduce((accumulator, story) => {
      if (this.#map && story?.lat && story?.lon) {
        const coordinate = [story.lat, story.lon];
        const markerOptions = { alt: story.id };
        const popupOptions = { content: story.name };

        this.#map.addMarker(coordinate, markerOptions, popupOptions);
      }

      return accumulator.concat(
        generateStoryItemTemplate({
          ...story,
          storyTeller: story.name,
        })
      );
    }, "");

    document.getElementById("stories-list").innerHTML = `
      ${html}
    `;
  }

  populateStoriesListEmpty() {
    document.getElementById("stories-list").innerHTML =
      generateStoriesListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById("stories-list").innerHTML =
      generateStoriesListErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build("#map", {
      zoom: 10,
      locate: true,
    });
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  showLoading() {
    document.getElementById("stories-list-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById("stories-list-loading-container").innerHTML = "";
  }
}
