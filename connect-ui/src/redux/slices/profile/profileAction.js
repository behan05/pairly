import { PROFILE_API } from '@/api/config';
import axios from 'axios';
import { setLoading, setError, setProfileData } from './profileSlice';
import { getAuthHeaders } from '@/utils/authHeaders';

// Fetches the user's profile data from the server
// This function retrieves the current profile data for the user
// and updates the Redux store with the fetched profile data
export function getProfile() {
  return async (dispatch) => {
    const headers = getAuthHeaders();

    if (!headers) {
      dispatch(setError('No token found. Please log in.'));
      return { success: false };
    }

    dispatch(setLoading());

    try {
      const response = await axios.get(`${PROFILE_API}/my-profile`, { headers });

      if (response.status === 200) {
        dispatch(setProfileData(response.data.profile));
        return { success: true };
      } else {
        dispatch(setError('Failed to fetch profile data.'));
        return { success: false };
      }
    } catch (error) {
      dispatch(
        setError(error?.response?.data?.error || 'An error occurred while fetching profile data.')
      );
      return {
        success: false,
        error: error?.response?.data?.error || 'An error occurred while fetching profile data.'
      };
    }
  };
}

// Updates the user's general profile information on the server
// This function sends the updated profile data to the server
// and updates the Redux store with the new profile data
export function updateGeneralInfo(formData) {
  return async (dispatch) => {
    const headers = getAuthHeaders();

    if (!headers) {
      dispatch(setError('No token found. Please log in.'));
      return { success: false };
    }

    dispatch(setLoading());
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(`${PROFILE_API}/general-info`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        dispatch(setProfileData(response.data.profile));
        return { success: true, message: response.data.message || 'Profile updated successfully!' };
      }
    } catch (error) {
      dispatch(
        setError(error?.response?.data?.error || 'An error occurred while updating general info.')
      );
      return {
        success: false,
        error: error?.response?.data?.error || 'An error occurred while updating general info.'
      };
    }
  };
}

// Updates the user's matching preferences on the server
// This function sends the updated matching preferences to the server
// and updates the Redux store with the new preferences
export function updateMatchingPreferences(formData) {
  return async (dispatch) => {
    const headers = getAuthHeaders();
    if (!headers) {
      dispatch(setError('No token found. Please log in.'));
      return { success: false };
    }

    dispatch(setLoading());

    try {
      const response = await axios.patch(`${PROFILE_API}/matching-preferences`, formData, {
        headers
      });

      if (response.status === 200) {
        dispatch(setProfileData(response.data.profile));
        return {
          success: true,
          message: response.data.message || 'Matching preferences updated successfully!'
        };
      }
    } catch (error) {
      dispatch(
        setError(
          error?.response?.data?.error || 'An error occurred while updating matching preferences.'
        )
      );
      return {
        success: false,
        error:
          error?.response?.data?.error || 'An error occurred while updating matching preferences.'
      };
    }
  };
}

// Updates the user's tags and interests on the server
// This function sends the updated tags and interests to the server
// and updates the Redux store with the new tags and interests
export function updateTagsAndInterests(formData) {
  return async (dispatch) => {
    const headers = getAuthHeaders();
    if (!headers) {
      dispatch(setError('No token found. Please log in.'));
      return { success: false };
    }

    dispatch(setLoading());

    try {
      const response = await axios.patch(`${PROFILE_API}/tags-and-interests`, formData, {
        headers
      });

      if (response.status === 200) {
        dispatch(setProfileData(response.data.profile));
        return { success: true };
      }
    } catch (error) {
      dispatch(
        setError(
          error?.response?.data?.error || 'An error occurred while updating tags and interests.'
        )
      );
      return { success: false };
    }
  };
}
