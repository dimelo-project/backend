# Dimelo
IT강의 수강평공유 & 팀빌딩 커뮤니티

https://dimelo.io

<img width="1426" alt="dimelo_main" src="https://user-images.githubusercontent.com/77389332/154913094-9108bd5d-6f93-4eaf-aef0-495b564a5273.png">

## :pushpin:  프로젝트 소개

- 강의리뷰

진실한 후기를 공유하고 가장 점수를 많이 받은 강의와 강사에 대한 점수도 한눈에 볼 수 있는 사이트

강의 사이트에 있는 강의 소개의 과대광고에 돈을 낭비한 경험은 다들 갖고 있을 것입니다. 강의 사이트에서 수강 평을 솔직하게 쓰고 싶은데 강사에게 직접적으로 노출되기 때문에 눈치 보며 적은 경험도 있을 것입니다. 끊임없이 공부해야 하는 IT분야에서 넘쳐나는 강의 중 어떤 것을 들어야 할지, 어떤 것부터 들어야 할지, 수강평이 없는 강의는 믿고 들어도 될지, 수강평이 있는 강의들은 얼마나 믿을 만 한지, 이러한 고민을 바탕으로 강의 리뷰 사이트를 기획하게 되었습니다. 

- 커뮤니티

개발자, 기획자, 디자이너 모두를 위한 커뮤니티

현재 IT 팀빌딩 커뮤니티들은 개발자를 위한 곳이 많습니다. 프로젝트를 하고 싶은데 디자이너나 기획자들은 구하기 어려웠던 경험이 있을 것입니다. 우리는 어떻게 하면 개발자, 기획자, 디자이너 모두를 사이트에 모아서 그들이 의견과 경험을 공유하고 팀까지 형성할 수 있을까 고민했습니다. 우리 사이트에서 강의리뷰를 쓰고 최종적으로 함께 프로젝트를 만들어 볼 수 있도록 기획하였습니다. 자유주제 탭에서는 공부하는 데 있어 막막한 부분을 공유할 수 있도록 하였고 스터디, 프로젝트 탭에서는 원하는 포지션, 기술 별로 빠르게 탐색할 수 있도록 하였습니다.

<br />

## :pushpin: 프로젝트 기간

- 2021.12.13 - 2021.12.31 [기획](https://www.figma.com/file/LzEG1SYKLT9CKVdwtdNhTV/%EA%B0%9C%EB%B0%9C_IT%EA%B0%95%EC%9D%98?node-id=0%3A1), [와이어 프래임](https://www.figma.com/file/UqrEJHhZ7OH0ipZIyCE30x/team-IT?node-id=0%3A1)
- 2022.01.01 - 2022.3.12 [디자인](https://www.figma.com/file/57iRVlIyFji7CYxm9OA59b/Dimelo_design?node-id=0%3A1), 개발
<br />

## :pushpin: 팀 구성

- Frontend : 전상혁
- Backend : 피수연
- Designer : 김지원, 신지은

<br />

## :pushpin: 협업 툴

- 게더
- 피그마
- [깃헙 프로젝트](https://github.com/orgs/dimelo-project/projects/2)

<br />

## :pushpin: 백엔드 기술 스택
| Name | Tech |
| --- | --- |
| Runtime | Node.js |
| Framework | Nest.js |
| Language | TypeScript |
| Database | MySQL |
| Storage | AWS S3, AWS RDS  |
| Server | AWS EC2, Docker |
| CI/CD | TravisCI, CodeDeploy|

<br />


## :pushpin: 페이지 별 기능

- 메인 페이지
- 로그인, 회원가입 페이지
    - 일반회원, 구글, 깃헙 로그인 (passport)
    - 회원 가입 정책 (아이디: 이메일 형식, 비밀번호: 영문 숫자 포함 8자 이상)
    - session기반 로그인 (httpOnly cookie)
    - 비밀번호 찾기 (nodemailer)
- 프로필 생성 페이지
    - 프로필사진, 닉네임, 직무, 경력 설정
- 강의 페이지
    - 카테고리 내 강의 별점 순, 리뷰 순으로 보기
    - 카테고리 내 강의 검색
    - 카테고리 외 강의 검색
    - 강의 북마크(관심강의) 하기
    - 해당 강의 리뷰 작성하기, 강의등록 신청하고 리뷰 작성하기
- 강의 리뷰 페이지
    - 해당 강의 항목별 평점 보기
    - 리뷰 추천순, 최신순, 별점순으로 보기
    - 해당 리뷰에 도움됨 누르기
- 강사 페이지
    - 해당 강사의 총 평점 보기
    - 해당 강사의 모든 강의 보기
    - 해당 강사의 리뷰 추천순, 최신순, 별점순으로 보기
    - 해당 리뷰에 도움됨 누르기
- 자유주제 페이지
    - 카테고리 개발, 데이터, 디자인, 기타 별로 글 보기
    - 글 작성, 수정, 삭제하기
    - 댓글 작성, 수정, 삭제 하기
- 스터디, 프로젝트 페이지
    - 기술별, 모집중/모집완료 필터링
    - 스터디 모집 글작성, 수정, 삭제하기
    - 댓글 작성, 수정, 삭제 하기
- 마이페이지
    - 프로필 수정, 비밀번호 변경, 회원탈퇴
    - 내가 작성한 리뷰, 게시글, 댓글 보기
    - 관심강의 보기

<br />

## :pushpin: Architecture

<img width="1106" alt="architecture" src="https://user-images.githubusercontent.com/77389332/157710407-6ac1e5e7-a788-4151-8b4f-ceb32ff894c9.png">

<br />

## :pushpin: DB ERD
<img width="823" alt="dimelo_erd" src="https://user-images.githubusercontent.com/77389332/154974009-2c57af96-6297-47d2-8489-8897661813d5.png">

<br />

## :pushpin: API
https://api.dimelo.io/api

<br />

## :pushpin: Trouble Shooting
- [nodemailer smtp 메일 google 에서 못받는 문제](https://velog.io/@suyeonpi/Dimelo-Project-nodemailer-smtp-%EB%A9%94%EC%9D%BC-google-%EC%97%90%EC%84%9C-%EB%AA%BB%EB%B0%9B%EB%8A%94-%EB%AC%B8%EC%A0%9C)
- [passport-github scope email이 없을 경우](https://velog.io/@suyeonpi/Dimelo-Project-github-email%EC%9D%B4-%EC%97%86%EC%9D%84-%EA%B2%BD%EC%9A%B0)
- [soft delete한 유저의 게시글을 받아올 수 없는 문제](https://velog.io/@suyeonpi/Dimelo-Project-soft-delete%ED%95%9C-%EC%9C%A0%EC%A0%80%EC%9D%98-%EA%B2%8C%EC%8B%9C%EA%B8%80%EC%9D%84-%EB%B0%9B%EC%95%84%EC%98%AC-%EC%88%98-%EC%97%86%EB%8A%94-%EB%AC%B8%EC%A0%9C)
- [배포 후 쿠키가 안오는 문제](https://velog.io/@suyeonpi/Dimelo-Project-%EB%B0%B0%ED%8F%AC-%ED%9B%84-%EC%BF%A0%ED%82%A4%EA%B0%80-%EC%95%88%EC%98%A4%EB%8A%94-%EB%AC%B8%EC%A0%9C)
- [pm2 cluster mode는 session 공유 안되는 문제](https://velog.io/@suyeonpi/Dimelo-Project-pm2-cluster-%EA%B0%84%EC%9D%98-session-%EA%B3%B5%EC%9C%A0-%EC%95%88%EB%90%98%EB%8A%94-%EB%AC%B8%EC%A0%9C)
<br />

## :pushpin: 회고록
[프로젝트 회고록](https://velog.io/@suyeonpi/Dimelo-Project-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%ED%9A%8C%EA%B3%A0%EB%A1%9D-tntm88al)

<br />
