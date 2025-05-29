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
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a href="#/about">About</a></li>
            <li>
              <a href="#">Tambah Cerita <i class="fas fa-plus"></i></a>
            </li>
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
          <a href="#/story/${id}" class="story-item__button">Selengkapnya</a>
        </div>
    </div>
  `;
}

export function generateStoryDetailImageTemplate(imageUrl = null, alt = "") {
  if (!imageUrl) {
    return `
      <img class="story-item__image" src="images/placeholder-image.jpg" alt="Placeholder Image">
    `;
  }

  return `
    <img class="story-item__image" src="${imageUrl}" alt="${alt}">
  `;
}

export function generateStoryDetailTemplate({
  storyTeller,
  description,
  photoUrl,
  createdAt,
  lat,
  lon,
}) {
  const createdAtFormatted = showFormattedDate(createdAt, "id-ID");
  const image = generateStoryDetailImageTemplate(photoUrl, storyTeller);

  return `
    <div class="story-detail-container">
        <div id="story-detail" class="story-detail">
            <div class="story-image-container">
                ${image}
              />
            </div>

            <div class="story-uploader-container">
              <h1 class="story-uploader">${storyTeller}</h1>
            </div>

            <p class="story-description-container">
              ${description}
            </p>

            <div class="story-info-inline">
              <p id="story-location">${placeName}</p>
              <p id="story-date-create">${createdAtFormatted}</p>
            </div>

            <div class="story-coordinate-inline">
              <p id="longitude">Longitude: <span>${lon}</span></p>
              <p id="latitude">Latitude: <span>${lat}</span></p>
            </div>

            <div class="story-map-container">
              <h2>Peta Lokasi</h2>
              <div id="map" class="story-map"></div>
              <div id="map-loading-container"></div>
            </div>
          </div>
        </div>
  `;
}
