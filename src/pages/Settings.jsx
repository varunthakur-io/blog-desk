import { useState } from 'react';
import { User, Shield, Bell, Palette, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useSettings } from '@/hooks/profile';

import ProfilePanel       from '@/components/settings/ProfilePanel';
import AccountPanel       from '@/components/settings/AccountPanel';
import AppearancePanel    from '@/components/settings/AppearancePanel';
import NotificationsPanel from '@/components/settings/NotificationsPanel';
import PrivacyPanel       from '@/components/settings/PrivacyPanel';

const NAV = [
  { id: 'profile',       label: 'Profile',       icon: User    },
  { id: 'account',       label: 'Account',        icon: Lock    },
  { id: 'appearance',    label: 'Appearance',     icon: Palette },
  { id: 'notifications', label: 'Notifications',  icon: Bell    },
  { id: 'privacy',       label: 'Privacy',        icon: Shield  },
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
    <div className="flex gap-8 animate-in fade-in duration-300 min-h-[70vh]">

      {/* Sidebar — inline, not fixed */}
      <aside className="hidden md:block w-48 shrink-0">
        <div className="sticky top-24">
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

      {/* Mobile: horizontal pill tabs */}
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

      {/* Content — desktop */}
      <main className="flex-1 min-w-0 max-w-2xl hidden md:block">
        {renderPanel()}
      </main>

    </div>
  );
}
