(function () {
  if (window.__NEWS_TRACKER_INITIALIZED__) return;
  window.__NEWS_TRACKER_INITIALIZED__ = true;

  function isArticleUrl() {
    const pathname = window.location.pathname;
    if (!pathname || pathname === "/") return false;

    const parts = pathname.split("/").filter(Boolean);
    const lastPart = parts.at(-1);
    if (!lastPart) return false;

    const lastText = lastPart.replace(/\.[a-zA-Z0-9]+$/, "");

    return /\d+$/.test(lastText);
  }

  function getFullArticleData() {
    if (!isArticleUrl()) {
      return null;
    }

    if (typeof Readability === "undefined") {
      console.error("[Tracker] Lỗi: Chưa nạp được thư viện Readability.js!");
      return null;
    }

    try {
      const documentClone = document.cloneNode(true);
      const reader = new Readability(documentClone);
      const parsed = reader.parse();

      if (!parsed) {
        console.warn(
          "[Tracker] Readability không nhận diện được nội dung bài.",
        );
        return null;
      }

      const metaDescription = document
        .querySelector(
          'meta[name="description"], meta[property="og:description"]',
        )
        ?.content?.trim();

      return {
        url: window.location.href,
        domain: window.location.hostname,
        title: parsed.title || document.title,
        summary: parsed.excerpt || metaDescription || "",
        content: parsed.textContent.trim(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("[Tracker] Lỗi trong quá trình bóc tách bài báo:", error);
      return null;
    }
  }

  const articlePayload = getFullArticleData();

  if (articlePayload) {
    console.log("[Tracker] BÓC TÁCH BÀI BÁO THÀNH CÔNG:", {
      url: articlePayload.url,
      title: articlePayload.title,
      domain: articlePayload.domain,
      summary: articlePayload.summary,
      content: articlePayload.content,
    });

    chrome.runtime.sendMessage({
      type: "ARTICLE_DETECTED",
      payload: articlePayload,
    });
  }
})();
