import { setLoading, setError, setSetting } from './settingsSlice';
import axios from 'axios';
import { SETTINGS_API } from '@/api/config';
import { getAuthHeaders } from '@/utils/authHeaders';

// Fetches the user's privacy settings from the server
// This function retrieves the current privacy settings for the user
// and updates the Redux store with the fetched settings
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
          message: response.data.message || 'Settings fetched successfully'
        };
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.error || error.message));
      return {
        success: false,
        error: error?.response?.data?.error || error.message || 'Error fetching settings'
      };
    }
  };
};

// Updates the user's privacy settings on the server
// This function sends the updated privacy settings to the server
// and updates the Redux store with the new settings
export const updateSettingsPrivacy = (formData) => {
  return async (dispatch) => {
    dispatch(setLoading());

    try {
      const headers = getAuthHeaders();
      const response = await axios.patch(`${SETTINGS_API}/privacy-settings`, formData, { headers });
      if (response.status === 200) {
        dispatch(setSetting({ notificationSettings: response.data.notificationSettings }));

        return {
          success: true,
          message: response.data.message || 'Settings updated successfully'
        };
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.error || error.message));
      console.error(error?.response?.data?.error || error.message, ': error fetching settings');
      return {
        success: false,
        error: error?.response?.data?.error || error.message
      };
    }
  };
};

// Fetches the user's notification settings from the server
// This function retrieves the current notification settings for the user
// and updates the Redux store with the fetched settings
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

// Updates the user's notification settings on the server
// This function sends the updated notification settings to the server
// and updates the Redux store with the new settings
export const updateSettingsNotification = (formData) => {
  return async (dispatch) => {
    dispatch(setLoading());

    try {
      const headers = getAuthHeaders();
      const response = await axios.patch(`${SETTINGS_API}/notification-settings`, formData, {
        headers
      });
      if (response.status === 200) {
        dispatch(setSetting(response.data.notificationSettings));
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

// Fetches the user's chat settings from the server
// This function retrieves the current chat settings for the user
// and updates the Redux store with the fetched settings
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
          message: response.data.message || 'Notification settings fetched successfully'
        };
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.error || error.message));
      return {
        success: false,
        error: error?.response?.data?.error || error?.message || 'Error fetching chat settings'
      };
    }
  };
};

// Updates the user's chat settings on the server
// This function sends the updated chat settings to the server
// and updates the Redux store with the new settings
export const updateChatSettings = (formData) => {
  return async (dispatch) => {
    dispatch(setLoading());

    try {
      const headers = getAuthHeaders();
      const response = await axios.patch(`${SETTINGS_API}/chat-settings`, formData, { headers });
      if (response.status === 200) {
        dispatch(setSetting(response.data.chatSettings));
        return {
          success: true,
          message: response.data.message || 'Chat settings updated successfully'
        };
      }
    } catch (error) {
      dispatch(
        setError(error?.response?.data?.error || error.message || 'Error updating chat settings')
      );
      return {
        success: false,
        error: error?.response?.data?.error || error?.message || 'Error updating chat settings'
      };
    }
  };
};
