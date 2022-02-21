# Dimelo
IT강의 수강평공유 & 팀빌딩 커뮤니티
<img width="1426" alt="dimelo_main" src="https://user-images.githubusercontent.com/77389332/154913094-9108bd5d-6f93-4eaf-aef0-495b564a5273.png">

## 1. 프로젝트 소개

- 강의리뷰

진실된 후기를 공유하고 가장 점수를 많이 받은 강의와 강사에 대한 점수도 한눈에 볼 수 있는 사이트

강의사이트에 있는 강의소개의 과대광고에 돈을 낭비한 경험은 다들 갖고 있을 것입니다. 강의 사이트에서 수강평을 진실되게 쓰고 싶은데 강사에게 직접적으로 노출되기 때문에 눈치보며 적은 경험도 있을 것입니다. 끊임없이 공부해야하는 IT분야에서 넘쳐나는 강의들 중 어떤 것을 들어야할지, 어떤 것부터 들어야 할지, 수강평이 없는 강의는 믿고 들어도 될지, 수강평이 있는 강의들은 얼마나 믿을만 한지, 이러한 고민들을 바탕으로 강의 리뷰 사이트를 기획하게 되었습니다. 

- 커뮤니티

개발자, 기획자, 디자이너 모두를 위한 커뮤니티

현재 IT 팀빌딩 커뮤니티들은 개발자를 위한 곳이 많습니다. 프로젝트를 하고 싶은데 디자이너나 기획자들은 구하기 어려웠던 경험이 있을 것입니다. 우리는 어떻게 하면 개발자, 기획자, 디자이너 모두를 사이트에 모아서 그들이 의견과 경험을 공유하고 팀까지 형성할 수 있을까 고민했습니다. 우리 사이트에서 강의리뷰를 쓰고 최종적으로 함께 프로젝트를 만들어 볼 수 있도록 기획하였습니다. 자유주제 탭에서는 공부하는 데 있어 막막한 부분을 서로 공유할 수 있도록 하였고 스터디, 프로젝트탭에서는 원하는 포지션, 기술 별로 빠르게 탐색할 수 있도록 하였습니다.

<br />

## 2. 프로젝트 기간

- 2021.12.13 - 2021.12.31 기획
- 2022.01.01 - 2022.2.23 디자인, 개발
<br />

## 3. 팀 구성

- Frontend : 전상혁
- Backend : 피수연
- Designer : 김지원, 신지은

<br />

## 4. 협업 툴

- 게더
- 피그마
- 깃헙 프로젝트

<br />

## 5. 백엔드 기술 스택
| Name | Tech |
| --- | --- |
| Runtime | Node.js |
| Framework | Nest.js |
| Language | TypeScript |
| Database | MySQL |
| Storage | AWS S3, AWS RDS  |
| Server | AWS EC2, Docker |

<br />


## 6. 페이지 별 기능

- 메인 페이지
- 로그인, 회원가입 페이지
    - 구글, 깃헙 로그인 (passport)
    - 회원 가입 정책 (아이디: 이메일 형식, 비밀번호: 영문 숫자 포함 8자 이상)
    - session기반 로그인 (httpOnly)
    - 비밀번호 찾기 (mail로 임시비밀번호 발급)
- 프로필 생성 페이지
    - 프로필사진, 닉네임, 직무, 경력, 자기소개 설정
- 강의 페이지
    - 카테고리 내 강의 별점 순, 리뷰 순으로 보기
    - 카테고리 내 강의 검색
    - 카테고리 외 강의 검색
    - 강의 북마크(관심강의) 하기
    - 해당 강의 리뷰 작성하기
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
    - 글 작성하기
- 스터디 페이지
    - 기술별, 모집중/모집완료 필터링
    - 스터디 모집 글작성하기
- 마이페이지
    - 프로필 수정, 비밀번호 변경, 회원탈퇴
    - 내가 작성한 리뷰, 게시글, 댓글 보기
    - 관심강의 보기

<br />

## 7. DB ERD
<img width="823" alt="dimelo_erd" src="https://user-images.githubusercontent.com/77389332/154974009-2c57af96-6297-47d2-8489-8897661813d5.png">


