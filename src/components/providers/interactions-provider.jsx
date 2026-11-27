"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { bookmarkedPostIds } from "@/data/bookmarks";
import { currentUser } from "@/data/current-user";
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
  const value = useMemo(() => ({ state, dispatch }), [state]);

  // Marks the page as interactive once React has hydrated (clicks before
  // that are lost). End-to-end tests wait for this before interacting.
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);

  return <InteractionsContext.Provider value={value}>{children}</InteractionsContext.Provider>;
}

function useInteractions() {
  const context = useContext(InteractionsContext);
  if (!context) throw new Error("Wrap the app in <InteractionsProvider>.");
  return context;
}

const newId = (prefix) =>
  `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`;

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
  const { state, dispatch } = useInteractions();
  const toggle = useCallback(() => dispatch({ type: "toggleBookmark", postId }), [dispatch, postId]);
  return { bookmarked: selectIsBookmarked(state, postId), toggle };
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
  const { state, dispatch } = useInteractions();
  const create = useCallback(
    ({ content, tags }) => {
      const post = {
        id: newId("post"),
        authorUsername: currentUser.username,
        author: currentUser,
        timestamp: "Just now",
        content,
        tags,
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
  const remove = useCallback((postId) => dispatch({ type: "deletePost", postId }), [dispatch]);
  return { posts: state.createdPosts, create, remove };
}
