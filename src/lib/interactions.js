// State for everything the user can do in the UI before a backend exists:
// likes, follows, bookmarks, comments and posts they write. A pure reducer,
// so it is easy to test; components/providers/interactions-provider.jsx
// holds it in React state for the whole app.
//
// Likes and bookmarks store only what the user changed: anything missing
// falls back to the values that came with the post from the server.

export function createInitialState({ bookmarkedPostIds = [] } = {}) {
  return {
    likes: {}, // postId -> { liked, count }
    follows: {}, // username -> true
    bookmarks: Object.fromEntries(bookmarkedPostIds.map((id) => [id, true])), // postId -> boolean
    comments: {}, // postId -> comments the user added, oldest first
    createdPosts: [], // posts the user wrote, newest first
  };
}

export function interactionsReducer(state, action) {
  switch (action.type) {
    case "toggleLike": {
      const { postId, initialLiked, initialCount } = action;
      const current = state.likes[postId] ?? { liked: initialLiked, count: initialCount };
      const liked = !current.liked;
      const count = Math.max(0, current.count + (liked ? 1 : -1));
      return { ...state, likes: { ...state.likes, [postId]: { liked, count } } };
    }

    case "toggleFollow": {
      const follows = { ...state.follows };
      if (follows[action.username]) delete follows[action.username];
      else follows[action.username] = true;
      return { ...state, follows };
    }

    case "toggleBookmark": {
      const bookmarked = !state.bookmarks[action.postId];
      return { ...state, bookmarks: { ...state.bookmarks, [action.postId]: bookmarked } };
    }

    case "addComment": {
      const existing = state.comments[action.postId] ?? [];
      return {
        ...state,
        comments: { ...state.comments, [action.postId]: [...existing, action.comment] },
      };
    }

    case "createPost":
      return { ...state, createdPosts: [action.post, ...state.createdPosts] };

    case "deletePost": {
      // Only posts the user wrote can be deleted.
      if (!state.createdPosts.some((post) => post.id === action.postId)) return state;
      const { [action.postId]: _like, ...likes } = state.likes;
      const { [action.postId]: _bookmark, ...bookmarks } = state.bookmarks;
      const { [action.postId]: _comments, ...comments } = state.comments;
      return {
        ...state,
        createdPosts: state.createdPosts.filter((post) => post.id !== action.postId),
        likes,
        bookmarks,
        comments,
      };
    }

    default:
      return state;
  }
}

// --- selectors ---

export function selectLike(state, postId, initialLiked, initialCount) {
  return state.likes[postId] ?? { liked: initialLiked, count: initialCount };
}

export const selectIsFollowing = (state, username) => Boolean(state.follows[username]);

export const selectIsBookmarked = (state, postId) => Boolean(state.bookmarks[postId]);

export function selectComments(state, postId, initialComments = []) {
  return [...initialComments, ...(state.comments[postId] ?? [])];
}

export const selectBookmarkCount = (state) =>
  Object.values(state.bookmarks).filter(Boolean).length;
