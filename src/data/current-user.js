import { developers } from "./developers.js";

// Placeholder signed-in user. Replaced by real session data once auth lands.
export const currentUsername = "jordanlee";

export const currentUser = developers.find(
  (developer) => developer.username === currentUsername
);
