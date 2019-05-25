세계 도시 핫 플레이스 앱
최종 수정일 : 2019.05.25

-------------- 시작하기 전 --------------
node.js를 기반으로 합니다.
지도 및 데이터 표시는 mapbox API를 사용합니다.

1) mssql에 hottrace 데이터베이스를 생성해주세요.
2) ./hottrace.sql 파일을 실행해주세요.
3) ./python 폴더의 appenv.py에 자신의 환경에 맞는 값을 넣어주세요.
4) ./.env파일에 자신의 환경에 맞는 값을 넣어주세요.
시작 - 8번째 줄까지 mssql의 환경이며 10 - 마지막 줄까지는 mongodb의 환경입니다. (몽고DB는 채팅 데이터 저장시 사용)
5) ./view 밑의 각 도시 파일(London, paris, manchester)의 accessToken과 mapbox 데이터명을 바꿔주세요.
mapbox 데이터명은 mssql의 htCircle 테이블 데이터를 csv로 뽑은 뒤 mapbox의 지도 데이터에 삽입하여야 합니다.
그 뒤, 그 지도 데이터를 map.addLayer의 'source-layer' 키의 value값으로 넣어주세요.(기존 값은 "city명_circle")
6) ./public/b.html의 async defer src 속성에 구글 맵 key를 넣어주세요.

-------------- 도시 추가법 --------------
csv 파일을 사용합니다.
트위터 데이터 기반(위치 정보 포함되어있어야 함) 앱입니다.
트위터 데이터는 user별 정렬 후 시간 순으로 정렬되어있어야 합니다(ex: ./python/city_twitdata).
donut(도시 중심 기준 거리), pie(도시 정북방향 기준 각도/15도씩 분리), dart(donut/pie 형식으로 합친 것 ex:5/360) 열 속성을 가지고 있어야 합니다.
필요한 속성은 lat(위도), lon(경도), user_id_str, user_lang, donut, pie, dart, time 입니다.
이 csv 파일을 citydata_cal.py를 실행하여 가공해야 합니다. -> 가공한 데이터가 최종적으로 mssql에 저장됩니다.

텍스트 분석을 할 때에는 user_lang과 그 도시가 사용하는 언어를 알아야 합니다.
텍스트 분석 시 영어를 기반으로 합니다.
./python/wordset의 단어들을 사용하며 text_analyze.py를 실행합니다.

머신러닝을 사용하려면 리뷰 게시판에 리뷰글이 충분해야 합니다(learning.py 파일 사용).
예제모델: ./python/city_model

view 폴더 밑에 도시명.ejs 파일로 추가해주세요. 기존 도시들(London, paris, manchester)의 코드를 그대로 복사한 뒤, access token과 mapbox 데이터 url을 바꿔주세요.
-------------------------------------------

1. 필요한 파이썬 모듈
1) pandas
2) pymssql
3) re
4) Counter
5) sys
6) numpy
7) tensorflow

-------------- 시작 --------------
1) app.js가 있는 위치에서 콘솔창을 열고 npm start 명령어를 입력.
2) mongoDB를 실행할 수 있는 위치에서 콘솔창을 열고 mongod 명령어로 실행.
3) 웹페이지에서 환경설정의 url로 시작.
