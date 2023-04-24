# Introduction

이 도구는 깃허브 유저의 팔로잉 목록과 팔로워 목록을 비교하여 누구를 팔로우하지 않는지를 알려줍니다. 또한, 맞팔이었다가 언팔로우한 사람을 알려줍니다.

설치하려면 Node.js와 `yarn`이 필요합니다.

다음 명령으로 설치할 수 있습니다.

```sh
brew install node
brew install yarn
```

이 저장소를 복제한 후 다음 명령으로 의존성을 설치합니다.

```sh
yarn install
```

.env.example 파일을 .env로 복사한 후, 깃허브 토큰을 입력합니다.

```sh
cp .env.example .env
```

.env 파일을 열어서 다음과 같이 수정합니다.

```diff
- GITHUB_TOKEN=-
+ GITHUB_TOKEN=<개인_액세스_토큰_입력>
- MAX_PAGE=3
+ MAX_PAGE=<최대_페이지_입력>
```

깃허브 액션과 크론잡 등을 활용하면 자동으로 실행하여 체크하거나, 추가로 언팔로우 API를 연동하여 자동으로 언팔로우할 수 있을 것입니다.

시작은 다음과 같이 할 수 있습니다.

```sh
yarn start
```
