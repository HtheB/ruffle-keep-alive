// ==UserScript==
// @name         Prevent Ruffle from Pausing
// @namespace    https://github.com/HtheB/ruffle-keep-alive
// @version      1.0
// @description  Prevents Ruffle from pausing when the tab is unfocused
// @author       HtheB
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Override the visibility API to always return "visible"
    Object.defineProperty(document, "hidden", { get: () => false });
    Object.defineProperty(document, "visibilityState", { get: () => "visible" });

    // Function to dispatch focus & visibilitychange events only when needed
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
})();