import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

import authReducer from './slices/auth/authSlice';
import profileReducer from './slices/profile/profileSlice';
import settingsReducer from './slices/settings/settingsSlice';
import randomChatReducer from './slices/randomChat/randomChatSlice';
import friendRequestReducer from './slices/randomChat/friendRequestSlice';
import moderationReducer from './slices/moderation/moderationSlice';
import privateChatReducer from './slices/privateChat/privateChatSlice';
import sleepSpaceReducer from './slices/sleepSpace/sleepSpaceRequest';
import themeReducer from "./slices/theme/themeSlice";

// persist only the auth slice
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
};

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  settings: settingsReducer,
  randomChat: randomChatReducer,
  friendRequest: friendRequestReducer,
  moderation: moderationReducer,
  privateChat: privateChatReducer,
  sleepSpace: sleepSpaceReducer,
  theme: themeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
