import { useCallback, useRef } from 'react';

type SoundType = 'wave' | 'happy' | 'excited' | 'thinking' | 'message' | 'send' | 'open' | 'close';

// Web Audio API based sound generator
export function useRobotSounds() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volumeEnvelope?: { attack: number; decay: number; sustain: number; release: number }
  ) => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      const envelope = volumeEnvelope || { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.1 };
      const now = ctx.currentTime;
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + envelope.attack);
      gainNode.gain.linearRampToValueAtTime(0.15 * envelope.sustain, now + envelope.attack + envelope.decay);
      gainNode.gain.linearRampToValueAtTime(0, now + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (e) {
      console.warn('Sound playback failed:', e);
    }
  }, [getAudioContext]);

  const playSequence = useCallback((notes: { freq: number; dur: number; delay: number; type?: OscillatorType }[]) => {
    notes.forEach(note => {
      setTimeout(() => {
        playTone(note.freq, note.dur, note.type || 'sine');
      }, note.delay * 1000);
    });
  }, [playTone]);

  const playSound = useCallback((soundType: SoundType) => {
    switch (soundType) {
      case 'wave':
        // Friendly wave sound - ascending cheerful notes
        playSequence([
          { freq: 523, dur: 0.1, delay: 0 },      // C5
          { freq: 659, dur: 0.1, delay: 0.08 },   // E5
          { freq: 784, dur: 0.15, delay: 0.16 },  // G5
        ]);
        break;

      case 'happy':
        // Happy chirp - quick ascending
        playSequence([
          { freq: 880, dur: 0.08, delay: 0 },
          { freq: 1047, dur: 0.12, delay: 0.06 },
        ]);
        break;

      case 'excited':
        // Excited burst - rapid ascending sparkle
        playSequence([
          { freq: 698, dur: 0.06, delay: 0 },
          { freq: 880, dur: 0.06, delay: 0.05 },
          { freq: 1047, dur: 0.06, delay: 0.1 },
          { freq: 1319, dur: 0.1, delay: 0.15 },
        ]);
        break;

      case 'thinking':
        // Thinking sound - soft pulsing tone
        playSequence([
          { freq: 330, dur: 0.2, delay: 0, type: 'triangle' },
          { freq: 350, dur: 0.2, delay: 0.3, type: 'triangle' },
        ]);
        break;

      case 'message':
        // Message received - soft notification
        playSequence([
          { freq: 587, dur: 0.08, delay: 0 },
          { freq: 784, dur: 0.12, delay: 0.08 },
        ]);
        break;

      case 'send':
        // Message sent - quick whoosh up
        playSequence([
          { freq: 440, dur: 0.05, delay: 0 },
          { freq: 660, dur: 0.08, delay: 0.04 },
        ]);
        break;

      case 'open':
        // Chat open - welcoming ascending arpeggio
        playSequence([
          { freq: 392, dur: 0.1, delay: 0 },      // G4
          { freq: 494, dur: 0.1, delay: 0.1 },    // B4
          { freq: 587, dur: 0.1, delay: 0.2 },    // D5
          { freq: 784, dur: 0.15, delay: 0.3 },   // G5
        ]);
        break;

      case 'close':
        // Chat close - descending soft close
        playSequence([
          { freq: 587, dur: 0.08, delay: 0 },
          { freq: 440, dur: 0.1, delay: 0.06 },
          { freq: 330, dur: 0.12, delay: 0.12 },
        ]);
        break;
    }
  }, [playSequence]);

  return { playSound };
}
