import { profileService, setUserProfile } from '@/features/profile';

export const getUniqueProfileIds = (items, getId) => {
  return [...new Set(items.map(getId).filter(Boolean))];
};

export const prefetchProfiles = async (dispatch, userIds, label = 'Profile prefetch') => {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  if (uniqueIds.length === 0) return;

  try {
    const profiles = await profileService.getProfilesByIds(uniqueIds);
    profiles.forEach((profile) => dispatch(setUserProfile(profile)));
  } catch (error) {
    console.warn(`${label} failed:`, error);
  }
};
