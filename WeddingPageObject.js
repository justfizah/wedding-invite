class WooowInvitationPageObject {
    constructor() {
        this.envelopeCover = document.getElementById('envelopeCover');
        this.waxSealButton = document.getElementById('waxSealButton');
        this.invitationContentDeck = document.getElementById('invitationContentDeck');
        this.audioElement = document.getElementById('inviteAudio');
        this.audioToggleButton = document.getElementById('audioToggle');
        
        // Countdown Bindings Nodes
        this.daysSpan = document.getElementById('days');
        this.hoursSpan = document.getElementById('hours');
        this.minutesSpan = document.getElementById('minutes');
        this.secondsSpan = document.getElementById('seconds');
        this.countdownInterval = null;

        // Dynamic Coins Arrays Definition Mapping
        this.coins = [
            { id: 1, canvas: document.getElementById('coinCanvas1'), wrapper: document.getElementById('coinWrapper1'), ctx: null },
            { id: 2, canvas: document.getElementById('coinCanvas2'), wrapper: document.getElementById('coinWrapper2'), ctx: null },
            { id: 3, canvas: document.getElementById('coinCanvas3'), wrapper: document.getElementById('coinWrapper3'), ctx: null }
        ];
        
        this.isScratchingActive = false;
        this.isAudioPlaying = false;
    }

    openEnvelopeSequence() {
        this.envelopeCover.classList.remove('active');
        this.envelopeCover.classList.add('fade-slide-out');
        this.invitationContentDeck.classList.remove('hidden-view');
        this.invitationContentDeck.classList.add('fade-slide-in');
        this.startBackgroundAudio();
        
        setTimeout(() => {
            this.envelopeCover.style.display = 'none';
        }, 1000);
    }

    startBackgroundAudio() {
        this.audioElement.play()
            .then(() => {
                this.isAudioPlaying = true;
                if(this.audioToggleButton) this.audioToggleButton.textContent = "🔇Pause Music";
            })
            .catch(error => console.warn("Audio autoplay blocked: ", error));
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

    /**
     * Loops through and configures the 3 independent round canvas layers
     */
    initializeScratchSurface() {
        this.coins.forEach(coin => {
            if (!coin.canvas) return;
            coin.ctx = coin.canvas.getContext('2d');
            
            const renderCoinSurface = () => {
                const diameter = coin.wrapper.offsetWidth;
                coin.canvas.width = diameter;
                coin.canvas.height = diameter;

                // Render metallic gold radial gradients matching the reference coin details
                let goldGrad = coin.ctx.createRadialGradient(diameter/3, diameter/3, 5, diameter/2, diameter/2, diameter/2);
                goldGrad.addColorStop(0, '#f9e49b');
                goldGrad.addColorStop(0.5, '#d4af37');
                goldGrad.addColorStop(1, '#aa7c11');

                coin.ctx.fillStyle = goldGrad;
                coin.ctx.beginPath();
                coin.ctx.arc(diameter/2, diameter/2, diameter/2, 0, Math.PI * 2);
                coin.ctx.fill();

                coin.ctx.globalCompositeOperation = 'destination-out';
            };

            renderCoinSurface();
            this.wireUpCoinListeners(coin);
        });
    }

    wireUpCoinListeners(coin) {
        const startScratch = (e) => { 
            this.isScratchingActive = true; 
            scratchAction(e); 
        };
        const stopScratch = () => { 
            this.isScratchingActive = false; 
            coin.ctx.beginPath(); 
        };
        
        const scratchAction = (pointerEvent) => {
            if (!this.isScratchingActive) return;
            const bounds = coin.canvas.getBoundingClientRect();
            
            // Track inputs relative to independent event scopes
            const clientX = pointerEvent.clientX || pointerEvent.touches[0].clientX;
            const clientY = pointerEvent.clientY || pointerEvent.touches[0].clientY;
            
            const computedX = clientX - bounds.left;
            const computedY = clientY - bounds.top;

            coin.ctx.lineWidth = 30; // Eraser brush scale size configuration
            coin.ctx.lineCap = 'round';
            coin.ctx.lineJoin = 'round';
            coin.ctx.lineTo(computedX, computedY);
            coin.ctx.stroke();
            coin.ctx.beginPath();
            coin.ctx.moveTo(computedX, computedY);
        };

        // Pointer event mapping routes
        coin.canvas.addEventListener('mousedown', startScratch);
        coin.canvas.addEventListener('mousemove', scratchAction);
        window.addEventListener('mouseup', stopScratch);

        coin.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startScratch(e); }, { passive: false });
        coin.canvas.addEventListener('touchmove', (e) => { e.preventDefault(); scratchAction(e); }, { passive: false });
        window.addEventListener('touchend', stopScratch);
    }
}
