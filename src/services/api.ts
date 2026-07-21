import axios from "axios";

/**
 * Tambahan flag di request config. Dipakai untuk menandai
 * endpoint yang 401-nya bukan sesi expired — jadi response
 * interceptor tidak auto-redirect ke /login.
 *
 * Contoh: /auth/login mengirim 401 ketika kredensial salah;
 * itu bagian dari flow login, bukan sesi yang mati.
 */
declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {'Content-Type': 'application/json'}
});

/**
 * Interceptor - otomatis attach token ke setiap request
 * Mirip seperti middleware BE, tapi ini untuk FE
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const skipRedirect = error.config?.skipAuthRedirect === true;

    if(error.response?.status == 401 && !skipRedirect) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
)


export default api;
