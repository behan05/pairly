import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import Home from '@/pages/public/Home';
import About from '@/pages/public/About';
import Features from '@/pages/public/Features';
import Contact from '@/pages/public/Contact';
import Login from '@/pages/public/Login';
import Register from '@/pages/public/Signup';
import FAQs from '@/pages/public/FAQs';
import { SidebarProvider } from '@/context/SidebarContext';
import PrivacyPolicyPage from '@/components/common/PrivacyPolicyPage';
import TermsOfUsePage from '@/components/common/TermsOfUsePage';
import PageNotFound from '@/components/common/PageNotFound';
import ReportBug from '@/components/common/ReportBug';

import PrivateRoute from '@/middleware/PrivateRoute';

// Settings
import Settings from '@/pages/private/settings/Settings';
import SettingsLayout from '@/pages/private/settings/SettingsLayout';
import AccountLayout from '@/pages/private/settings/account/AccountLayout';
import Account from '@/pages/private/settings/account/Account';
import RequestAccountInfo from '@/pages/private/settings/account/reqAccountInfo/RequestAccountInfo';
import AccountDelete from '@/pages/private/settings/account/accountDelete/AccountDelete';
import ChangeCredentials from '../pages/private/settings/account/changeCredentials/ChangeCredentials';
import PrivacyLayout from '@/pages/private/settings/privacy/PrivacyLayout';
import Privacy from '@/pages/private/settings/privacy/Privacy';
import ChatsLayout from '@/pages/private/settings/chats/ChatsLayout';
import Chats from '@/pages/private/settings/chats/Chats';
import NotificationsLayout from '@/pages/private/settings/notifications/NotificationsLayout';
import Notifications from '@/pages/private/settings/notifications/Notifications';
import HelpLayout from '@/pages/private/settings/help/HelpLayout';
import Help from '@/pages/private/settings/help/Help';
import HelpFAQs from '@/pages/private/settings/help/HelpFAQs';
import HelpContact from '@/pages/private/settings/help/HelpContact';
import HelpPrivacyPolicy from '@/pages/private/settings/help/HelpPrivacyPolicy';
import HelpReport from '@/pages/private/settings/help/HelpReport';

// Profile
import ProfileLayout from '@/pages/private/profile/ProfileLayout';
import Profile from '@/pages/private/profile/Profile';
import CompletionAndActivity from '@/pages/private/profile/CompletionAndActivity';
import GeneralInfo from '@/pages/private/profile/GeneralInfo';
import MatchingPreferences from '@/pages/private/profile/MatchingPreferences';
import TagsAndInterests from '@/pages/private/profile/TagsAndInterests';

// Random Chat
import RandomChatLayout from '@/features/chat/random/RandomChatLayout';
import RandomSidebar from '@/features/chat/random/components/coreComponents/RandomSidebar';
import BlockedList from '@/features/chat/common/BlockedList';

// Chat History
import ChatSidebar from '@/pages/private/connect/normal/ChatSidebar';
import ChatUI from '@/pages/private/connect/normal/ChatUI';

export const routes = createBrowserRouter([
  // === Public routes ===
  {
    path: '/',
    element: (
      <SidebarProvider>
        <PublicLayout />
      </SidebarProvider>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'features', element: <Features /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'faq', element: <FAQs /> },
      { path: 'report', element: <ReportBug /> },
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
      { path: 'terms-of-use', element: <TermsOfUsePage /> },
      { path: '*', element: <PageNotFound redirectTo={'/'} /> }
    ]
  },

  // === Protected routes ===
  {
    path: '/connect',
    element: <PrivateRoute />,
    children: [
      {
        element: <RandomChatLayout />,
        children: [
          // Default view at /connect
          { index: true, element: <RandomSidebar /> },
          { path: 'blocked-users', element: <BlockedList /> },

          // Settings
          {
            path: 'settings',
            element: <SettingsLayout />,
            children: [
              { index: true, element: <Settings /> },
              { path: 'profile', element: <Profile /> },

              {
                path: 'account',
                element: <AccountLayout />,
                children: [
                  { index: true, element: <Account /> },
                  { path: 'change-credentials', element: <ChangeCredentials /> },
                  { path: 'request-info', element: <RequestAccountInfo /> },
                  { path: 'delete-account', element: <AccountDelete /> }
                ]
              },

              {
                path: 'privacy',
                element: <PrivacyLayout />,
                children: [{ index: true, element: <Privacy /> }]
              },

              {
                path: 'chats',
                element: <ChatsLayout />,
                children: [{ index: true, element: <Chats /> }]
              },

              {
                path: 'notifications',
                element: <NotificationsLayout />,
                children: [{ index: true, element: <Notifications /> }]
              },

              {
                path: 'help',
                element: <HelpLayout />,
                children: [
                  { index: true, element: <Help /> },
                  { path: 'faqs-help', element: <HelpFAQs /> },
                  { path: 'contact-help', element: <HelpContact /> },
                  { path: 'privacy-policy', element: <HelpPrivacyPolicy /> },
                  { path: 'report-problem', element: <HelpReport /> }
                ]
              }
            ]
          },

          // Profile (main section)
          {
            path: 'profile',
            element: <ProfileLayout />,
            children: [
              { index: true, element: <Profile /> },
              { path: 'activity', element: <CompletionAndActivity /> },
              { path: 'general-info', element: <GeneralInfo /> },
              { path: 'matching-preferences', element: <MatchingPreferences /> },
              { path: 'interests', element: <TagsAndInterests /> }
            ]
          }
        ]
      },

      // Chat History
      {
        path: 'chat',
        element: <ChatUI />,
        children: [{ index: true, element: <ChatSidebar /> }]
      },
      // Fallback for unmatched /connect/* routes
      { path: '*', element: <PageNotFound redirectTo="/connect" /> }
    ]
  }
]);
