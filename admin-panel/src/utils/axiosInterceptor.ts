import axios, { AxiosHeaders } from "axios";

// Mocking Interceptor
const isMockEnabled = true;

axios.interceptors.request.use(
  async (config) => {
    if (isMockEnabled && config.url) {
      const endpoint = config.url.split("/").pop()?.replace(/\?.*$/, "") || "";

      try {
        console.log(`Mock data applied for endpoint: ${endpoint}`);
        const mockData = await import(`../mock/${endpoint}.json`);

        return {
          ...config,
          adapter: () =>
            Promise.resolve({
              data: mockData.default || mockData,
              status: 200,
              statusText: "OK",
              headers: { "Content-Type": "application/json" },
              config,
              request: {},
            }),
        };
      } catch (error) {
        console.warn(`Mock file for endpoint "/${endpoint}" not found.`);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response error:", error.response || error.message);

    if (error.response?.status === 401) {
      console.warn("Unauthorized, redirecting to login...");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
