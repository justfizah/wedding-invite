document.addEventListener("DOMContentLoaded", () => {
    // Instantiate core Page Object structural context mapping
    const InvitationView = new WooowInvitationPageObject();

    // Attach interaction handling logic for the introductory Envelope open seal
    InvitationView.waxSealButton.addEventListener('click', () => {
        InvitationView.openEnvelopeSequence();
    });

    // Wire up global auxiliary audio navigation buttons
    InvitationView.audioToggleButton.addEventListener('click', () => {
        InvitationView.toggleAudioEngineState();
    });

    // Construct the initialization parameters for the dynamic scratch framework
    // Using a premium gold accent profile characteristic of the premium templates
    InvitationView.initializeScratchSurface('#cfb53b', '✨ SCRATCH TO REVEAL ✨');
});