/**
 * Page Object Class pattern abstraction mirroring the 
 * interactive design mechanics of WooowInvites interfaces.
 */
class WooowInvitationPageObject {
    constructor() {
        // UI DOM Context bindings
        this.envelopeCover = document.getElementById('envelopeCover');
        this.waxSealButton = document.getElementById('waxSealButton');
        this.invitationContentDeck = document.getElementById('invitationContentDeck');
        this.audioElement = document.getElementById('inviteAudio');
        this.audioToggleButton = document.getElementById('audioToggle');
        this.scratchWrapper = document.getElementById('scratchCanvasWrapper');
        this.scratchCanvas = document.getElementById('scratchCanvasMask');
        
        // Canvas Rendering context properties
        this.ctx = this.scratchCanvas ? this.scratchCanvas.getContext('2d') : null;
        
        // Functional Core internal tracking state metrics
        this.isScratchingActive = false;
        this.isAudioPlaying = false;
    }

    /**
     * Executes the introductory envelope uncover action sequence transitions.
     */
    openEnvelopeSequence() {
        this.envelopeCover.classList.add('fade-slide-out');
        this.invitationContentDeck.classList.remove('hidden-view');
        this.invitationContentDeck.classList.add('fade-slide-in');
        
        // Auto-play ambient context execution post explicit user touch gesture
        this.startBackgroundAudio();
        
        // Enforce garbage collection cleanup on cover UI frame elements post completion
        setTimeout(() => {
            this.envelopeCover.style.display = 'none';
        }, 1200);
    }

    /**
     * Direct Audio Processing Methods Engine
     */
    startBackgroundAudio() {
        this.audioElement.play()
            .then(() => {
                this.isAudioPlaying = true;
                this.audioToggleButton.textContent = "⏸ Pause Music";
                this.audioToggleButton.classList.remove('animate-pulse');
            })
            .catch(error => {
                console.warn("Autoplay browser execution context restricted media play engine: ", error);
            });
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

    /**
     * Initializes Responsive HTML5 Scratch Mask Canvas Dimensions and Event Handling
     */
    initializeScratchSurface(maskColor = '#d4af37', surfaceCaption = 'SCRATCH HERE ✨') {
        if (!this.scratchCanvas || !this.ctx) return;

        const syncCanvasBounds = () => {
            this.scratchCanvas.width = this.scratchWrapper.offsetWidth;
            this.scratchCanvas.height = this.scratchWrapper.offsetHeight;

            // Generate premium opaque background overlay mask
            this.ctx.fillStyle = maskColor;
            this.ctx.fillRect(0, 0, this.scratchCanvas.width, this.scratchCanvas.height);

            // Append elegant mask cover overlay text metadata
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 15px "Cinzel", serif';
            this.ctx.textBaseline = 'middle';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(surfaceCaption, this.scratchCanvas.width / 2, this.scratchCanvas.height / 2);

            // Configure canvas blend mask execution configuration profile mapping
            this.ctx.globalCompositeOperation = 'destination-out';
        };

        syncCanvasBounds();
        window.addEventListener('resize', syncCanvasBounds);
        this.wireUpScratchInteractionListeners();
    }

    wireUpScratchInteractionListeners() {
        // Desktop Pointer Mapping Context Interactions
        this.scratchCanvas.addEventListener('mousedown', (e) => this.initiateScratchCycle(e));
        this.scratchCanvas.addEventListener('mousemove', (e) => this.processScratchAction(e));
        window.addEventListener('mouseup', () => this.terminateScratchCycle());

        // High-responsiveness Mobile/Tablet Surface Touch Control Event Listeners
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

        this.ctx.lineWidth = 40; // Diameter parameter sizing for scratch eraser path trace
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.ctx.lineTo(computedX, computedY);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(computedX, computedY);
    }

    terminateScratchCycle() {
        this.isScratchingActive = false;
        this.ctx.beginPath(); // Resets path rendering matrix state data
    }
}