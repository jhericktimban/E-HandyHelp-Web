// src/reportWebVitals.js
import { getCLS, getFID, getLCP, getTTFB } from "web-vitals";

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
    getCLS(sendToVercelAnalytics);
    getFID(sendToVercelAnalytics);
    getLCP(sendToVercelAnalytics);
    getTTFB(sendToVercelAnalytics);
  }
};

export default reportWebVitals;