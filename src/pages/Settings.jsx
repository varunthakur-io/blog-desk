import { useState } from 'react';
import { User, Shield, Bell, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { useSettings } from '@/hooks/profile';

import ProfilePanel       from '@/components/settings/ProfilePanel';
import AccountPanel       from '@/components/settings/AccountPanel';
import AppearancePanel    from '@/components/settings/AppearancePanel';
import NotificationsPanel from '@/components/settings/NotificationsPanel';
import PrivacyPanel       from '@/components/settings/PrivacyPanel';

const NAV = [
  { id: 'profile',       label: 'Profile',       icon: User   },
  { id: 'account',       label: 'Account',        icon: Shield },
  { id: 'appearance',    label: 'Appearance',     icon: Menu   },
  { id: 'notifications', label: 'Notifications',  icon: Bell   },
  { id: 'privacy',       label: 'Privacy',        icon: Shield },
];

export default function Settings() {
  const [active, setActive]         = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="bg-background -mx-4 sm:-mx-6 lg:-mx-8 min-h-[calc(100vh-4rem)]">

      {/* Mobile menu button */}
      <div className="fixed top-20 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Fixed sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-56 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="p-5 pt-20">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            Settings
          </p>
          <nav className="space-y-0.5">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActive(id); setSidebarOpen(false); }}
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
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-56">
        <div className="p-6 lg:p-8">
          <div className="mx-auto max-w-2xl animate-in fade-in duration-300">
            {renderPanel()}
          </div>
        </div>
      </div>

    </div>
  );
}
