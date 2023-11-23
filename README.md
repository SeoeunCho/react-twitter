# 🐦 React 트위터 앱
![image](https://github.com/SeoeunCho/react-twitter/blob/main/src/preview/react-twitter_previewgif.gif)

### 🖥️ Preview

이 프로젝트는 React에서 TypeScript사용에 익숙해지기 위해 제작한 반응형 앱입니다.
Firebase를 이용하여 데이터를 생성하고 사용자 인증에서 회원가입 및 로그인을 구축하고
CRUD를 구현하여 게시글 등록, 답글, 리트윗, 좋아요 등의 소셜 SNS 기능 및 실시간 업데이트와 알림목록을 생성했습니다.
Sass와 Media Query를 사용해 어떤 기기에도 모바일에 대응하는 반응형으로 작업했습니다.
전역 상태 라이브러리 Recoil로 메뉴명 다국어 처리 기능을 추가하고 Vercel로 배포했습니다.



## 완성작 보기

- 미리보기 : DEMO(https://seoeuncho-twitter.vercel.app/)
- 작업 기간 : 7일

## 학습

- 컴포넌트 기반 : 자체적인 상태(state)와 프로퍼티(props)를 가진 각각의 컴포넌트를 조합하여 코드의 유지보수가 용이해지고 코드 재사용성이 높아집니다.
- Virtual DOM : React는 가상 DOM(Virtual DOM)을 사용하여 효율적인 UI 업데이트를 수행합니다. 가상 DOM은 실제 DOM과 동기화되어 있으며, 상태 변화에 따른 최소한의 변경만을 적용하여 성능을 향상시킵니다.
- JSX : 자바스크립트 확장 문법인 JSX를 사용하여 컴포넌트의 구조를 선언적으로 작성하고 UI와 관련된 로직을 더 직관적이고 가독성 있게 작성할 수 있습니다.
- TypeScript : 타입스크립트를 사용하여 정적타이핑, 실시간 에러 방지, 가독성 및 생산성 향상, 유지보수 용이성, 컴포넌트 기반 개발에 효과적인 로직 생성이 가능합니다.
- 생명주기 메서드 : React 컴포넌트는 생성, 갱신, 제거 등의 생명주기 메서드를 가지고 있습니다. 이를 활용하여 컴포넌트가 마운트되거나 갱신될 때 특정 동작을 수행할 수 있습니다.
- 상태관리 : React Hooks의 ` useState``useEffect``useCallback``useContext` 를 사용하여 상태관리를 효율적으로 처리할 수 있습니다.
- 라우팅 기능 : React-Router-Dom를 사용하여 SPA에서 화면 전환을 구현합니다.
- Firebase : Firebase를 이용해 구글/깃허브 로그인, 보안, 통신 및 실시간 데이터 업데이트를 가능하게 합니다.

## 사용 스택

- React(https://ko.legacy.reactjs.org/) 를 사용하여 사이트를 번들링하고 관리합니다.
- TypeScript(https://www.typescriptlang.org/) 를 사용하여 사이트를 번들링하고 관리합니다.
- Firebase(https://firebase.google.com/?hl=ko)를 이용하여 사용자 인증 구현과 실시간 데이터 업데이트 및 CRUD를 구현합니다.
- Uuid(https://yarnpkg.com/package?name=uuid) 라이브러리로 고유한 아이디를 만들어 이미지업로드시 파일명 중복을 방지합니다.
- React-Icons(https://react-icons.github.io/react-icons/) 를 사용하여 아이콘 스타일링을 구현합니다.
- React-Toastify(https://fkhadra.github.io/react-toastify/introduction) 를 사용하여 토스트 알림을 구현합니다.
- Recoil(https://recoiljs.org/ko/) 을 통해 상태관리와 다국어 처리를 지원합니다.
- Vercel(https://vercel.com/) 을 통해 사이트를 배포합니다.
- Github(https://github.com/) 을 사용하여 파일을 관리합니다.
- SCSS 기반으로 모바일에 대응하는 스타일링을 구현합니다.

## 프로젝트 실행

- Yarn으로 CRA 세팅 및 TypeScript를 추가합니다. `yarn create react-app {폴더명} --template typescript`
- Router를 설치합니다. `yarn add react-router-dom`, `yarn add —dev @types/react-router-dom`
- Sass를 설치합니다. `yarn add sass`
- Firebase를 설치합니다. `yarn add firebase`
- Recoil을 설치합니다. `yarn add recoil`
- React-Icons를 설치합니다. `yarn add react-icons`
- React-Toastify를 설치합니다. `yarn add react-toastify`
- Material UI(MUI)를 설치합니다. `yarn add @mui/material @emotion/react @emotion/styled`
- Emoji Picker를 설치합니다. `yarn add emoji-picker-react`
- Uuid를 설치합니다. `yarn add uuid`, `yarn add --dev @types/uuid`
- 이미지 압축 모듈을 설치합니다. `yarn add browser-image-compression`
- Vercel CLI를 설치합니다. `yarn global add vercel`
- 프로젝트 시작 `yarn start`

## 백엔드 관련 : Firebase/FireStore

1. [ **Firebase** ](https://firebase.google.com/?hl=ko)에서 프로젝트 생성 필요
2. [ **Firebase Authentication** ](https://firebase.google.com/products/auth?hl=ko)에서 사용자 인증 시작하기
3. [ **Firebase OAuth** ](https://firebase.google.com/docs/auth/web/google-signin?hl=ko)을 참고해 SNS 로그인 구현
4. [ **Firestore** ](https://firebase.google.com/docs/firestore)를 사용해 데이터 생성 및 실시간 데이터 업데이트
5. [ **Firestore 기본 보안 규칙** ](https://firebase.google.com/docs/rules/basics?hl=ko&authuser=0)를 참고해 API키 보안 작업

## Screenshots

<!-- <div style="display: flex;">
  <img src="https://github.com/SeoeunCho/site2023-react/blob/main/src/assets/img/scrrenshot/site2023-react-mobile01.png" alt="image" width="32%" height="auto">
  <img src="https://github.com/SeoeunCho/site2023-react/blob/main/src/assets/img/scrrenshot/site2023-react-mobile02.png" alt="image" width="32%" height="auto">
  <img src="https://github.com/SeoeunCho/site2023-react/blob/main/src/assets/img/scrrenshot/site2023-react-mobile03.png" alt="image" width="32%" height="auto">
</div> -->
