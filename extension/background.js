import {
  initialize,
  handleArticleDetected,
  handleTabActivated,
  handleWindowFocusChanged,
  handleIdleChanged,
  handleTabRemoved,
} from "./tracker/tracker.js";

initialize();

async function isTrackedDomain(url) {
  const { domains = [] } = await chrome.storage.local.get("domains");

  const hostname = new URL(url).hostname;

  return domains.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  );
}

async function injectContentScript(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["scripts/Readability.js", "scripts/content.js"],
    });
  } catch (error) {
    console.error("Failed to inject content script:", error);
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) {
    return;
  }

  const isTracked = await isTrackedDomain(tab.url);

  if (!isTracked) {
    return;
  }

  await injectContentScript(tabId);
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type !== "ARTICLE_DETECTED") {
    return;
  }

  handleArticleDetected(sender, message.payload);
});

chrome.tabs.onActivated.addListener(({ tabId, windowId }) => {
  handleTabActivated(tabId, windowId);
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  handleWindowFocusChanged(windowId);
});

chrome.idle.setDetectionInterval(60);

chrome.idle.onStateChanged.addListener((idleState) => {
  handleIdleChanged(idleState);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  handleTabRemoved(tabId);
});
