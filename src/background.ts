let isOpen = false;

chrome.storage.session.get({ isOpen: false }).then(({ isOpen: stored }) => {
  isOpen = stored as boolean;
});

chrome.action.onClicked.addListener((tab) => {
  if (isOpen) {
    chrome.sidePanel.close({ windowId: tab.windowId });
  } else {
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
  isOpen = !isOpen;
  chrome.storage.session.set({ isOpen });
});
