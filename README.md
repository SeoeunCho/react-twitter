# 🐦 React 트위터 앱
![image](https://github.com/SeoeunCho/react-twitter/blob/main/src/preview/react-twitter_preview.gif)

> 👉 [사이트 바로가기](https://react-twitter-nine.vercel.app/)<br />
> 작업 기간 : 15일

<br />

## 📋 Project

- 이 프로젝트는 React에서 Firebase와 Redux를 연습하며 익숙해지기 위해 제작한 반응형 앱입니다.<br />
  Firebase를 이용하여 데이터를 생성하고 사용자 인증에서 회원가입 및 로그인을 구축하고<br />
  CRUD를 구현하여 게시글 등록, 답글, 리트윗, 좋아요 등의 소셜 SNS 기능 및 실시간 업데이트와 알림목록을 생성했습니다.<br />
  Sass와 Media Query를 사용해 어떤 기기에도 모바일에 대응하는 반응형으로 작업했습니다.<br />
  전역 상태 라이브러리 Recoil로 메뉴명 다국어 처리 기능을 추가하고 Vercel로 배포했습니다.

<br />

## 💡 학습

- 웹 구조 : 반응형 웹
- 스타일링 : SCSS(모바일 대응 스타일링)
- 상태관리 : 대규모 프로젝트에 적합한 라이브러리 Recoil, Redux
- 라이브러리
  - [ **Uuid** ](https://yarnpkg.com/package?name=uuid) : 고유한 아이디를 만들어 이미지업로드시 파일명 중복 방지
  - [ **React-Icons** ](https://react-icons.github.io/react-icons/) : 아이콘 스타일링 구현
  - [ **React-Toastify** ](https://www.npmjs.com/package/react-toastify) : 토스트 알림 구현
  - [ **Emoji-Picket-React** ](https://www.npmjs.com/package/emoji-picker-react) : 이모지 입력창 구현
  - [ **Browser-Image-Compression** ](https://www.npmjs.com/package/browser-image-compression) : 이미지 압축
- 프론트엔드 관련 : React, TypeScript
- 백엔드 관련 : Firebase를 이용한 구글/깃허브 로그인, 보안, 통신 및 실시간 데이터 업데이트
  - [ **Firebase** ](https://firebase.google.com/?hl=ko)에서 프로젝트 생성 필요
  - [ **Firebase Authentication** ](https://firebase.google.com/products/auth?hl=ko)에서 사용자 인증 시작하기
  - [ **Firebase OAuth** ](https://firebase.google.com/docs/auth/web/google-signin?hl=ko)을 참고해 SNS 로그인 구현
  - [ **Firestore** ](https://firebase.google.com/docs/firestore)를 사용해 데이터 생성 및 실시간 데이터 업데이트
  - [ **Firestore 기본 보안 규칙** ](https://firebase.google.com/docs/rules/basics?hl=ko&authuser=0)를 참고해 API키 보안 작업
- 배포 방식: 단순배포(Vercel)

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
<summary>회원가입/로그인</summary>
<div markdown="1">
- 회원가입/로그인
  - 토글 버튼으로 회원가입/로그인 화면 전환
  - 아이디·비밀번호 중복확인 및 유효성 체크
  - 일반 이메일 형식 뿐만 아니라 구글·깃허브 계정으로도 로그인 가능
  - 사이트에 들어왔을 때 유저의 상태 변화 추적 가능
    - 로그인, 로그아웃, 어플리케이션 초기화(새로고침 or 재시작) 시 변화 추적
</div>
</details>

<details>
<summary>홈</summary>
<div markdown="2">
- 실시간 업데이트
- 트윗 작성
  - 홈이 아닌 다른 페이지에서도 트윗할 수 있도록 왼쪽 메뉴바에 트윗하기 버튼 추가
  - 이미지 추가 및 삭제 기능
  - 이모지 입력 기능
  - 해쉬태그 입력 기능
  - 트윗 수정·삭제
- 왼쪽 사이드 메뉴
  - 홈, 탐색하기, 알림, 북마크, 프로필 메뉴로 이동
  - 홈이 아닌 다른 페이지에서도 트윗할 수 있도록 왼쪽메뉴바에 트윗하기 버튼 추가
  - 유저 정보 확인 및 로그아웃 기능
- 오른쪽 사이드 메뉴
  - 트윗·유저 검색 기능
  - 본인 제외한 유저 목록 조회 및 팔로우 추천(팔로우, 언팔로우 기능)
- 반응형 액션 (답글, 리트윗, 좋아요, 북마크)
</div>
</details>

<details>
<summary>탐색하기</summary>
<div markdown="3">
※ '탐색하기'에서의 대부분 기능들은 '홈'과 같으며 반복되는 코드들을 하나의 컴포넌트로 묶어 재사용할 수 있게 했습니다.

- 검색창 및 트윗·사용자 탭
  - 반응형 액션 (답글, 리트윗, 좋아요, 북마크)
  - 유저 목록 조회 및 팔로우, 언팔로우 가능
</div>
</details>

<details>
<summary>알림/북마크</summary>
<div markdown="4">
- 알림 리트윗/답글/팔로우 탭
  - 누군가가 트윗에 리트윗·답글을 하면 실시간 알림 생성
  - 트윗 링크 및 리트윗·답글한 유저의 프로필 정보 링크로 이동 가능
  - 팔로우한 유저의 프로필 정보 링크로 이동 가능

- 북마크 트윗/답글 탭
  - 북마크한 트윗·답글 목록 조회 및 취소 시 실시간 반영
</div>
</details>

<details>
<summary>프로필</summary>
<div markdown="5">
- 헤더에 트윗한 개수 표시 및 로그아웃 가능
- '프로필 수정', '북마크' 탭은 본인 프로필에서만 노출 됨
- '한국어/English' 버튼으로 언어 변경 가능
- '프로필 수정' 클릭 시 모달창이 활성화 되어 배경·프로필 이미지, 닉네임·자기소개 추가/변경/삭제 가능
- 가입일과 팔로잉, 팔로워 숫자 확인

</div>
</details>

<!-- ## 🖥️ Screenshots -->
<!-- <p>
  <img src="./README/1.png"  width="47%" />
  <img src="./README/2.png" width="47%" />
  <img src="./README/3.png"  width="47%" />
  <img src="./README/4.png" width="47%" />
  <img src="./README/5.png"  width="47%" />
</p> -->
