import CONFIG from "../config";
import { getToken } from "../utils/auth";

const ENDPOINTS = {
  // Auth
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,

  // Stories
  STORY_LIST: `${CONFIG.BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  STORE_NEW_STORY: `${CONFIG.BASE_URL}/stories`,
  STORE_NEW_STORY_GUEST: `${CONFIG.BASE_URL}/stories/guest`,

  // Notification
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

export async function getRegistered({ name, email, password }) {
  if (password.length < 8) {
    return {
      error: true,
      message: "Password setidaknya 8 karakter",
      ok: false,
    };
  }

  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getAllStories() {
  const token = getToken();

  try {
    const fetchResponse = await fetch(ENDPOINTS.STORY_LIST, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (fetchResponse.status === 401) {
      removetoken();
      location.hash = "/login";

      return { error: true, message: "Unauthorized", ok: false };
    }

    const json = await fetchResponse.json();

    return {
      ...json,
      ok: fetchResponse.ok,
    };
  } catch (error) {
    console.error("getAllStories error:", error);
    return { error: true, message: error.message, ok: false };
  }
}

export async function getStoryById(id) {
  const token = getToken();

  try {
    const fetchResponse = await fetch(ENDPOINTS.STORY_DETAIL(id), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (fetchResponse.status === 401) {
      removetoken();
      location.hash = "/login";
      return { error: true, message: "Unauthorized", ok: false };
    }

    const json = await fetchResponse.json();

    return {
      ...json,
      ok: fetchResponse.ok,
    };
  } catch (error) {
    console.error("getStoryById error:", error);

    return { error: true, message: error.message, ok: false };
  }
}

export async function storeNewStory({ description, photo, lat, lon }) {
  const token = getToken();

  try {
    const formData = new FormData();
    formData.set("description", description);
    formData.set("photo", photo);

    if (lat != null) {
      formData.set("lat", lat);
    }

    if (lon != null) {
      formData.set("lon", lon);
    }

    const fetchResponse = await fetch(ENDPOINTS.STORE_NEW_STORY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (fetchResponse.status === 401) {
      removetoken();
      location.hash = "/login";
      return { error: true, message: "Unauthorized", ok: false };
    }

    const json = await fetchResponse.json();
    return {
      ...json,
      ok: fetchResponse.ok,
    };
  } catch (error) {
    console.error("storeNewStory error:", error);
    return { error: true, message: error.message, ok: false };
  }
}

export async function storeNewStoryGuest({ description, photo, lat, lon }) {
  try {
    const formData = new FormData();
    formData.set("description", description);
    formData.set("photo", photo);

    if (lat != null) {
      formData.set("lat", lat);
    }

    if (lon != null) {
      formData.set("lon", lon);
    }

    const fetchResponse = await fetch(ENDPOINTS.STORE_NEW_STORY_GUEST, {
      method: "POST",
      body: formData,
    });

    const json = await fetchResponse.json();
    return {
      ...json,
      ok: fetchResponse.ok,
    };
  } catch (error) {
    console.error("storeNewStory error:", error);
    return { error: true, message: error.message, ok: false };
  }
}

export async function subscribePushNotification({
  endpoint,
  keys: { p256dh, auth },
}) {
  const token = getToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unsubscribePushNotification({ endpoint }) {
  const token = getToken();
  const data = JSON.stringify({
    endpoint,
  });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
