import { useState } from 'react';
import { User, Shield, Bell, Palette, Lock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

import useDarkMode from '@/hooks/useDarkMode';
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
import { DashboardHeader } from '@/features/posts';
import { Settings as SettingsIcon } from 'lucide-react';

const NAV = [
  { id: 'profile', label: 'Profile', icon: User, description: 'Personal information' },
  { id: 'account', label: 'Account', icon: Lock, description: 'Email and security' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme and visuals' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alert preferences' },
  { id: 'privacy', label: 'Privacy', icon: Shield, description: 'Safety and visibility' },
];

// Settings: user preference and account management
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
    <article className="animate-in fade-in duration-700">
      <header className="mb-6">
        <DashboardHeader
          title="Settings"
          subtitle="Account management and preferences."
          icon={SettingsIcon}
        />
      </header>

      <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-16">
        {/* Categories */}
        <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-64">
          <nav className="flex flex-col gap-1" aria-label="Settings categories">
            {NAV.map(({ id, label, icon: Icon, description }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={cn(
                  'group flex items-center justify-between rounded-md px-3 py-2.5 transition-all duration-200',
                  active === id
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
                aria-current={active === id ? 'page' : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'size-4 shrink-0 transition-colors',
                      active === id ? 'text-foreground' : 'text-muted-foreground/60',
                    )}
                  />
                  <div className="flex flex-col items-start gap-1 leading-none">
                    <span className="text-[13px] font-bold tracking-tight">{label}</span>
                    <span className="hidden text-[10px] font-medium opacity-50 lg:block">
                      {description}
                    </span>
                  </div>
                </div>
                {active === id && (
                  <ChevronRight className="text-muted-foreground/30 hidden size-3 lg:block" />
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Active panel */}
        <main className="-mx-4 w-full max-w-2xl flex-1 px-4 lg:mx-0 lg:px-0">
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            {renderPanel()}
          </div>
        </main>
      </div>
    </article>
  );
}
