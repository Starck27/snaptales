import { showFormattedDate } from "./utils";

export function generateLoaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
  <li>
    <a href="#/favorite">Cerita Favorit</a>
  </li>
  <li>
    <a href="#/new">Tambah Cerita <i class="fas fa-plus"></i></a>
  </li>
  <li id="push-notification-tools" class="push-notification-tools"></li>
  <li>
    <a id="logout-button" class="logout-button" href="#/login"
  ><i class="fas fa-sign-out-alt"></i> Logout</a
    >
  </li>
  `;
}

export function generateStoriesListEmptyTemplate() {
  return `
    <div id="stories-list-empty" class="stories-list__empty">
      <h2>Tidak ada cerita yang tersedia</h2>
      <p>Belum ada cerita yang dapat ditampilkan untuk saat ini.</p>
    </div>
  `;
}

export function generateStoriesListErrorTemplate(message) {
  return `
    <div id="stories-list-error" class="stories-list__error">
      <h2>Terjadi kesalahan pengambilan daftar cerita</h2>
      <p>${
        message ? message : "Gunakan jaringan lain atau laporkan error ini."
      }</p>
    </div>
  `;
}

export function generateStoryDetailErrorTemplate(message) {
  return `
    <div id="stories-detail-error" class="stories-detail__error">
      <h2>Terjadi kesalahan pengambilan detail cerita</h2>
      <p>${
        message ? message : "Gunakan jaringan lain atau laporkan error ini."
      }</p>
    </div>
  `;
}

export function generateStoryItemTemplate({
  id,
  storyTeller,
  photoUrl,
  createdAt,
  lat,
  lon,
  placeName,
}) {
  const placeInfo =
    lat != null && lon != null
      ? `
      <p class="story-item__place">
        <abbr title="${lat}, ${lon}" class="story-item-place__tooltip">
          <i class="fas fa-map-marker-alt"></i> ${placeName}
        </abbr>  
      </p>
    `
      : `<p class="story-item__place empty">
        <abbr title="" class="story-item-place__tooltip">
          <i class="fas fa-map-marker-alt"></i> Tidak ada lokasi
        </abbr>  
      </p>`;

  return `
    <div tabindex="0" class="story-item" data-storyid="${id}">
        <img class="story-item__image" src="${photoUrl}" alt="${storyTeller}">
        <div class="story-item__info">
            <h2 class="story-item__username">${storyTeller}</h2>
            ${placeInfo}
            <p class="story-item__date">
              <i class="fas fa-calendar-alt"></i> ${showFormattedDate(
                createdAt,
                "id-ID"
              )}
            </p>
        </div>
        <div class="story-item__button-container">
          <a href="#/stories/${id}" class="story-item__button">Selengkapnya</a>
        </div>
    </div>
  `;
}

export function generateStoryDetailImageTemplate(imageUrl = null, alt = "") {
  if (!imageUrl) {
    return `
      <img class="story-detail__image" src="images/placeholder-image.jpg" alt="Placeholder Image">
    `;
  }

  return `
    <img class="story-detail__image" src="${imageUrl}" alt="${alt}">
  `;
}

export function generateStoryDetailTemplate({
  storyTeller,
  description,
  storyImage,
  createdAt,
  placeName,
  lat,
  lon,
}) {
  const createdAtFormatted = showFormattedDate(createdAt, "id-ID");
  const image = generateStoryDetailImageTemplate(storyImage, storyTeller);
  const placeInfo =
    lat != null && lon != null
      ? `
      <div class="story-detail__location-container">
        <p class="story-detail__placename">
          <i class="fas fa-map-marker-alt"></i> ${placeName}
        </p>

        <div class="story-detail__coordinate-inline">
          <p>Latitude: <span>${lat}</span></p>
          <p>Longitude: <span>${lon}</span></p>
        </div>
      </div>
    `
      : "";
  const storyMap =
    lat != null && lon != null
      ? `
      <div class="container">
        <h2>Peta Lokasi</h2>

        <div class="story-detail__map-container">
          <div id="map" class="story-detail__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </div>
    `
      : "";

  return `
  <div class="container">
    <div class="story-detail__image-container">
      ${image}
    </div>
  </div>

  <div class="container">
    <div class="story-detail__header-container">
      <div class="story-detail__name-container">
        <h1 class="story-detail__name">${storyTeller}</h1>
      </div>

      <div id="favor-action-container"></div>    
    </div>

    <div class="story-detail__description-container">
      <p class="story-detail__description">
        ${description}
      </p>
    </div>

    <div class="story-detail__date-container">
      <p class="story-detail__date">
        <i class="fas fa-calendar-alt"></i> ${createdAtFormatted}
      </p>
    </div>

    ${placeInfo}
  </div>

  ${storyMap}
  `;
}

export function generateNewFormLocation() {
  return `
  <div class="form-control">
    <p class="new-form__location__title">Lokasi</p>
    <div class="new-form__location-container">
      <div class="new-form__location-map-container">
        <div id="map" class="new-form__location-map"></div>
        <div id="map-loading-container"></div>
      </div>
    
      <div class="new-form__location__lat-lng">
        <input
          type="number"
          name="latitude"
          disabled
        />
        
        <input
          type="number"
          name="longitude"
          disabled
        />
      </div>
    </div>
  </div>
  `;
}

export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="subscribe-button">
      <i class="fas fa-bell"></i>
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="unsubscribe-button">
      <i class="fas fa-bell-slash"></i>
    </button>
  `;
}

export function generateFavoriteStoryButtonTemplate() {
  return `
    <button id="story-detail-favorite" class="favorite-btn">
      <i class="far fa-heart"></i>
    </button>
  `;
}

export function generateRemoveFavoriteStorytButtonTemplate() {
  return `
    <button id="story-detail-remove-favorite" class="favorite-btn">
      <i class="fas fa-heart"></i>
    </button>
  `;
}
