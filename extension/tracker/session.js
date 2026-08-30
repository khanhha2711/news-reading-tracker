import { sendSession } from "./api.js";

const SESSION_EXPIRATION_IN_MIN = 30;

async function getOrCreateSessionId() {
  let { sessionData } = await chrome.storage.session.get("sessionData");

  const currentTime = Date.now();

  if (sessionData?.timestamp) {
    const durationInMin = (currentTime - sessionData.timestamp) / 60000;

    if (durationInMin <= SESSION_EXPIRATION_IN_MIN) {
      sessionData.timestamp = currentTime;

      await chrome.storage.session.set({
        sessionData,
      });

      return sessionData.sessionId;
    }
  }

  const newSession = {
    sessionId: crypto.randomUUID(),
    timestamp: currentTime,
  };

  await chrome.storage.session.set({
    sessionData: newSession,
  });

  await sendSession(newSession);
  return newSession.sessionId;
}

export { getOrCreateSessionId };
