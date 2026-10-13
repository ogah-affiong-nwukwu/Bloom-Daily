import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { toast } from '../lib/toast'
import { PauseIcon, PlayIcon } from './icons'
import styles from './AmbientPlayer.module.css'

const AMBIENT_SRC = '/audio/calm-piano.wav'

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00'
  const total = Math.max(0, Math.ceil(seconds))
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

interface AmbientPlayerProps {
  label?: string
  tagline?: string
}

export function AmbientPlayer({
  label = 'Calm instrumental',
  tagline = '“Be still, and know that I am God.” — Psalm 46:10',
}: AmbientPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    const onVisibility = () => {
      if (document.hidden) audio?.pause()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      audio?.pause()
    }
  }, [])

  const togglePlayback = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      return
    }
    void audio.play().catch(() => {
      setPlaying(false)
      toast('The ambient track couldn’t load')
    })
  }

  const seek = (event: MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    const track = trackRef.current
    if (!audio || !track || !audio.duration) return
    const rect = track.getBoundingClientRect()
    const fraction = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    audio.currentTime = fraction * audio.duration
    if (fillRef.current) fillRef.current.style.width = `${fraction * 100}%`
    if (timeRef.current) timeRef.current.textContent = formatTime(audio.duration - audio.currentTime)
  }

  return (
    <div className={styles.player}>
      <audio
        ref={audioRef}
        className={styles.audio}
        src={AMBIENT_SRC}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false)
          toast('The ambient track couldn’t load')
        }}
        onLoadedMetadata={(event) => {
          if (timeRef.current) timeRef.current.textContent = formatTime(event.currentTarget.duration)
        }}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget
          if (audio.duration > 0 && fillRef.current) {
            fillRef.current.style.width = `${(audio.currentTime / audio.duration) * 100}%`
          }
          if (timeRef.current) timeRef.current.textContent = formatTime(audio.duration - audio.currentTime)
        }}
      />
      <button
        className={styles.play}
        type="button"
        onClick={togglePlayback}
        aria-label={playing ? 'Pause ambient sound' : 'Play ambient sound'}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div className={styles.body}>
        <span className={styles.label}>{label}</span>
        <span className={styles.tagline}>{tagline}</span>
        <div
          className={styles.track}
          ref={trackRef}
          role="slider"
          aria-label="Track progress"
          aria-valuemin={0}
          aria-valuemax={100}
          onClick={seek}
        >
          <div className={styles.fill} ref={fillRef} />
        </div>
      </div>
      <span className={styles.time} ref={timeRef}>
        0:00
      </span>
    </div>
  )
}
