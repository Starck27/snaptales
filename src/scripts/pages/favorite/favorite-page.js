import {
  generateLoaderAbsoluteTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
  generateStoryItemTemplate,
} from "../../template";
import FavoritePresenter from "./favorite-presenter";
import template from "./favorite-page.html";
import Database from "../../data/database";
import Map from "../../utils/map";

export default class FavoritePage {
  #presenter = null;
  #map = null;

  async render() {
    return template;
  }

  async afterRender() {
    this.#presenter = new FavoritePresenter({
      view: this,
      model: Database,
    });

    await this.#presenter.initialGalleryAndMap();
  }

  populateFavoritedStories(message, stories) {
    if (stories.length <= 0) {
      this.populateFavoritedStoriesListEmpty();

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

    document.getElementById("stories-list").innerHTML = `${html}`;
  }

  populateFavoritedStoriesListEmpty() {
    document.getElementById("stories-list").innerHTML =
      generateStoriesListEmptyTemplate();
  }

  populateFavoritedStoriesError(message) {
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

  showStoriesListLoading() {
    document.getElementById("stories-list-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStoriesListLoading() {
    document.getElementById("stories-list-loading-container").innerHTML = "";
  }
}
