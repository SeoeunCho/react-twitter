const TRANSLATIONS = {
  // menu
  MENU_HOME: {
    ko: "홈",
    en: "Home",
  },
  MENU_EXPLORE: {
    ko: "탐색하기",
    en: "Explore",
  },
  MENU_NOTI: {
    ko: "알림",
    en: "Notifications",
  },
  MENU_PROFILE: {
    ko: "프로필",
    en: "Profile",
  },
  MENU_LOGOUT: {
    ko: "로그아웃",
    en: "Logout",
  },
  MENU_LOGIN: {
    ko: "로그인",
    en: "Login",
  },
  MENU_SIGNUP: {
    ko: "회원가입",
    en: "Signup",
  },

  // button
  BUTTON_FOLLOWING: {
    ko: "팔로잉",
    en: "Following",
  },
  BUTTON_FOLLOW: {
    ko: "팔로우",
    en: "Follow",
  },
  BUTTON_EDIT: {
    ko: "수정하기",
    en: "Edit",
  },
  BUTTON_DELETE: {
    ko: "삭제하기",
    en: "Delete",
  },
  BUTTON_EDIT_PROFILE: {
    ko: "프로필 수정",
    en: "Edit Profile",
  },
  BUTTON_REPLY: {
    ko: "답글",
    en: "Reply",
  },
  BUTTON_TWEET: {
    ko: "트윗하기",
    en: "Tweet",
  },
  BUTTON_LOGIN: {
    ko: "로그인",
    en: "Log in",
  },
  BUTTON_SIGNUP: {
    ko: "가입하기",
    en: "Sign up",
  },

  // reply
  REPLY_PLACEHOLDER: {
    ko: "내 답글을 트윗합니다.",
    en: "Tweet your reply.",
  },
  REPLY_TO: {
    ko: "님에게 보내는 답글",
    en: "Replying to",
  },

  // action
  ACTION_LIKES: {
    ko: "마음에 들어요",
    en: "Likes",
  },

  // post
  POST_PLACEHOLDER: {
    ko: "무슨 일이 일어나고 있나요?",
    en: "What's happening?",
  },
  POST_HASHTAG: {
    ko: "해시태그 + 스페이스바 입력",
    en: "Enter Hashtags with Spacebar",
  },
  POST_CHANGE_IMAGE: {
    ko: "이미지 변경",
    en: "Change Image",
  },
  NAME_PLACEHOLDER: {
    ko: "이름",
    en: "Name",
  },

  /* no post === start */
  // 홈
  NO_POSTS: {
    ko: "아직은 여기에 아무 것도 없습니다.",
    en: "No Posts Yet",
  },
  NO_POSTS_LIST: {
    ko: "타임라인이 비어있습니다. 지금 트윗해보세요.",
    en: "Timeline is empty. Let's Tweet now.",
  },
  NO_POSTS_FLLOWING: {
    ko: "타임라인이 비어있습니다. 아직 아무도 팔로우하고 있지 않습니다.",
    en: "Timeline is empty. You are not following anyone yet.",
  },

  // 검색
  NO_EXPLORE_LIST: {
    ko: "타임라인이 비어있습니다. 지금 트윗해보세요.",
    en: "No Posts Yet",
  },

  // 알림
  NO_NOTIFICATIONS_FOLLOWING: {
    ko: "누군가가 나를 팔로우를 하면 여기에 표시됩니다.",
    en: "No Notifications",
  },
  NO_NOTIFICATIONS_REPLY: {
    ko: "누군가가 나의 게시글에 답글을 달면 여기에 표시됩니다.",
    en: "No Notifications",
  },
  /* no post === end */

  // tabs
  TAB_FOLLOWING_ING: {
    ko: "팔로우 중",
    en: "Following",
  },
  TAB_FOLLOWING: {
    ko: "팔로잉",
    en: "Following",
  },
  TAB_ALL: {
    ko: "전체",
    en: "For you",
  },
  TAB_LIKES: {
    ko: "좋아요",
    en: "Likes",
  },
  TAB_MY: {
    ko: "트윗",
    en: "Tweet",
  },
  TAB_REPLY: {
    ko: "답글",
    en: "Replies",
  },

  // explore
  EXPLORE_HASHTAGS: {
    ko: "해시태그 탐색",
    en: "Explore Hashtags",
  },
  // profile
  PROFILE_NAME: {
    ko: "사용자님",
    en: "User",
  },

  // signin, signup
  AUTH_TEXT: {
    ko: "지금 일어나고 있는 일",
    en: "Happening now",
  },
  AUTH_LOGIN_TEXT: {
    ko: "Xwitter 로그인하기",
    en: "Sign in to Xwitter.",
  },
  AUTH_SIGNUP_TEXT: {
    ko: "지금 가입하세요.",
    en: "Join today.",
  },
  FORM_EMAIL: {
    ko: "이메일",
    en: "Email",
  },
  FORM_PASSWORD: {
    ko: "비밀번호",
    en: "Password",
  },
  FORM_PASSWORD_CHECK: {
    ko: "비밀번호 확인",
    en: "Confirm Password",
  },
  NO_ACCOUNT: {
    ko: "계정이 없으신가요?",
    en: "No Account?",
  },
  YES_ACCOUNT: {
    ko: "이미 Xwitter에 가입하셨나요?",
    en: "Already have an account?",
  },
  LOGIN_WITH_GOOGLE: {
    ko: "Google 계정으로 로그인",
    en: "Sign in with Google",
  },
  LOGIN_WITH_GITHUB: {
    ko: "Github 계정으로 로그인",
    en: "Sign in with Github",
  },
  SIGNUP_GOOGLE: {
    ko: "Google 계정으로 가입하기",
    en: "Sign up with Google",
  },
  SIGNUP_GITHUB: {
    ko: "Github 계정으로 가입하기",
    en: "Sign up with Github",
  },
  SIGNUP_LINK: {
    ko: "가입하기",
    en: "Sign up",
  },
  LOGIN_LINK: {
    ko: "로그인하기",
    en: "Log in",
  },

  // toast
  SUBMIT_ERROR_TOAST: {
    ko: "내용을 입력해주세요.",
    en: "Please enter text.",
  },
  SUCCESS_LOGIN_TOAST: {
    ko: "성공적으로 로그인 되었습니다.",
    en: "You have logged in successfully.",
  },
  SUCCESS_SIGNIN_TOAST: {
    ko: "성공적으로 회원가입 되었습니다.",
    en: "You have successfully registered as a member.",
  },
  EMAIL_CHECK_TOAST: {
    ko: "이메일 형식이 올바르지 않습니다.",
    en: "The email format is incorrect.",
  },
  PW_CHECK_TOAST: {
    ko: "비밀번호를 8자리 이상 입력해주세요.",
    en: "Please enter a password of at least 8 characters.",
  },
  PW_RECHECK_TOAST: {
    ko: "비밀번호를 다시 확인해주세요.",
    en: "Please check your password again.",
  },
  LOGIN_TOAST: {
    ko: "로그인 되었습니다.",
    en: "You are logged in.",
  },
  LOGOUT_TOAST: {
    ko: "로그아웃 되었습니다.",
    en: "You are logged out.",
  },
  CHECK_LOGOUT_TOAST: {
    ko: "로그아웃 하시겠습니까?",
    en: "Do you want to log out?",
  },
  UPDATE_REPLY_TOAST: {
    ko: "답글을 생성했습니다.",
    en: "Reply completed.",
  },
  DELETE_REPLY_TOAST: {
    ko: "답글을 삭제했습니다.",
    en: "Reply deleted.",
  },
  DELETE_POST_TOAST: {
    ko: "게시글을 삭제했습니다.",
    en: "The post has been deleted.",
  },
  CHECK_DELETE_POST_TOAST: {
    ko: "정말로 이 게시물을 삭제하시겠습니까?",
    en: "Are you sure you want to delete this post?",
  },
  UPDATE_POST_TOAST: {
    ko: "게시글이 등록되었습니다.",
    en: "The post has been edited.",
  },
  EDIT_POST_TOAST: {
    ko: "게시글이 수정되었습니다.",
    en: "The post has been edited.",
  },
  SAME_TAG_TOAST: {
    ko: "같은 태그가 있습니다.",
    en: "There is the same tags.",
  },
  FOLLOWING_TOAST: {
    ko: "팔로우했습니다.",
    en: "Followed.",
  },
  UN_FOLLOWING_TOAST: {
    ko: "팔로우를 취소했습니다.",
    en: "Unfollowed.",
  },
  UPDATE_PROFILE_TOAST: {
    ko: "프로필이 업데이트 되었습니다.",
    en: "Your profile has been updated.",
  },
};

export default TRANSLATIONS;
