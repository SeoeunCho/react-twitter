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
  MENU_BOOKMARK: {
    ko: "북마크",
    en: "Bookmarks",
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
  BUTTON_MORE: {
    ko: "더 보기",
    en: "See more",
  },

  // reply
  REPLY_PLACEHOLDER: {
    ko: "내 답글을 트윗합니다.",
    en: "Tweet your reply.",
  },
  REPLY_TO: {
    ko: "에게 보내는 답글",
    en: "Replying to",
  },

  // action
  ACTION_LIKES: {
    ko: "마음에 들어요",
    en: "Likes",
  },

  // tweet
  TWEET_PLACEHOLDER: {
    ko: "무슨 일이 일어나고 있나요?",
    en: "What's happening?",
  },
  TWEET_HASHTAG: {
    ko: "해시태그 + 스페이스바 입력",
    en: "Enter Hashtags with Spacebar",
  },
  TWEET_CHANGE_IMAGE: {
    ko: "이미지 변경",
    en: "Change Image",
  },

  // retweet
  RETWEET_TEXT: {
    ko: "님이 리트윗 했습니다.",
    en: "retweeted this.",
  },

  /* no tweet === start */
  // 홈
  NO_TWEET: {
    ko: "아직은 여기에 아무 것도 없습니다.",
    en: "No Posts Yet",
  },
  NO_TWEET_LIST: {
    ko: "타임라인이 비어있습니다. 지금 트윗해보세요.",
    en: "Timeline is empty. Let's Tweet now.",
  },
  NO_TWEET_FLLOWING: {
    ko: "타임라인이 비어있습니다. 아직 아무도 팔로우하고 있지 않습니다.",
    en: "Timeline is empty. You are not following anyone yet.",
  },

  // 검색
  EXPLORE_PLACEHOLDER: {
    ko: "트위터 검색",
    en: "Search tweets",
  },
  EXPLORE_KEYWORD: {
    ko: "사용자, 키워드를 검색해보세요.",
    en: "Search for users and keywords.",
  },
  EXPLORE_NOT_REVEALED: {
    ko: "(본인 정보는 노출되지 않습니다.)",
    en: "(Your information will not be revealed.)",
  },
  EXPLORE_NO_MATCHED: {
    ko: "검색하신 결과가 없습니다.",
    en: "There are no results for your search.",
  },
  EXPLORE_HASHTAGS: {
    ko: "해시태그 탐색",
    en: "Explore Hashtags",
  },
  NO_EXPLORE_LIST: {
    ko: "타임라인이 비어있습니다. 지금 트윗해보세요.",
    en: "No Posts Yet",
  },
  RECOMMEND_FOLLOW: {
    ko: "팔로우 추천",
    en: "Follow recommend",
  },

  // 알림
  NO_BOOKMARK_TWEET: {
    ko: "아직 저장한 트윗이 없습니다.",
    en: "No tweets have been saved yet.",
  },
  NO_BOOKMARK_REPLY: {
    ko: "아직 저장한 답글이 없습니다.",
    en: "No replies have been saved yet.",
  },
  SAVE_BOOKMARK: {
    ko: "지금 일어나는 일을 북마크에 담아보세요.",
    en: "Bookmark what's happening now.",
  },
  NO_NOTIFICATION_RETWEET: {
    ko: "누군가가 나의 트윗을 리트윗 하면 여기에 표시됩니다.",
    en: "When someone retweets your tweet, it will appear here.",
  },
  NO_NOTIFICATION_REPLY: {
    ko: "누군가가 나의 트윗에 답글을 달면 여기에 표시됩니다.",
    en: "When someone replies to your tweet, it will appear here.",
  },
  NO_NOTIFICATION_FOLLOW: {
    ko: "누군가가 나를 팔로우 하면 여기에 표시됩니다.",
    en: "When someone follows you, they'll show up here.",
  },
  NOTIFICATION_RETWEET: {
    ko: "답글에 리트윗을 했습니다.",
    en: " reply.",
  },
  NOTIFICATION_TWEET: {
    ko: "글에 리트윗을 했습니다.",
    en: " tweet.",
  },
  NOTIFICATION_REPLY: {
    ko: "글에 답글을 했습니다.",
    en: " tweet.",
  },
  NOTIFICATION_FOLLOW: {
    ko: "회원님을 팔로우 했습니다.",
    en: "followed you.",
  },
  NOTIFICATION_FROM_RETWEET: {
    ko: "님이",
    en: " retweeted",
  },
  NOTIFICATION_FROM_REPLY: {
    ko: "님이",
    en: "",
  },
  NOTIFICATION_FROM_FOLLOWING: {
    ko: "님이",
    en: "followed",
  },
  /* no tweet === end */

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
  TAB_TWEET: {
    ko: "트윗",
    en: "Tweet",
  },
  TAB_REPLY: {
    ko: "답글",
    en: "Replies",
  },
  TAB_RETWEET: {
    ko: "리트윗",
    en: "Retweet",
  },
  TAB_LIKES: {
    ko: "좋아요",
    en: "Likes",
  },
  TAB_BOOKMARK: {
    ko: "북마크",
    en: "Bookmark",
  },
  TAB_USER: {
    ko: "유저",
    en: "User",
  },
  TAB_USER2: {
    ko: "사용자",
    en: "User",
  },

  // profile
  PROFILE_NAME: {
    ko: "이름",
    en: "Name",
  },
  PROFILE_ABOUT_ME: {
    ko: "자기 소개",
    en: "About Me",
  },
  PROFILE_ABOUT_ME_TEXT: {
    ko: "소개글이 없습니다.",
    en: "There is no introduction.",
  },
  PROFILE_JOIN_DATE: {
    ko: "가입일",
    en: "Join Date",
  },
  NO_MY_TWEET: {
    ko: "아직 작성한 트윗이 없습니다.",
    en: "No tweets have been written yet.",
  },
  NO_MY_TWEET_LIST: {
    ko: "지금 일어나는 일을 트윗에 담아보세요.",
    en: "Tweet what's happening.",
  },
  NO_MY_REPLY: {
    ko: "아직 작성한 답글이 없습니다.",
    en: "No replies have been written yet.",
  },
  NO_MY_REPLY_LIST: {
    ko: "좋은 트윗과 소통하고 싶다면 답글을 달아보세요.",
    en: "If you want to communicate with good tweets, please reply to them.",
  },
  NO_MY_RETWEET: {
    ko: "아직 리트윗한 트윗이 없습니다.",
    en: "No tweets have been retweeted yet.",
  },
  NO_MY_RETWEET_LIST: {
    ko: "좋은 트윗을 알리고 싶다면 리트윗을 눌러 표시를 해보세요.",
    en: "If you want to communicate with good tweets, please reply to them.",
  },
  NO_MY_RETWEET_REPLY: {
    ko: "아직 리트윗한 답글이 없습니다.",
    en: "No replies have been retweeted yet.",
  },
  NO_LIKE_REPLY: {
    ko: "아직 마음에 들어한 답글이 없습니다.",
    en: "No replies have liked it yet.",
  },
  NO_LIKE_REPLY_LIST: {
    ko: "좋아하는 답글에 하트를 눌러 표시 해보세요. 마음에 들어한 답글은 여기에 표시됩니다.",
    en: "Click the heart on your favorite reply to mark it. Replies you like will appear here.",
  },
  NO_LIKE_TWEET: {
    ko: "아직 마음에 들어한 트윗이 없습니다.",
    en: "No tweets have liked it yet.",
  },
  NO_LIKE_TWEET_LIST: {
    ko: "좋아하는 트윗에 하트를 눌러 표시 해보세요. 마음에 들어한 트윗은 여기에 표시됩니다.",
    en: "Click the heart on your favorite tweet to mark it. Tweets you like will appear here.",
  },

  // signin, signup
  AUTH_OR: {
    ko: "또는",
    en: "OR",
  },
  AUTH_TEXT: {
    ko: "지금 일어나고 있는 일",
    en: "Happening now",
  },
  AUTH_LOGIN_TEXT: {
    ko: "트위터에 로그인하기",
    en: "Sign in to Twitter.",
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
    ko: "이미 트위터에 가입하셨나요?",
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
  ADD_REPLY_TOAST: {
    ko: "답글을 생성했습니다.",
    en: "Reply completed.",
  },
  CHECK_DELETE_TOAST: {
    ko: "정말로 삭제하시겠습니까?",
    en: "Do you really want to delete it?",
  },
  DELETE_TOAST: {
    ko: "삭제되었습니다.",
    en: "It has been deleted.",
  },
  ADD_TWEET_TOAST: {
    ko: "트윗이 등록되었습니다.",
    en: "The tweet has been edited.",
  },
  EDIT_TWEET_TOAST: {
    ko: "트윗이 수정되었습니다.",
    en: "The tweet has been edited.",
  },
  EDIT_REPLY_TOAST: {
    ko: "답글이 수정되었습니다.",
    en: "The reply has been edited.",
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
  ADD_PROFILE_TOAST: {
    ko: "프로필이 업데이트 되었습니다.",
    en: "Your profile has been updated.",
  },
  LIKE_TOAST: {
    ko: "좋아요가 반영되었습니다.",
    en: "Followed.",
  },
  LIKE_CANCEL_TOAST: {
    ko: "좋아요를 취소했습니다.",
    en: "Followed.",
  },
  EDIT_PROFILE_TOAST: {
    ko: "프로필이 수정되었습니다.",
    en: "The profile has been edited.",
  },
  CHECK_DELETE_PROFILE_IMG_TOAST: {
    ko: "프로필 사진을 삭제하시겠습니까?",
    en: "Delete your profile image?",
  },
  CHECK_DELETE_BG_IMG_TOAST: {
    ko: "배경 사진을 삭제하시겠습니까?",
    en: "Delete your profile background image?",
  },

  // time
  TIME_JUST: {
    ko: "방금 전",
    en: "Just ago",
  },
  TIME_MINUTE: {
    ko: "분 전",
    en: "minutes ago",
  },
  TIME_HOUR: {
    ko: "시간 전",
    en: "hours ago",
  },
  TIME_DAY: {
    ko: "일 전",
    en: "days ago",
  },
  TIME_WEEK: {
    ko: "주 전",
    en: "weeks ago",
  },
  TIME_AM: {
    ko: "오전",
    en: "AM",
  },
  TIME_PM: {
    ko: "오후",
    en: "PM",
  },
};

export default TRANSLATIONS;
