// eslint-disable-next-line import/no-unresolved
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const DEFAULT_URL =
  (typeof window !== "undefined" && (window.QUIZ_SOCKET_URL || window.QUIZ_SOCKET_ENDPOINT)) || "http://localhost:3000";

export function createSocket(url = DEFAULT_URL, opts = {}) {
  return io(url, {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 500,
    timeout: 5000,
    ...opts,
  });
}
