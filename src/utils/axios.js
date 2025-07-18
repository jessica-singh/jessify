// utils/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api', // ✅ crucial
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;



// import axios from 'axios';

// const instance = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   withCredentials: true,
// });

// instance.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem('auth_token'); // ⬅ consistent with auth.js
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // 🚫 Don't auto logout on 401 if token doesn't exist (e.g., on initial render)
// instance.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     const token = sessionStorage.getItem('auth_token');
//     if (err.response?.status === 401 && token) {
//       sessionStorage.removeItem('auth_token');
//       sessionStorage.removeItem('auth_user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(err);
//   }
// );

// export default instance;
