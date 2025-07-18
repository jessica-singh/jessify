// utils/auth.js

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const saveAuth = (token, user) => {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);

export const getUser = () => JSON.parse(sessionStorage.getItem(USER_KEY));

export const logout = () => {
  const token = getToken();
  if (token) {
    localStorage.setItem('logout', JSON.stringify({ token, timestamp: Date.now() }));
  }
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => !!getToken();
