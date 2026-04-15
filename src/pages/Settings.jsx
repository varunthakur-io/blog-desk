import { useState } from 'react';
import { User, Shield, Bell, Palette, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

import useDarkMode from '@/hooks/common/useDarkMode';
import {
  useProfileSettings,
  useAccountSettings,
  useNotificationSettings,
  usePrivacySettings,
} from '@/features/settings/hooks';

import ProfilePanel from '@/features/settings/components/ProfilePanel';
import AccountPanel from '@/features/settings/components/AccountPanel';
import AppearancePanel from '@/features/settings/components/AppearancePanel';
import NotificationsPanel from '@/features/settings/components/NotificationsPanel';
import PrivacyPanel from '@/features/settings/components/PrivacyPanel';

const NAV = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
];

export default function Settings() {
  const [active, setActive] = useState('profile');
  const [isDarkMode, setDarkMode] = useDarkMode();

  const profile = useProfileSettings();
  const account = useAccountSettings();
  const notifications = useNotificationSettings();
  const privacy = usePrivacySettings();

  const handleToggleDarkMode = (checked) => {
    setDarkMode(checked);
  };

  const renderPanel = () => {
    switch (active) {
      case 'profile':
        return (
          <ProfilePanel
            profileForm={profile.profileForm}
            setProfileForm={profile.setProfileForm}
            avatarPreview={profile.avatarPreview}
            fileInputRef={profile.fileInputRef}
            handleAvatarSelect={profile.handleAvatarSelect}
            handleSaveProfile={profile.handleSaveProfile}
            isSavingProfile={profile.isSavingProfile}
            profileError={profile.profileError}
            authUser={profile.authUser}
          />
        );
      case 'account':
        return (
          <AccountPanel
            authUser={account.authUser}
            emailForm={account.emailForm}
            setEmailForm={account.setEmailForm}
            emailError={account.emailError}
            handleSaveEmail={account.handleSaveEmail}
            isSavingEmail={account.isSavingEmail}
            passwordForm={account.passwordForm}
            setPasswordForm={account.setPasswordForm}
            passwordError={account.passwordError}
            handleSavePassword={account.handleSavePassword}
            isSavingPassword={account.isSavingPassword}
          />
        );
      case 'appearance':
        return (
          <AppearancePanel isDarkMode={isDarkMode} handleToggleDarkMode={handleToggleDarkMode} />
        );
      case 'notifications':
        return (
          <NotificationsPanel
            prefs={notifications.prefs}
            isPrefsLoading={notifications.isPrefsLoading}
            handlePrefChange={notifications.handlePrefChange}
          />
        );
      case 'privacy':
        return (
          <PrivacyPanel
            isUpdatingSession={privacy.isUpdatingSession}
            isSessionsDialogOpen={privacy.isSessionsDialogOpen}
            setIsSessionsDialogOpen={privacy.setIsSessionsDialogOpen}
            isDeleteDialogOpen={privacy.isDeleteDialogOpen}
            setIsDeleteDialogOpen={privacy.setIsDeleteDialogOpen}
            handleDeleteSessions={privacy.handleDeleteSessions}
            handleDeleteAccount={privacy.handleDeleteAccount}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">
          Settings
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Modern Tabs Navigation */}
        <div className="flex items-center gap-6 overflow-x-auto pb-px border-b border-border/50 no-scrollbar">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={cn(
                'flex items-center gap-2 pb-4 text-sm font-bold transition-all relative whitespace-nowrap',
                active === id
                  ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Active Panel Content */}
        <div className="max-w-2xl py-2">
          {renderPanel()}
        </div>
      </div>
    </div>
  );
}
