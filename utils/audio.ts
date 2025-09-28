// Create a single AudioContext to be reused.
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API n'est pas supporté par ce navigateur.");
            return null;
        }
    }
    return audioContext;
};

/**
 * Plays a simple success sound effect.
 * Useful for providing positive feedback on user actions.
 */
export const playSuccessSound = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Browsers may suspend the AudioContext after page load. It must be resumed by a user gesture.
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    try {
        const playNote = (frequency: number, startTime: number, duration: number) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, startTime);
            
            gainNode.gain.setValueAtTime(0.15, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        };

        const now = ctx.currentTime;
        playNote(523.25, now, 0.1); // C5
        playNote(783.99, now + 0.1, 0.2); // G5
    } catch (error) {
        console.error("Erreur lors de la lecture du son :", error);
    }
};