# :yum: Packtpub 사이트 책 데이터 크롤링 #

 Packtpub Ebook을 크롤링하는 프로그램
 가입시 14일 무료로 사용할 수 있다..하하하

## :page_facing_up: 개발환경 ##

* Node.js
* 필요한 라이브러리
  * sync-request
  * fs
* 예전에 사용된 라이브러리 잔재
  * request
  * cheerio
  * pdfkit


## 주절주절 ##

* 비동기로 호출 시 속도는 빠르지만 디도스 공격으로 생각하는 지 막히는 바람에 걍 동기로 전환

## 파일 설명 ##

* isbn.js : isbn 데이터 가지고 와서 txt로 저장
* isbnRead.js : 저장된 isbn 데이터 가져와서 배열로 만들기
* menu.js : isbn 으로 호출한 책에 대한 메뉴 정보
* content.js : 메뉴에서 가져온 데이터로 URL를 만들어 한메뉴에 대한 데이터 가져오기
* namereplaceTest.js : 파일명으로 쓸 수 없는 특정 문자열 변환 시키는 코드
* app.js : 책 데이터 가져오기
* file_list.js : 해당 폴더에 파일 리스트 가져오기

## TODO ##

* 저장된 파일 위키문법으로 변환 저장
* 구글 번역 API 호출해서 번역하기
* 이미지 주소 변경하기
