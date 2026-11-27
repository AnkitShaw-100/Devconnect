"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { bookmarkedPostIds } from "@/data/bookmarks";
import { currentUser } from "@/data/current-user";
import { focusMainContent, isFocusLost } from "@/lib/a11y";
import {
  createInitialState,
  interactionsReducer,
  selectComments,
  selectIsBookmarked,
  selectIsFollowing,
  selectLike,
} from "@/lib/interactions";

const InteractionsContext = createContext(null);

/**
 * Holds likes, follows, bookmarks, comments and new posts for the whole app.
 * It wraps the root layout, which stays mounted across navigations, so the
 * state is shared by every page. Server Components passed as `children`
 * stay Server Components. Nothing is saved: a full reload starts fresh.
 */
export function InteractionsProvider({ children }) {
  const [state, dispatch] = useReducer(
    interactionsReducer,
    { bookmarkedPostIds },
    createInitialState
  );
  // Screen-reader announcements ("Post deleted"). The nonce makes the same
  // message announce again when it repeats.
  const [announcement, setAnnouncement] = useState({ text: "", nonce: 0 });
  const announce = useCallback(
    (text) => setAnnouncement((current) => ({ text, nonce: current.nonce + 1 })),
    []
  );
  const value = useMemo(() => ({ state, dispatch, announce }), [state, announce]);

  // Marks the page as interactive once React has hydrated (clicks before
  // that are lost). End-to-end tests wait for this before interacting.
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);

  return (
    <InteractionsContext.Provider value={value}>
      {children}
      {/* The region stays mounted; only its text changes, which screen
          readers announce reliably. */}
      <p role="status" aria-live="polite" className="sr-only" data-announcer="">
        <span key={announcement.nonce}>{announcement.text}</span>
      </p>
    </InteractionsContext.Provider>
  );
}

function useInteractions() {
  const context = useContext(InteractionsContext);
  if (!context) throw new Error("Wrap the app in <InteractionsProvider>.");
  return context;
}

// Run after React has removed elements (and any dialog has restored focus):
// if the focused element disappeared, move focus to the main content.
function recoverFocusSoon() {
  requestAnimationFrame(() => {
    if (isFocusLost()) focusMainContent();
  });
}

const newId = (prefix) =>
  `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`;

// Announce a short message to screen readers, e.g. after an action that
// removes the focused element.
export function useAnnounce() {
  return useInteractions().announce;
}

export function useLike(postId, initialLiked, initialCount) {
  const { state, dispatch } = useInteractions();
  const { liked, count } = selectLike(state, postId, initialLiked, initialCount);
  const toggle = useCallback(
    () => dispatch({ type: "toggleLike", postId, initialLiked, initialCount }),
    [dispatch, postId, initialLiked, initialCount]
  );
  return { liked, count, toggle };
}

export function useFollow(username) {
  const { state, dispatch } = useInteractions();
  const toggle = useCallback(() => dispatch({ type: "toggleFollow", username }), [dispatch, username]);
  return { following: selectIsFollowing(state, username), toggle };
}

export function useBookmark(postId) {
  const { state, dispatch, announce } = useInteractions();
  const bookmarked = selectIsBookmarked(state, postId);
  const toggle = useCallback(() => {
    dispatch({ type: "toggleBookmark", postId });
    announce(bookmarked ? "Removed from bookmarks." : "Saved to bookmarks.");
    // On the Bookmarks page the card (and the focused button) disappears.
    recoverFocusSoon();
  }, [dispatch, announce, postId, bookmarked]);
  return { bookmarked, toggle };
}

export function useBookmarks() {
  const { state } = useInteractions();
  return state.bookmarks;
}

// Comments the post came with, plus any the user added.
export function useComments(postId, initialComments) {
  const { state, dispatch } = useInteractions();
  const comments = selectComments(state, postId, initialComments);
  const add = useCallback(
    (content) =>
      dispatch({
        type: "addComment",
        postId,
        comment: {
          id: newId("comment"),
          authorUsername: currentUser.username,
          author: currentUser,
          timestamp: "Just now",
          content,
        },
      }),
    [dispatch, postId]
  );
  return { comments, add };
}

// Posts the user wrote this session, newest first.
export function useCreatedPosts() {
  const { state, dispatch, announce } = useInteractions();
  const create = useCallback(
    ({ content, tags, images = [] }) => {
      const post = {
        id: newId("post"),
        authorUsername: currentUser.username,
        author: currentUser,
        timestamp: "Just now",
        content,
        tags,
        images,
        likes: 0,
        likedByMe: false,
        comments: [],
        createdLocally: true,
      };
      dispatch({ type: "createPost", post });
      return post;
    },
    [dispatch]
  );
  const remove = useCallback(
    (postId) => {
      dispatch({ type: "deletePost", postId });
      announce("Post deleted.");
      recoverFocusSoon();
    },
    [dispatch, announce]
  );
  return { posts: state.createdPosts, create, remove };
}
