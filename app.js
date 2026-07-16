document.addEventListener("DOMContentLoaded", () => {
    // Instantiate Core POM mapping layout view context
    const InvitationView = new WooowInvitationPageObject();

    // Bind Envelope open event routines to Wax Seal click layer
    InvitationView.waxSealButton.addEventListener('click', () => {
        InvitationView.openEnvelopeSequence();
    });

    // Audio Play/Pause trigger handler routing
    InvitationView.audioToggleButton.addEventListener('click', () => {
        InvitationView.toggleAudioEngineState();
    });

    // Initialize flat gift card ribbon reveals
    InvitationView.initRibbonReveal();

    // INITIALIZE TIMING ENGINE: Set to April 1st, 2027
    InvitationView.startCountdownEngine('April 3, 2027 16:00:00');
});
