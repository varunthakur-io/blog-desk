import { useState } from 'react';
import { User, KeyRound, Bell, Shield, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useSettings } from '@/hooks/profile';

import ProfilePanel       from '@/components/settings/ProfilePanel';
import AccountPanel       from '@/components/settings/AccountPanel';
import AppearancePanel    from '@/components/settings/AppearancePanel';
import NotificationsPanel from '@/components/settings/NotificationsPanel';
import PrivacyPanel       from '@/components/settings/PrivacyPanel';

const NAV = [
  { id: 'profile',       label: 'Profile',       icon: User     },
  { id: 'account',       label: 'Account',        icon: KeyRound },
  { id: 'appearance',    label: 'Appearance',     icon: Palette  },
  { id: 'notifications', label: 'Notifications',  icon: Bell     },
  { id: 'privacy',       label: 'Privacy',        icon: Shield   },
];

export default function Settings() {
  const [active, setActive] = useState('profile');
  const s = useSettings();

  const renderPanel = () => {
    switch (active) {
      case 'profile':
        return (
          <ProfilePanel
            profileForm={s.profileForm}
            setProfileForm={s.setProfileForm}
            avatarPreview={s.avatarPreview}
            fileInputRef={s.fileInputRef}
            handleAvatarSelect={s.handleAvatarSelect}
            handleSaveProfile={s.handleSaveProfile}
            isSavingProfile={s.isSavingProfile}
            profileError={s.profileError}
            authUser={s.authUser}
          />
        );
      case 'account':
        return (
          <AccountPanel
            authUser={s.authUser}
            emailForm={s.emailForm}
            setEmailForm={s.setEmailForm}
            emailError={s.emailError}
            handleSaveEmail={s.handleSaveEmail}
            isSavingEmail={s.isSavingEmail}
            passwordForm={s.passwordForm}
            setPasswordForm={s.setPasswordForm}
            passwordError={s.passwordError}
            handleSavePassword={s.handleSavePassword}
            isSavingPassword={s.isSavingPassword}
          />
        );
      case 'appearance':
        return (
          <AppearancePanel
            isDarkMode={s.isDarkMode}
            handleToggleDarkMode={s.handleToggleDarkMode}
          />
        );
      case 'notifications':
        return (
          <NotificationsPanel
            prefs={s.prefs}
            isPrefsLoading={s.isPrefsLoading}
            handlePrefChange={s.handlePrefChange}
          />
        );
      case 'privacy':
        return (
          <PrivacyPanel
            isUpdatingSession={s.isUpdatingSession}
            isSessionsDialogOpen={s.isSessionsDialogOpen}
            setIsSessionsDialogOpen={s.setIsSessionsDialogOpen}
            isDeleteDialogOpen={s.isDeleteDialogOpen}
            setIsDeleteDialogOpen={s.setIsDeleteDialogOpen}
            handleDeleteSessions={s.handleDeleteSessions}
            handleDeleteAccount={s.handleDeleteAccount}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-2 animate-in fade-in duration-500">
      {/* Header — matches Dashboard / Profile style */}
      <div className="mb-8">
        <h1 className="page-header-title">Settings</h1>
        <p className="page-header-subtitle">
          Manage your account, preferences, and privacy.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-40 shrink-0">
          <nav className="flex flex-col gap-0.5">
            {NAV.map(({ id, label, icon: Icon }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-left transition-colors w-full',
                    isActive
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content — max-w-md matches the rest of the app's form widths */}
        <main className="flex-1 min-w-0 max-w-md">
          {renderPanel()}
        </main>
      </div>
    </div>
  );
}
