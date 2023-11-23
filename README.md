# 🐦 React 트위터 앱

![image](https://github.com/SeoeunCho/react-twitter/blob/main/src/preview/react-twitter_previewgif.gif)

> 👉 [사이트 바로가기](https://seoeuncho-twitter.vercel.app/)<br />
> 작업 기간 : 15일

<br />

## 📋 Project

- 이 프로젝트는 React에서 Firebase와 Redux를 연습하며 익숙해지기 위해 제작한 반응형 앱입니다.
  Firebase를 이용하여 데이터를 생성하고 사용자 인증에서 회원가입 및 로그인을 구축하고
  CRUD를 구현하여 게시글 등록, 답글, 리트윗, 좋아요 등의 소셜 SNS 기능 및 실시간 업데이트와 알림목록을 생성했습니다.
  Sass와 Media Query를 사용해 어떤 기기에도 모바일에 대응하는 반응형으로 작업했습니다.
  전역 상태 라이브러리 Recoil로 메뉴명 다국어 처리 기능을 추가하고 Vercel로 배포했습니다.

<br />

## 💡 학습

- 웹 구조 : 반응형 웹
- 스타일링 : SCSS(모바일 대응 스타일링)
- 상태관리 : 대규모 프로젝트에 적합한 라이브러리 Recoil, Redux
- 라이브러리
  - [Uuid](https://yarnpkg.com/package?name=uuid) : 고유한 아이디를 만들어 이미지업로드시 파일명 중복 방지
  - [React-Icons](https://react-icons.github.io/react-icons/) : 아이콘 스타일링 구현
  - [React-Toastify](https://www.npmjs.com/package/react-toastify) : 토스트 알림 구현
  - [Emoji-Picket-React](https://www.npmjs.com/package/emoji-picker-react) : 이모티콘 입력창 구현
  - [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) : 이미지 압축
- 프론트엔드 : React, TypeScript
- 백엔드 : Firebase를 이용한 구글/깃허브 로그인, 보안, 통신 및 실시간 데이터 업데이트
- 배포 방식: 단순배포(Vercel)

<br />
### 백엔드 관련 : Firebase/FireStore

1. [ **Firebase** ](https://firebase.google.com/?hl=ko)에서 프로젝트 생성 필요
2. [ **Firebase Authentication** ](https://firebase.google.com/products/auth?hl=ko)에서 사용자 인증 시작하기
3. [ **Firebase OAuth** ](https://firebase.google.com/docs/auth/web/google-signin?hl=ko)을 참고해 SNS 로그인 구현
4. [ **Firestore** ](https://firebase.google.com/docs/firestore)를 사용해 데이터 생성 및 실시간 데이터 업데이트
5. [ **Firestore 기본 보안 규칙** ](https://firebase.google.com/docs/rules/basics?hl=ko&authuser=0)를 참고해 API키 보안 작업

<br />
<br />

## ⚙️ 사용 스택

<div>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=TypeScript&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux-764ABC?style=flat&logo=Redux&logoColor=white" />
  <img src="https://img.shields.io/badge/Recoil-3578E5?style=flat&logo=Recoil&logoColor=white" />
  <img src="https://img.shields.io/badge/Sass-CC6699?style=flat&logo=Sass&logoColor=white" />
  <img src="https://img.shields.io/badge/cssmodules-000000?style=flat&logo=cssmodules&logoColor=white" />
  <img src="https://img.shields.io/badge/mui-007FFF?style=flat&logo=mui&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=Firebase&logoColor=white" />
  <img src="https://img.shields.io/badge/vercel-000000?style=flat&logo=vercel&logoColor=white" />
</div>

<br />

## 🛠️ 프로젝트 실행

- Yarn으로 CRA 세팅 및 TypeScript를 추가합니다. `yarn create react-app {폴더명} --template typescript`
- Router를 설치합니다. `yarn add react-router-dom`, `yarn add —dev @types/react-router-dom`
- Sass를 설치합니다. `yarn add sass`
- Firebase를 설치합니다. `yarn add firebase`
- Recoil을 설치합니다. `yarn add recoil`
- React-Icons를 설치합니다. `yarn add react-icons`
- React-Toastify를 설치합니다. `yarn add react-toastify`
- Emoji Picker를 설치합니다. `yarn add emoji-picker-react`
- Material UI(MUI)를 설치합니다. `yarn add @mui/material @emotion/react @emotion/styled`
- Uuid를 설치합니다. `yarn add uuid`, `yarn add --dev @types/uuid`
- 이미지 압축 모듈을 설치합니다. `yarn add browser-image-compression`
- Vercel CLI를 설치합니다. `yarn global add vercel`
- 프로젝트 시작 `yarn start`

<br />

## 🔑 페이지 설명

<details>
<summary>가입/로그인</summary>
<div markdown="1">

[가입/로그인 링크](https://velog.io/@rlawodh123/React-%ED%8A%B8%EC%9C%84%ED%84%B0-%ED%81%B4%EB%A1%A0-Auth)

- 회원가입/로그인
  - 토글 버튼으로 회원가입/로그인을 따로 노출
  - 일반 이메일 형식이 아닌 구글, 깃허브 아이디로도 가입 가능
  - 사이트에 들어왔을 때 유저의 상태 변화 추적 가능
    - 로그인, 로그아웃, 어플리케이션 초기화(새로고침 or 재시작) 시 변화 추적
  - 구글, 깃허브가 아닌 일반 이메일 형식으로 회원가입/로그인 할 때 발생하는 에러 문구를`includes`와 `replace` 메소드를 이용하여 표기

</div>
</details>

<details>
<summary>홈</summary>
<div markdown="2">

[홈 링크](https://velog.io/@rlawodh123/React-%ED%8A%B8%EC%9C%84%ED%84%B0-%ED%81%B4%EB%A1%A0-Firebase-Main)

- 실시간 업데이트
- 유저 정보 확인
  - 로그아웃 가능
- 트윗 작성
  - 별도의 버튼 추가 (홈이 아닌 다른 페이지에서 글을 쓰고자 할 때)
  - 이미지 추가 및 삭제 가능
  - 이모지 추가 (pc 버전에서만 지원하도록)
  - 수정/삭제
- 반응형 액션 (답글, 리트윗, 좋아요, 북마크)
- 검색창 및 팔로우 할 유저 추천 추가
  - 유저 팔로우, 언팔로우 가능

</div>
</details>

<details>
<summary>탐색하기</summary>
<div markdown="3">

[탐색하기 링크](https://velog.io/@rlawodh123/React-%ED%8A%B8%EC%9C%84%ED%84%B0-%ED%81%B4%EB%A1%A0-Firebase-Explore)<br>
※ '탐색하기'에서의 대부분 기능들은 Home(main)과 같으며 반복되는 코드들을 하나의 컴포넌트들로 묶어 재사용할 수 있게 했습니다.

- 검색창 및 트윗·사용자 탭
  - 반응형 액션 (답글, 리트윗, 좋아요, 북마크)
  - 유저 팔로우, 언팔로우 가능

</div>
</details>

<details>
<summary>알림, 북마크</summary>
<div markdown="4">

[알림, 북마크 링크](https://velog.io/@rlawodh123/React-%ED%8A%B8%EC%9C%84%ED%84%B0-%ED%81%B4%EB%A1%A0-Firebase-Notice)

- 카테고리 세분화 및 각각 정보들이 업데이트 될 때마다 실시간으로 확인 가능
- 라우터 내의 각 탭에서 렌더링 되는 정보들은 하나의 컴포넌트로 만들어서 재사용
- 노출되는 목록 오브젝트 클릭 시 라우터 이동과 시간 노출 부분은 따로 custom hooks로 빼내어 사용
  - (내용을 감싸고 있는 태그와 내용들(이미지, 닉네임)의 라우터가 다름)
  - 감싸고 있는 태그에 `<Link>`를 주게 될 시 내용들을 클릭할 때마다 원하는 라우터가 아닌 감싸진 태그의 라우터로 이동됨
  - `ref`로 if문을 작성해 `useHistory()`로 구현

</div>
</details>

<details>
<summary>프로필</summary>
<div markdown="5">

[프로필 링크](https://velog.io/@rlawodh123/React-%ED%8A%B8%EC%9C%84%ED%84%B0-%ED%81%B4%EB%A1%A0-Firebase-Profile)

- 카테고리 세분화 및 '프로필 수정', '북마크' 탭은 본인 프로필에서만 보일 수 있게 함
- '프로필 수정' 클릭 시 모달창이 활성화 되어 배경·프로필 이미지, 닉네임·자기소개 추가/변경/삭제 가능
- 가입일과 팔로잉, 팔로워 숫자 확인
  - Right Bar 팔로우 추천에서의 팔로우를 다른 유저의 프로필 탭에서도 가능
- 프로필 탭에서도 로그아웃 가능

</div>
</details>

<!-- <div style="display: flex;">
  <img src="https://github.com/SeoeunCho/site2023-react/blob/main/src/assets/img/scrrenshot/site2023-react-mobile01.png" alt="image" width="32%" height="auto">
  <img src="https://github.com/SeoeunCho/site2023-react/blob/main/src/assets/img/scrrenshot/site2023-react-mobile02.png" alt="image" width="32%" height="auto">
  <img src="https://github.com/SeoeunCho/site2023-react/blob/main/src/assets/img/scrrenshot/site2023-react-mobile03.png" alt="image" width="32%" height="auto">
</div> -->

<!-- ## 🖥️ Screenshots -->
<!-- <p>
  <img src="./README/1.png"  width="47%" />
  <img src="./README/2.png" width="47%" />
  <img src="./README/3.png"  width="47%" />
  <img src="./README/4.png" width="47%" />
  <img src="./README/5.png"  width="47%" />
</p> -->
