"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_PATHS = void 0;
const SERVER_PATH_ROOTS = {
    AUTH: "/auth",
    UPLOADER: "/uploader",
    USERS: "/users",
    ADMIN: "/admin",
    CONVERSATION: "/conversation",
    /* Prepend path root - DO NOT REMOVE */
};
exports.SERVER_PATHS = {
    AUTH: {
        ROOT: SERVER_PATH_ROOTS.AUTH,
        SIGNUP: "/signup",
        LOGIN: "/login",
        LOGGED_IN: "/loggedin",
        VERIFY: "/verify",
        FORGOT_PASSWORD: "/forgot-password",
        RESET_PASSWORD: "/reset-password",
    },
    UPLOADER: {
        ROOT: SERVER_PATH_ROOTS.UPLOADER,
        UPLOAD_PICTURE: "/upload-picture",
    },
    USERS: {
        ROOT: SERVER_PATH_ROOTS.USERS,
        ALL_USERS: "/all-users",
        ALL_ARTISTS: "/artists",
        GET_USER: (id = ":id") => `/user/${id}`,
        ARTIST_BY_SLUG: (slug = ":slug") => `/artist/${slug}`,
        EDIT_ACCOUNT: (id = ":id") => `/edit-account/${id}`,
        EDIT_PASSWORD: (id = ":id") => `/edit-password/${id}`,
        DELETE_ACCOUNT: (id = ":id") => `/delete-account/${id}`,
        GET_ALL_CITIES: "/cities",
        GET_ALL_GENRES: "/genres",
        GET_PRICES: "/prices",
    },
    ADMIN: {
        ROOT: SERVER_PATH_ROOTS.ADMIN,
        EDIT_ROLE: (id = ":id") => `/edit-role/${id}`,
        RESET_PASSWORD: (id = ":id") => `/reset-password/${id}`,
        DELETE_USER: (id = ":id") => `/delete-user/${id}`,
    },
    CONVERSATION: {
        ROOT: SERVER_PATH_ROOTS.CONVERSATION,
        ALL_CONVERSATIONS: "/conversations",
        GET_CONVERSATION: (id = ":id") => `/conversation/${id}`,
        GET_USER_CONVERSATIONS: (id = ":id") => `/user-conversation/${id}`,
        NEW_CONVERSATION: "/new-conversation",
        READ_CONVERSATION: (id = ":id") => `/read-conversation/${id}`,
        UNREAD_CONVERSATION: (id = ":id") => `/unread-conversation/${id}`,
        DELETE_CONVERSATION: (id = ":id") => `/delete-conversation/${id}`,
    },
    /* Prepend server path - DO NOT REMOVE */
};
