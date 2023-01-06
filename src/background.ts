'use strict';

chrome.runtime.onStartup.addListener(async () => {
  const result = await chrome.tabs.query({
    pinned: true,
  });

  if (result.length === 0) {
    chrome.sessions.getRecentlyClosed({}, (sessions) => {
      if (!chrome.runtime.lastError) {
        const restoreList: string[] = [];
        for (const session of sessions) {
          const { tab, window } = session;
          if (window) {
            const { tabs = [] } = window;
            let pinnnedState = false;
            tabs.forEach((value) => {
              const { sessionId, pinned } = value;
              if (sessionId != undefined && pinned) {
                restoreList.push(sessionId);
                pinnnedState = true;
              }
            });

            if (pinnnedState) {
              break;
            }
          } else if (tab) {
            const { sessionId, pinned } = tab;
            if (sessionId != undefined && pinned) {
              restoreList.push(sessionId);
              break;
            }
          }
        }

        restoreList.forEach((value) => {
          chrome.sessions.restore(value);
        });
      }
    });
  }
});
