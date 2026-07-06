import { Preferences } from '@capacitor/preferences';
import type { Profile } from '../types/Profile';
import { createEmptyProfile } from '../types/Profile';

const PROFILE_STORAGE_KEY = 'teamreport_mavis_profile';

/**
 * Returns the saved profile, or an empty default profile
 * if nothing has been saved yet.
 */
export async function getProfile(): Promise<Profile> {
  try {
    const result = await Preferences.get({ key: PROFILE_STORAGE_KEY });
    if (!result.value) return createEmptyProfile();
    return JSON.parse(result.value) as Profile;
  } catch (error) {
    console.error('profileService: failed to read profile', error);
    return createEmptyProfile();
  }
}

/**
 * Saves/overwrites the profile.
 */
export async function saveProfile(profile: Profile): Promise<void> {
  try {
    await Preferences.set({
      key: PROFILE_STORAGE_KEY,
      value: JSON.stringify(profile),
    });
  } catch (error) {
    console.error('profileService: failed to save profile', error);
    throw error;
  }
}