const API_BASE_URL = window.AGRILINK_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
const ACCESS_KEY = "farmcycle_access_token";
const REFRESH_KEY = "farmcycle_refresh_token";

function parseJsonSafe(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

async function request(path, options = {}) {
  const token = localStorage.getItem(ACCESS_KEY);
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const bodyText = await response.text();
  const data = bodyText ? parseJsonSafe(bodyText) : {};
  if (!response.ok) {
    let message = data.detail || data.error || data.message;
    
    if (!message && typeof data === 'object') {
      // Handle field-specific errors (e.g. {"username": ["..."]})
      const firstKey = Object.keys(data)[0];
      if (firstKey) {
        const error = data[firstKey];
        message = Array.isArray(error) ? `${firstKey}: ${error[0]}` : `${firstKey}: ${error}`;
      }
    }

    throw new Error(message || `Request failed (${response.status})`);
  }
  return data;
}

function setTokens(tokens) {
  if (tokens?.access) localStorage.setItem(ACCESS_KEY, tokens.access);
  if (tokens?.refresh) localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

window.AgriApi = {
  API_BASE_URL,

  clearAuth() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },

  async register({ username, email, password, role }) {
    const data = await request("/auth/register/", {
      method: "POST",
      body: JSON.stringify({ username, email, password, role }),
    });
    setTokens(data.tokens);
    return data;
  },

  async login({ username, password }) {
    const data = await request("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    setTokens(data);
    return data;
  },

  async me() {
    return request("/auth/me/");
  },

  async listSuppliers() {
    return request("/suppliers/");
  },

  async createSupplier(payload) {
    return request("/suppliers/", { method: "POST", body: JSON.stringify(payload) });
  },

  async listFarmers() {
    return request("/farmers/");
  },

  async createFarmer(payload) {
    return request("/farmers/", { method: "POST", body: JSON.stringify(payload) });
  },

  async listListings(query = "") {
    return request(`/listings/${query ? `?${query}` : ""}`);
  },

  async createListing(payload) {
    return request("/listings/", { method: "POST", body: JSON.stringify(payload) });
  },

  async listRequests(view = "") {
    return request(`/requests/${view ? `?view=${view}` : ""}`);
  },

  async createRequest(payload) {
    return request("/requests/", { method: "POST", body: JSON.stringify(payload) });
  },
};
