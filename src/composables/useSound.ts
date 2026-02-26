import { useSettingsStore } from '../stores/settings'

// 预加载音频
const sounds: Record<string, HTMLAudioElement> = {}

const loadSound = (name: string, src: string) => {
  const audio = new Audio(src)
  audio.load()
  sounds[name] = audio
}

// 初始化加载
export const initSounds = () => {
  loadSound('start', '/sounds/start.mp3')
  loadSound('complete', '/sounds/complete.mp3')
  loadSound('click', '/sounds/click.mp3')
  loadSound('break', '/sounds/break.mp3')
}

export const useSound = () => {
  const settingsStore = useSettingsStore()

  const play = (name: 'start' | 'complete' | 'click' | 'break') => {
    if (!settingsStore.settings.soundEnabled) return
    
    const audio = sounds[name]
    if (!audio) return

    // 克隆音频以支持连续播放
    const clone = audio.cloneNode() as HTMLAudioElement
    clone.volume = settingsStore.settings.soundVolume
    clone.play().catch(() => {
      // 自动播放策略阻止，静默失败
    })
  }

  return { play }
}