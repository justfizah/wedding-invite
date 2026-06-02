document.addEventListener("DOMContentLoaded", () => {
    const InvitationView = new WooowInvitationPageObject();

    InvitationView.waxSealButton.addEventListener('click', () => {
        InvitationView.openEnvelopeSequence();
    });

    InvitationView.audioToggleButton.addEventListener('click', () => {
        InvitationView.toggleAudioEngineState();
    });

    // Initialize the Scratch Engine Canvas Layer
    InvitationView.initializeScratchSurface('#cfb53b', '✨ SCRATCH TO REVEAL ✨');

    // INITIALIZE COUNTDOWN TIMER ENGINE: Modify date target parameter format right here
    InvitationView.startCountdownEngine('October 24, 2026 16:00:00');
});
