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
     * Three independent flat gift-box card ribbon unknot reveals.
     */
    initRibbonReveal() {
        const gifts = [
            { cardId: 'giftCard1', ribbonId: 'giftRibbon1', bowId: 'giftBow1', pullId: 'giftPull1', dateId: 'giftDate1' },
            { cardId: 'giftCard2', ribbonId: 'giftRibbon2', bowId: 'giftBow2', pullId: 'giftPull2', dateId: 'giftDate2' },
            { cardId: 'giftCard3', ribbonId: 'giftRibbon3', bowId: 'giftBow3', pullId: 'giftPull3', dateId: 'giftDate3' }
        ];

        gifts.forEach(({ cardId, ribbonId, bowId, pullId, dateId }) => {
            const cardEl   = document.getElementById(cardId);
            const ribbonEl = document.getElementById(ribbonId);
            const bowEl    = document.getElementById(bowId);
            const pullEl   = document.getElementById(pullId);
            const dateEl   = document.getElementById(dateId);

            if (!cardEl || !ribbonEl || !dateEl) return;

            let revealed = false;
            let isDragging = false;
            let startY = 0;
            let currentDY = 0;

            const triggerReveal = () => {
                if (revealed) return;
                revealed = true;

                // 1. Hide pull tab immediately
                if (pullEl) pullEl.classList.add('hidden');

                // 2. Add unknotting animation to the bow (wiggle → loosen/fade)
                if (bowEl) bowEl.classList.add('unknotting');

                // 3. Ribbon overlay slides down
                setTimeout(() => {
                    if (ribbonEl) {
                        ribbonEl.style.transform = ''; // clear drag offset
                        ribbonEl.classList.add('sliding-off');
                    }
                }, 560);

                // 4. Date rises up/scales in center
                setTimeout(() => {
                    dateEl.classList.add('revealed');
                }, 850);
            };

            // Bind Tap/Click events on Card, Ribbon, and Bow
            cardEl.addEventListener('click', triggerReveal);
            ribbonEl.addEventListener('click', (e) => { e.stopPropagation(); triggerReveal(); });
            if (bowEl) bowEl.addEventListener('click', (e) => { e.stopPropagation(); triggerReveal(); });

            // Bind Tap/Click on pull tab handle
            if (pullEl) {
                pullEl.addEventListener('click', (e) => { e.stopPropagation(); triggerReveal(); });

                // Drag-to-pull implementation (Mouse)
                pullEl.addEventListener('mousedown', (e) => {
                    if (revealed) return;
                    isDragging = true;
                    startY = e.clientY;
                    currentDY = 0;
                    pullEl.style.transition = 'none';
                    ribbonEl.style.transition = 'none';
                });

                window.addEventListener('mousemove', (e) => {
                    if (!isDragging || revealed) return;
                    currentDY = Math.max(0, e.clientY - startY);
                    
                    // Move pull tab and nudge ribbon down slightly on pull tension
                    pullEl.style.transform = `translateY(${Math.min(currentDY, 25)}px)`;
                    ribbonEl.style.transform = `translateY(${Math.min(currentDY * 0.2, 5)}px)`;
                });

                window.addEventListener('mouseup', () => {
                    if (!isDragging) return;
                    isDragging = false;
                    pullEl.style.transition = '';
                    ribbonEl.style.transition = '';

                    if (currentDY >= 20) {
                        triggerReveal();
                    } else {
                        // Snap back
                        pullEl.style.transform = '';
                        ribbonEl.style.transform = '';
                    }
                    currentDY = 0;
                });

                // Drag-to-pull implementation (Touch)
                pullEl.addEventListener('touchstart', (e) => {
                    if (revealed) return;
                    isDragging = true;
                    startY = e.touches[0].clientY;
                    currentDY = 0;
                    pullEl.style.transition = 'none';
                    ribbonEl.style.transition = 'none';
                }, { passive: true });

                pullEl.addEventListener('touchmove', (e) => {
                    if (!isDragging || revealed) return;
                    currentDY = Math.max(0, e.touches[0].clientY - startY);
                    pullEl.style.transform = `translateY(${Math.min(currentDY, 25)}px)`;
                    ribbonEl.style.transform = `translateY(${Math.min(currentDY * 0.2, 5)}px)`;
                }, { passive: true });

                pullEl.addEventListener('touchend', () => {
                    if (!isDragging) return;
                    isDragging = false;
                    pullEl.style.transition = '';
                    ribbonEl.style.transition = '';

                    if (currentDY >= 20) {
                        triggerReveal();
                    } else {
                        pullEl.style.transform = '';
                        ribbonEl.style.transform = '';
                    }
                    currentDY = 0;
                });
            }
        });
    }
}
