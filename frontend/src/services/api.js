import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

// Seller APIs
export const sellerAPI = {
  getContact: (sellerId) => api.get(`/seller/${sellerId}/contact`),
};

// Product APIs
export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getMine: () => api.get("/products/mine"),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Favorites APIs
export const favoriteAPI = {
  getAll: () => api.get("/favorites"),
  add: (productId) => api.post("/favorites", { product_id: productId }),
  delete: (id) => api.delete(`/favorites/${id}`),
};

// Messages APIs
export const messageAPI = {
  getInbox: () => api.get("/messages"),
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  send: (data) => api.post("/messages", data),
  delete: (id) => api.delete(`/messages/${id}`),
};

// Business Profile APIs
export const businessAPI = {
  getProfile: () => api.get("/business-profile"),
  getProfileByUserId: (userId) => api.get(`/business-profile/${userId}`),
  create: (data) => api.post("/business-profile", data),
  update: (data) => api.put("/business-profile", data),
};

export default api;
