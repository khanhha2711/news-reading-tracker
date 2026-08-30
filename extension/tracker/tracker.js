import { getDomains, sendEvents } from "./api.js";
import { getOrCreateSessionId } from "./session.js";

let installationId = null;
let sessionId = null;
const tabs = new Map();
const MAX_BATCH_SIZE = 50;
const FLUSH_INTERVAL = 1000;

let isSending = false;
let flushTimer = null;
let activeTabId = null;

async function initialize() {
  const data = await chrome.storage.local.get(["installationId", "domains"]);

  sessionId = await getOrCreateSessionId();

  installationId = data.installationId ?? crypto.randomUUID();

  await chrome.storage.local.set({
    installationId,
  });

  try {
    const domainsData = await getDomains();

    const domains = domainsData.map((domain) => domain.name);
    await chrome.storage.local.set({
      domains,
    });
    console.log("Domains synced:", domains);
  } catch (error) {
    console.error("Failed to sync domains:", error);
  }
}

function createTabState(tabId, windowId, article) {
  return {
    tabId,
    windowId,
    url: article.url,
    domain: article.domain ?? new URL(article.url).hostname,
    title: article.title ?? null,
    content: article.content ?? null,
    summary: article.summary ?? null,
    isActive: false,
    isFocused: false,
    isIdle: false,
    isReading: false,
  };
}

async function handleArticleDetected(sender, article) {
  const tabId = sender.tab?.id;
  const windowId = sender.tab?.windowId;

  if (tabId == null || windowId == null) {
    return;
  }

  if (!article?.url) {
    return;
  }

  const oldPage = tabs.get(tabId);
  if (oldPage && oldPage.url === article.url) {
    return;
  }

  if (oldPage) {
    await createEvent("PAGE_LEAVE", oldPage);
  }

  const page = createTabState(tabId, windowId, article);
  page.isActive = true;

  tabs.set(tabId, page);

  await createEvent("PAGE_ENTER", page);

  await updateReadingState(tabId);
}

async function updateReadingState(tabId) {
  const page = tabs.get(tabId);

  if (!page) {
    return;
  }

  const shouldRead = page.isActive && page.isFocused && !page.isIdle;

  if (shouldRead === page.isReading) {
    return;
  }
  page.isReading = shouldRead;

  await createEvent(shouldRead ? "PAGE_ACTIVE" : "PAGE_INACTIVE", page);
}

async function createEvent(type, page) {
  if (!page) {
    return;
  }
  if (type === "PAGE_ENTER" || type === "PAGE_ACTIVE") {
    sessionId = await getOrCreateSessionId();
  }
  const event = {
    eventId: crypto.randomUUID(),
    eventType: type,
    installationId,
    sessionId,
    tabId: page.tabId,
    url: page.url,
    domain: page.domain,
    title: page.title,
    timestamp: new Date().toISOString(),
  };

  if (type === "PAGE_ENTER") {
    event.content = page.content;
    event.summary = page.summary;
  }

  await savePendingEvent(event);

  const pendingEvents = await getPendingEvents();

  if (pendingEvents.length >= MAX_BATCH_SIZE) {
    await flushEvents();
    return;
  }

  scheduleFlush();
  console.log("EVENT:", event);
}

async function getPendingEvents() {
  const data = await chrome.storage.local.get("pendingEvents");
  return data.pendingEvents ?? [];
}

async function savePendingEvent(event) {
  const pendingEvents = await getPendingEvents();

  pendingEvents.push(event);

  await chrome.storage.local.set({
    pendingEvents,
  });
}

async function flushEvents() {
  if (isSending) {
    return;
  }

  const pendingEvents = await getPendingEvents();

  if (pendingEvents.length === 0) {
    return;
  }

  isSending = true;
  const batch = pendingEvents.slice(0, MAX_BATCH_SIZE);

  try {
    await sendEvents(batch);
    const sentIds = new Set(batch.map((event) => event.eventId));

    const currentEvents = await getPendingEvents();

    const remainingEvents = currentEvents.filter(
      (event) => !sentIds.has(event.eventId),
    );

    await chrome.storage.local.set({
      pendingEvents: remainingEvents,
    });
  } catch (error) {
    console.error("SEND EVENTS FAILED:", error);
  } finally {
    isSending = false;
  }
}

function scheduleFlush() {
  if (flushTimer) {
    return;
  }

  flushTimer = setTimeout(async () => {
    flushTimer = null;

    await flushEvents();
  }, FLUSH_INTERVAL);
}

async function handleTabActivated(tabId, windowId) {
  if (activeTabId !== null && activeTabId !== tabId) {
    const oldTab = tabs.get(activeTabId);

    if (oldTab) {
      oldTab.isActive = false;

      await updateReadingState(activeTabId);
    }
  }

  activeTabId = tabId;

  const page = tabs.get(tabId);

  if (!page) {
    return;
  }

  page.isActive = true;
  page.windowId = windowId;

  await updateReadingState(tabId);
}

async function handleWindowFocusChanged(windowId) {
  for (const page of tabs.values()) {
    const isFocused =
      windowId !== chrome.windows.WINDOW_ID_NONE && page.windowId === windowId;

    if (page.isFocused === isFocused) {
      continue;
    }

    page.isFocused = isFocused;

    await updateReadingState(page.tabId);
  }
}

async function handleIdleChanged(idleState) {
  const isIdle = idleState !== "active";

  for (const page of tabs.values()) {
    if (page.isIdle === isIdle) {
      continue;
    }

    page.isIdle = isIdle;

    await updateReadingState(page.tabId);
  }
}

async function handleTabRemoved(tabId) {
  const page = tabs.get(tabId);

  if (!page) {
    return;
  }
  await createEvent("PAGE_LEAVE", page);
  tabs.delete(tabId);

  if (activeTabId === tabId) {
    activeTabId = null;
  }
}

export {
  initialize,
  handleArticleDetected,
  handleTabActivated,
  handleWindowFocusChanged,
  handleIdleChanged,
  handleTabRemoved,
};
