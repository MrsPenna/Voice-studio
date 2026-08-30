import { useEffect, useState, useCallback } from 'react';
import { useVoiceProfileStore } from '@store/voiceProfileStore';
import { VoiceProfile } from '@types/index';

export interface UseVoicePresetReturn {
  profiles: VoiceProfile[];
  currentProfile: VoiceProfile | null;
  isLoading: boolean;
  loadProfiles: () => Promise<void>;
  selectProfile: (id: string) => void;
  createProfile: (profile: VoiceProfile) => Promise<void>;
  updateProfile: (id: string, updates: Partial<VoiceProfile>) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  applyPreset: (presetName: string) => VoiceProfile | null;
}

const VOICE_PRESETS: Record<string, Partial<VoiceProfile>> = {
  professional: {
    warmth: 100,
    speed: 100,
    volume: 100
  },
  energetic: {
    warmth: 75,
    speed: 125,
    volume: 120
  },
  calm: {
    warmth: 125,
    speed: 75,
    volume: 85
  },
  announcer: {
    warmth: 110,
    speed: 95,
    volume: 110
  },
  storyteller: {
    warmth: 130,
    speed: 85,
    volume: 95
  }
};

export const useVoicePreset = (): UseVoicePresetReturn => {
  const {
    profiles,
    currentProfile,
    isLoading,
    loadProfiles,
    loadProfile,
    setCurrentProfile,
    createProfile: storeCreateProfile,
    updateProfile: storeUpdateProfile,
    deleteProfile: storeDeleteProfile
  } = useVoiceProfileStore();

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const selectProfile = useCallback((id: string) => {
    loadProfile(id);
  }, [loadProfile]);

  const applyPreset = useCallback((presetName: string): VoiceProfile | null => {
    const preset = VOICE_PRESETS[presetName];
    if (!preset || !currentProfile) return null;

    const updated = { ...currentProfile, ...preset };
    setCurrentProfile(updated);
    return updated;
  }, [currentProfile, setCurrentProfile]);

  return {
    profiles,
    currentProfile,
    isLoading,
    loadProfiles,
    selectProfile,
    createProfile: storeCreateProfile,
    updateProfile: storeUpdateProfile,
    deleteProfile: storeDeleteProfile,
    applyPreset
  };
};

export default useVoicePreset;
