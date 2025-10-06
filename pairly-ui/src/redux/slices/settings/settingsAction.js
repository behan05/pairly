import { setLoading, setError, setSetting } from './settingsSlice';
import axios from 'axios';
import { SETTINGS_API } from '@/api/config';
import { getAuthHeaders } from '@/utils/authHeaders';

/** ------------------------------
 *  PRIVACY SETTINGS
 * ------------------------------ */
export const getSettingsPrivacy = () => {
  return async (dispatch) => {
    dispatch(setLoading());
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${SETTINGS_API}/privacy-settings`, { headers });

      if (response.status === 200) {
        dispatch(setSetting({ privacySettings: response.data.privacySettings }));
        return {
          success: true,
          message: response.data.message || 'Privacy settings fetched successfully'
        };
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.error || error.message));
      return {
        success: false,
        error: error?.response?.data?.error || error.message || 'Error fetching privacy settings'
      };
    }
  };
};

export const updateSettingsPrivacy = (formData) => {
  return async (dispatch) => {
    dispatch(setLoading());
    try {
      const headers = getAuthHeaders();
      const response = await axios.patch(`${SETTINGS_API}/privacy-settings`, formData, { headers });

      if (response.status === 200) {
        dispatch(setSetting({ privacySettings: response.data.privacySettings }));
        return {
          success: true,
          message: response.data.message || 'Privacy settings updated successfully'
        };
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.error || error.message));
      console.error(error?.response?.data?.error || error.message, ': error updating privacy settings');
      return {
        success: false,
        error: error?.response?.data?.error || error.message
      };
    }
  };
};

/** ------------------------------
 *  NOTIFICATION SETTINGS
 * ------------------------------ */
export const getSettingsNotification = () => {
  return async (dispatch) => {
    dispatch(setLoading());
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${SETTINGS_API}/notification-settings`, { headers });

      if (response.status === 200) {
        dispatch(setSetting({ notificationSettings: response.data.notificationSettings }));
        return {
          success: true,
          message: response.data.message || 'Notification settings fetched successfully'
        };
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.error || error.message));
      return {
        success: false,
        error: error?.response?.data?.error || error.message
      };
    }
  };
};

export const updateSettingsNotification = (formData) => {
  return async (dispatch) => {
    dispatch(setLoading());
    try {
      const headers = getAuthHeaders();
      const response = await axios.patch(`${SETTINGS_API}/notification-settings`, formData, { headers });

      if (response.status === 200) {
        dispatch(setSetting({ notificationSettings: response.data.notificationSettings }));
        return {
          success: true,
          message: response.data.message || 'Notification settings updated successfully'
        };
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.error || error.message));
      return {
        success: false,
        error: error?.response?.data?.error || error.message
      };
    }
  };
};

/** ------------------------------
 *  CHAT SETTINGS
 * ------------------------------ */
export const getChatSettings = () => {
  return async (dispatch) => {
    dispatch(setLoading());
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${SETTINGS_API}/chat-settings`, { headers });

      if (response.status === 200) {
        dispatch(setSetting({ chatSettings: response.data.chatSettings }));
        return {
          success: true,
          message: response.data.message || 'Chat settings fetched successfully'
        };
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.error || error.message));
      return {
        success: false,
        error: error?.response?.data?.error || error.message || 'Error fetching chat settings'
      };
    }
  };
};

export const updateChatSettings = (formData) => {
  return async (dispatch) => {
    dispatch(setLoading());
    try {
      const headers = getAuthHeaders();
      const response = await axios.patch(`${SETTINGS_API}/chat-settings`, formData, { headers });

      if (response.status === 200) {
        dispatch(setSetting({ chatSettings: response.data.chatSettings }));
        return {
          success: true,
          message: response.data.message || 'Chat settings updated successfully'
        };
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.error || error.message));
      return {
        success: false,
        error: error?.response?.data?.error || error.message || 'Error updating chat settings'
      };
    }
  };
};
