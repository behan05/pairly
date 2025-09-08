import axios from 'axios';
import { logout as logoutReducer } from './authSlice';
import { setError, setLoading, setUser } from './authSlice';
import { AUTH_API } from '@/api/config';

// Redux Thunk middleware
export function register(formData) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      await axios.post(`${AUTH_API}/register`, formData);

      dispatch(setLoading(false));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Signup failed';
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      return { success: false, message: errorMessage };
    }
  };
}

export function login(formData) {
  // Redux Thunk middleware
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      let response = await axios.post(`${AUTH_API}/login`, formData);
      const { user, token } = response.data;
      dispatch(
        setUser({
          user,
          token
        })
      );

      // Store in localStorage
      localStorage.setItem('token', token);
      dispatch(setLoading(false));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      dispatch(setError(errorMessage));
      return { success: false, message: errorMessage };
    }
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('token');
    dispatch(logoutReducer());
  };
}

export function forgotPassword(formData) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      await axios.post(`${AUTH_API}/forgot-password`, formData);

      dispatch(setLoading(false));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Forgot password failed';
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      return { success: false, message: errorMessage };
    }
  };
}