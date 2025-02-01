// ==UserScript==
// @name         Ruffle Keep Alive
// @namespace    https://github.com/HtheB/ruffle-keep-alive
// @version      1.1
// @description  Prevents Ruffle from pausing when switching tabs
// @author       HtheB
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    function isRufflePage() {
        return document.querySelector('ruffle-embed, ruffle-object, ruffle-player') !== null;
    }

    function keepRuffleActive() {
        if (isRufflePage()) {
            console.log("Ruffle detected - applying keep-alive fix");

            // Override the visibility API only for Ruffle pages
            Object.defineProperty(document, "hidden", { get: () => false });
            Object.defineProperty(document, "visibilityState", { get: () => "visible" });

            // Function to dispatch focus & visibilitychange events when needed
            const keepActive = () => {
                if (document.hidden) {
                    window.dispatchEvent(new Event("focus"));
                    document.dispatchEvent(new Event("visibilitychange"));
                }
            };

            // Only fire events when necessary
            document.addEventListener("visibilitychange", keepActive);
            document.addEventListener("blur", keepActive);
            window.addEventListener("blur", keepActive);
            window.addEventListener("focus", keepActive);

            // Also check every 5 seconds in case the browser prevents event dispatching
            setInterval(keepActive, 5000);
        }
    }

    // Wait for Ruffle to load before applying fix
    const observer = new MutationObserver(() => {
        if (isRufflePage()) {
            keepRuffleActive();
            observer.disconnect(); // Stop observing once Ruffle is found
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();
