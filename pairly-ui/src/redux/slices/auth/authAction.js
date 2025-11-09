import axios from 'axios';
import { logout as logoutReducer } from './authSlice';
import { setError, setLoading, setUser } from './authSlice';
import { AUTH_API } from '@/api/config';

// Redux Thunk middleware
export function register(formData) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    // Store user unverified email temporarily for OTP verification
    localStorage.setItem('pendingEmail', formData.email);

    try {
      const res = await axios.post(`${AUTH_API}/register`, formData);

      if (res?.data?.success) {
        dispatch(setLoading(false));
        return {
          success: true,
          message:
            res?.data?.message ||
            'We’ve sent an OTP. Please check your inbox and verify your email.',
        };
      } else {
        dispatch(setLoading(false));
        return {
          success: false,
          error: res?.data?.error || 'Signup failed',
        };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Signup failed';
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      return { success: false, error: errorMessage };
    }
  };
}

export function login(formData) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await axios.post(`${AUTH_API}/login`, formData);

      // Email not verified case
      if (res.data.success && res.data.isVerifyEmail === false) {
        localStorage.setItem('pendingEmail', res.data.pendingEmail);
        dispatch(setLoading(false));
        return { success: true, redirectToVerify: true };
      }

      // Normal login success
      if (res.data.success && res.data.isVerifyEmail === true) {
        const { user, token } = res.data;
        dispatch(setUser({ user, token }));
        localStorage.setItem('token', token);
        dispatch(setLoading(false));
        return { success: true };
      }

      // Unknown failure
      const errorMessage = res.data.error || 'Login failed.';
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      return { success: false, error: errorMessage };

    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed.';
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      return { success: false, error: errorMessage };
    }
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('token');
    dispatch(logoutReducer());
  };
}

export function resetPassword(formData) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      await axios.post(`${AUTH_API}/reset-password`, formData);

      dispatch(setLoading(false));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Reset password failed';
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      return { success: false, message: errorMessage };
    }
  };
}