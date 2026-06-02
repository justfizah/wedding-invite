class WooowInvitationPageObject {
    constructor() {
        // UI DOM Element Bindings
        this.envelopeCover = document.getElementById('envelopeCover');
        this.waxSealButton = document.getElementById('waxSealButton');
        this.invitationContentDeck = document.getElementById('invitationContentDeck');
        this.audioElement = document.getElementById('inviteAudio');
        this.audioToggleButton = document.getElementById('audioToggle');
        this.scratchWrapper = document.getElementById('scratchCanvasWrapper');
        this.scratchCanvas = document.getElementById('scratchCanvasMask');
        this.ctx = this.scratchCanvas ? this.scratchCanvas.getContext('2d') : null;
        
        // Countdown Dom Target Nodes
        this.daysSpan = document.getElementById('days');
        this.hoursSpan = document.getElementById('hours');
        this.minutesSpan = document.getElementById('minutes');
        this.secondsSpan = document.getElementById('seconds');
        this.countdownInterval = null;

        this.isScratchingActive = false;
        this.isAudioPlaying = false;
    }

    /**
     * Handles switching from the Envelope page to the main invitation card
     */
    openEnvelopeSequence() {
        // 1. Slide up and fade out the envelope cover layer
        this.envelopeCover.classList.remove('active');
        this.envelopeCover.classList.add('fade-slide-out');
        
        // 2. Smoothly reveal the inner content deck
        this.invitationContentDeck.classList.remove('hidden-view');
        this.invitationContentDeck.classList.add('fade-slide-in');
        
        // 3. Kick off the background audio stream
        this.startBackgroundAudio();
        
        // 4. Completely drop the envelope from display view space after animations finish
        setTimeout(() => {
            this.envelopeCover.style.display = 'none';
        }, 1000);
    }

    startBackgroundAudio() {
        this.audioElement.play()
            .then(() => {
                this.isAudioPlaying = true;
                this.audioToggleButton.textContent = "⏸ Pause Music";
                this.audioToggleButton.classList.remove('animate-pulse');
            })
            .catch(error => console.warn("Audio autoplay blocked by browser settings: ", error));
    }

    toggleAudioEngineState() {
        if (this.isAudioPlaying) {
            this.audioElement.pause();
            this.audioToggleButton.textContent = "🎵 Play Music";
            this.isAudioPlaying = false;
        } else {
            this.startBackgroundAudio();
        }
    }

    startCountdownEngine(targetDateString) {
        const targetTime = new Date(targetDateString).getTime();

        const calculateTimeRemaining = () => {
            const computeNow = new Date().getTime();
            const distance = targetTime - computeNow;

            if (distance < 0) {
                if (this.countdownInterval) clearInterval(this.countdownInterval);
                const container = document.querySelector('.countdown-container');
                if (container) {
                    container.innerHTML = "<p class='wedding-day-passed'>The Big Day Has Arrived! 🎉</p>";
                }
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (this.daysSpan) this.daysSpan.textContent = String(days).padStart(2, '0');
            if (this.hoursSpan) this.hoursSpan.textContent = String(hours).padStart(2, '0');
            if (this.minutesSpan) this.minutesSpan.textContent = String(minutes).padStart(2, '0');
            if (this.secondsSpan) this.secondsSpan.textContent = String(seconds).padStart(2, '0');
        };

        if (this.countdownInterval) clearInterval(this.countdownInterval);
        calculateTimeRemaining();
        this.countdownInterval = setInterval(calculateTimeRemaining, 1000);
    }

    initializeScratchSurface(maskColor = '#d4af37', surfaceCaption = 'SCRATCH HERE ✨') {
        if (!this.scratchCanvas || !this.ctx) return;

        const syncCanvasBounds = () => {
            this.scratchCanvas.width = this.scratchWrapper.offsetWidth;
            this.scratchCanvas.height = this.scratchWrapper.offsetHeight;
            this.ctx.fillStyle = maskColor;
            this.ctx.fillRect(0, 0, this.scratchCanvas.width, this.scratchCanvas.height);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 15px "Cinzel", serif';
            this.ctx.textBaseline = 'middle';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(surfaceCaption, this.scratchCanvas.width / 2, this.scratchCanvas.height / 2);
            this.ctx.globalCompositeOperation = 'destination-out';
        };

        syncCanvasBounds();
        window.addEventListener('resize', syncCanvasBounds);
        this.wireUpScratchInteractionListeners();
    }

    wireUpScratchInteractionListeners() {
        this.scratchCanvas.addEventListener('mousedown', (e) => this.initiateScratchCycle(e));
        this.scratchCanvas.addEventListener('mousemove', (e) => this.processScratchAction(e));
        window.addEventListener('mouseup', () => this.terminateScratchCycle());

        this.scratchCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.initiateScratchCycle(e.touches[0]);
        }, { passive: false });

        this.scratchCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.processScratchAction(e.touches[0]);
        }, { passive: false });

        window.addEventListener('touchend', () => this.terminateScratchCycle());
    }

    initiateScratchCycle(pointerCoordinateSource) {
        this.isScratchingActive = true;
        this.processScratchAction(pointerCoordinateSource);
    }

    processScratchAction(pointerCoordinateSource) {
        if (!this.isScratchingActive) return;
        const bounds = this.scratchCanvas.getBoundingClientRect();
        const computedX = pointerCoordinateSource.clientX - bounds.left;
        const computedY = pointerCoordinateSource.clientY - bounds.top;

        this.ctx.lineWidth = 40;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineTo(computedX, computedY);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(computedX, computedY);
    }

    terminateScratchCycle() {
        this.isScratchingActive = false;
        this.ctx.beginPath();
    }
}
