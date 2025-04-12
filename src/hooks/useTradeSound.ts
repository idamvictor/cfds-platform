import { useRef, useCallback, useEffect } from 'react';

type SoundType = 'success' | 'error' | 'notification';
type AudioContextType = typeof AudioContext;

export function useTradeSound() {
    const audioContextRef = useRef<AudioContext | null>(null);

    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            const AudioContextClass = getAudioContextConstructor();

            if (AudioContextClass) {
                audioContextRef.current = new AudioContextClass();
            }
        }
        return audioContextRef.current;
    }, []);

    const getAudioContextConstructor = (): AudioContextType | null => {
        if (window.AudioContext) {
            return window.AudioContext;
        } else if ('webkitAudioContext' in window) {
            // Use type assertion with 'unknown' as intermediate step to avoid 'any'
            return (window as {webkitAudioContext: AudioContextType}).webkitAudioContext;
        }
        return null;
    };

    // Play a success (trade placed) sound
    const playSuccessSound = useCallback(() => {
        const audioContext = getAudioContext();
        if (!audioContext) return;

        try {
            // Create oscillator and gain nodes
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            // Configure oscillator
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
            oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.15); // Down to A4

            // Configure gain (volume)
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

            // Connect the nodes
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Play the sound
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (err) {
            console.error('Error playing success sound:', err);
        }
    }, [getAudioContext]);

    // Play an error (trade failed) sound
    const playErrorSound = useCallback(() => {
        const audioContext = getAudioContext();
        if (!audioContext) return;

        try {
            // Create oscillator and gain nodes
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            // Configure oscillator for error sound
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3 note

            // Configure gain with quick pulses for error sound
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
            gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);

            // Connect the nodes
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Play the sound
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (err) {
            console.error('Error playing error sound:', err);
        }
    }, [getAudioContext]);

    // General-purpose notification sound
    const playNotificationSound = useCallback(() => {
        const audioContext = getAudioContext();
        if (!audioContext) return;

        try {
            // Create oscillator and gain nodes
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            // Configure oscillator for notification
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5 note
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.1); // G5 note

            // Configure gain
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);

            // Connect the nodes
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Play the sound
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (err) {
            console.error('Error playing notification sound:', err);
        }
    }, [getAudioContext]);

    // Combined function to play a specific sound type
    const playSound = useCallback((type: SoundType = 'success') => {
        switch (type) {
            case 'success':
                playSuccessSound();
                break;
            case 'error':
                playErrorSound();
                break;
            case 'notification':
                playNotificationSound();
                break;
            default:
                playSuccessSound();
        }
    }, [playSuccessSound, playErrorSound, playNotificationSound]);

    // Initialize audio context on first user interaction
    useEffect(() => {
        const firstInteractionEvents = ['mousedown', 'keydown', 'touchstart'];

        const initAudioContext = () => {
            getAudioContext();
            // Remove event listeners once initialized
            firstInteractionEvents.forEach(event => {
                document.removeEventListener(event, initAudioContext);
            });
        };

        firstInteractionEvents.forEach(event => {
            document.addEventListener(event, initAudioContext, { once: true });
        });

        // Cleanup event listeners
        return () => {
            firstInteractionEvents.forEach(event => {
                document.removeEventListener(event, initAudioContext);
            });
        };
    }, [getAudioContext]);

    return { playSound };
}

export default useTradeSound;
