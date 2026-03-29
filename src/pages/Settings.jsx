import { useState } from 'react';
import { User, Shield, Bell, Palette, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

import useDarkMode from '@/hooks/common/useDarkMode';
import {
  useProfileSettings,
  useAccountSettings,
  useNotificationSettings,
  usePrivacySettings,
  ProfilePanel,
  AccountPanel,
  AppearancePanel,
  NotificationsPanel,
  PrivacyPanel,
} from '@/features/settings';

const NAV = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Shield },
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
    <div className="page-root flex gap-8 min-h-[70vh]">
      {/* Sidebar — desktop */}
      <aside className="hidden md:block w-48 shrink-0">
        <div className="sticky top-24 pr-6 min-h-[calc(100vh-6rem)]">
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent hidden lg:block" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
            Settings
          </p>
          <nav className="space-y-0.5">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-left',
                  active === id
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden w-full">
        <div className="flex gap-1 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap border transition-colors shrink-0',
                active === id
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="h-3 w-3" />
              {label}
            </button>
          ))}
        </div>
        <div className="max-w-2xl">{renderPanel()}</div>
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 hidden md:block">
        <div className="max-w-2xl">{renderPanel()}</div>
      </main>
    </div>
  );
}
