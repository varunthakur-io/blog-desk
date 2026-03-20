import { useState } from 'react';
import { User, KeyRound, Bell, Shield, Palette, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useSettings } from '@/hooks/profile';

import ProfilePanel      from '@/components/settings/ProfilePanel';
import AccountPanel      from '@/components/settings/AccountPanel';
import AppearancePanel   from '@/components/settings/AppearancePanel';
import NotificationsPanel from '@/components/settings/NotificationsPanel';
import PrivacyPanel      from '@/components/settings/PrivacyPanel';

const NAV = [
  { id: 'profile',       label: 'Profile',       icon: User,    desc: 'Name, bio & avatar'       },
  { id: 'account',       label: 'Account',        icon: KeyRound, desc: 'Email & password'        },
  { id: 'appearance',    label: 'Appearance',     icon: Palette, desc: 'Theme & display'          },
  { id: 'notifications', label: 'Notifications',  icon: Bell,    desc: 'Email preferences'        },
  { id: 'privacy',       label: 'Privacy',        icon: Shield,  desc: 'Sessions & data'          },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const s = useSettings();

  const renderPanel = () => {
    switch (activeSection) {
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
      {/* Page header */}
      <div className="mb-8">
        <h1 className="page-header-title">Settings</h1>
        <p className="page-header-subtitle">Manage your account, preferences, and privacy.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
        {/* ── Sidebar nav ── */}
        <aside className="w-full md:w-56 lg:w-64 shrink-0">
          {/* Mobile: horizontal scroll */}
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {NAV.map(({ id, label, icon: Icon, desc }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 w-full shrink-0 md:shrink',
                    isActive
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-none">{label}</p>
                    <p className={cn(
                      'text-[11px] mt-0.5 truncate hidden md:block',
                      isActive ? 'text-background/70' : 'text-muted-foreground',
                    )}>
                      {desc}
                    </p>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 shrink-0 hidden md:block" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── Content panel ── */}
        <main className="flex-1 min-w-0">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm min-h-[480px]">
            {renderPanel()}
          </div>
        </main>
      </div>
    </div>
  );
}
