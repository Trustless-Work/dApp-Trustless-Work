const SOUND_SOURCES = {
  accept: "/sounds/accept.mp3",
  delete: "/sounds/delete.mp3",
} as const;

export type SoundType = keyof typeof SOUND_SOURCES;

const audioCache = new Map<SoundType, HTMLAudioElement>();

function getAudio(type: SoundType): HTMLAudioElement | null {
  if (typeof window === "undefined") {
    return null;
  }

  const cached = audioCache.get(type);
  if (cached) {
    return cached;
  }

  const audio = new Audio(SOUND_SOURCES[type]);
  audio.preload = "auto";
  audioCache.set(type, audio);
  return audio;
}

export function playSound(type: SoundType): void {
  const audio = getAudio(type);
  if (!audio) {
    return;
  }

  audio.currentTime = 0;
  void audio.play().catch(() => {
    // Browser may block playback without a recent user gesture.
  });
}
