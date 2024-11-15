# 링크
https://nextjs-fastapi-lilac.vercel.app

# 실행방법

pip3 install -r requirements.txt && python3 -m uvicorn api.index:app --reload

# 실행

yarn dev

npm run start-api

# 설치

`npm install --save @types/react-scroll-to-bottom`
`yarn add axios`
`yarn add react-icons`

### 전체 구조

1. **App 컴포넌트 (`App.js`)**: 메인 앱 컴포넌트.

   - **Router**: 페이지 라우팅을 관리.
     - 로그인 페이지
     - 메인 페이지 (친구목록, 대화목록 포함)

2. **공통 컴포넌트**
   - **Header**: 앱의 상단 바, 로그아웃 버튼 등 포함.
   - **Footer**: 앱의 하단 바 (필요한 경우).

### 로그인 화면

1. **LoginPage 컴포넌트 (`LoginPage.js`)**: 로그인 페이지 전체를 렌더링.
   - **LoginForm 컴포넌트 (`LoginForm.js`)**: 사용자 이름, 비밀번호 입력 필드 및 로그인 버튼을 포함.

### 친구목록화면, 대화목록 화면

1. **MainPage 컴포넌트 (`MainPage.js`)**: 메인 페이지를 렌더링하며, 친구목록과 대화목록 화면을 토글할 수 있음.
   - **FriendList 컴포넌트 (`FriendList.js`)**: 친구 목록을 보여줌.
   - **ChatList 컴포넌트 (`ChatList.js`)**: 대화 목록을 보여줌.

### 친구 클릭 시 대화하기 기능

1. **ChatPage 컴포넌트 (`ChatPage.js`)**: 선택한 친구와의 대화 화면을 렌더링.
   - **MessageList 컴포넌트 (`MessageList.js`)**: 대화 내용을 보여주는 부분.
   - **MessageInput 컴포넌트 (`MessageInput.js`)**: 메시지 입력 필드 및 전송 버튼.

### 추가 고려사항

- **상태 관리**: Redux나 Context API를 사용하여 앱의 상태 관리.
- **API 통신**: axios나 fetch를 사용하여 백엔드와의 통신 관리.
- **보안**: 로그인 시 보안을 고려한 인증 방식 구현.
- **반응형 디자인**: TailwindCSS를 활용하여 다양한 디바이스에서 호환 가능하도록 디자인.

이 구조는 기본적인 가이드라인을 제공하며, 프로젝트의 특정 요구사항에 따라 조정이 필요할 수 있습니다.
