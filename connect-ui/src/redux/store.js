import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import profileReducer from './slices/profile/profileSlice';
import settingsReducer from './slices/settings/settingsSlice';
import randomChatReducer from './slices/chat/randomChatSlice';
import moderationReducer from './slices/moderation/moderationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    settings: settingsReducer,
    randomChat: randomChatReducer,
    moderation: moderationReducer
  }
});
