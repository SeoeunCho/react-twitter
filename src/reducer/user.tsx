export const SET_LOGIN_TOKEN = "SET_LOGIN_TOKEN";
export const SET_CURRENT_USER = "SET_CURRENT_USER";
export const SET_MODE = "SET_MODE";
export const SET_PROGRESS_BAR = "SET_PROGRESS_BAR";
export const SET_NOT_MODAL = "SET_NOT_MODAL";

export const setLoginToken = (loginToken: any) => ({
  type: SET_LOGIN_TOKEN,
  payload: loginToken,
});

export const setCurrentUser = (currentUser: any) => ({
  type: SET_CURRENT_USER,
  payload: currentUser,
});

export const setMode = (mode: any) => ({
  type: SET_MODE,
  payload: mode,
});

export const setProgressBar = (load: any) => ({
  type: SET_PROGRESS_BAR,
  payload: load,
});

export const setNotModal = (modal: any) => ({
  type: SET_NOT_MODAL,
  payload: modal,
});

const initialState = {
  loginToken: "logout",
  currentUser: {
    uid: "",
    photoURL: "",
    displayName: "",
    createdAtId: "",
    description: "",
    email: "",
    bgURL: "",
    bookmark: [],
    reTweet: [],
    followerAt: [],
    followingAt: [],
    follower: [],
    following: [],
  },
  mode: "white",
  load: {
    load: false,
  },
  modal: false,
};

const user = (state: any = initialState, action: any) => {
  switch (action.type) {
    case SET_LOGIN_TOKEN:
      return {
        ...state,
        loginToken: action.payload,
      };

    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };

    case SET_MODE:
      return {
        ...state,
        mode: action.payload,
      };

    case SET_PROGRESS_BAR:
      return {
        ...state,
        load: action.payload,
      };

    case SET_NOT_MODAL:
      return {
        ...state,
        modal: action.payload,
      };

    default:
      return state;
  }
};

export default user;
