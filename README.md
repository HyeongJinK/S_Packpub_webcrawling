# Packpub 사이트 Ebook 웹크롤링 #

## 주절주절 ##

너무 빠르게 호출하면 디도스 공격으로 의심되어 차단당함...

## TODO ##

* 저장된 데이터 위키 문법으로 파싱
* 
* 구글 번역 API 적용
* 저장된 DB 사용하는 사이트 만들기

## 파일 설명 ##

* isbn : isbn 목록 가져와서 파일로 저장
* isbnRead : 저장된 파일에서 정보 가져와 isbn 배열로 만들기
* menu : isbn으로 책정보 호출해 메뉴 정보 가져오기
* content : 메뉴 정보로 각각의 메뉴를 호출해 내용가져로기
* namereplaceTest : 파일명을 쓸 수 없는 특수문자 변환
* app : 위 파일 합체
* file_list : 특정 폴더 파일 목록 가져오기
* image : 책 이미지 가져오기
* date : 책 출시일, 카테고리명, 설명 가져오기
* content_imageLink_replace : 내용에 있는 이미지 링크주소 변경

## CSS ##

* <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
* <link href="https://fonts.googleapis.com/css?family=Montserrat:500,400|Lato:300,400,500" rel="stylesheet" type="text/css" />
* <link href="https://d3ginfw2u4xn7p.cloudfront.net/fef9eb5/app.eecc9b6106c78f582007d7c0ef20b462.bundle.css" rel="stylesheet"></head>
