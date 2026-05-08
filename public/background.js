chrome.action.onClicked.addListener(async (tab) => {
  const { isOpen } = await chrome.storage.session.get({ isOpen: false });
  if (isOpen) {
    await chrome.sidePanel.close({ windowId: tab.windowId });
    await chrome.storage.session.set({ isOpen: false });
  } else {
    await chrome.sidePanel.open({ windowId: tab.windowId });
    await chrome.storage.session.set({ isOpen: true });
  }
});
