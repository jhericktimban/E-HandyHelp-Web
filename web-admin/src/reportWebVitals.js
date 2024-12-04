// src/reportWebVitals.js
import { onCLS, onFID, onLCP, onTTFB, onINP } from "web-vitals";

// Send metrics to your Vercel analytics backend
const sendToVercelAnalytics = (metric) => {
  const body = JSON.stringify(metric);
  const url = "/_vercel/insights";

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: "POST", keepalive: true });
  }
};

export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(sendToVercelAnalytics);
    onFID(sendToVercelAnalytics);
    onLCP(sendToVercelAnalytics);
    onTTFB(sendToVercelAnalytics);
    onINP(sendToVercelAnalytics); // Include INP for interactivity
  }
};
