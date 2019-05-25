import warnings
warnings.simplefilter(action = "ignore", category = FutureWarning)
import pandas as pd
import pymssql as pm
from collections import Counter
import re
import appenv
import sys

from math import cos, asin, sqrt, isnan

def cal_Distance(lat1, lon1, lat2, lon2):
    p = 0.017453292519943295     #Pi/180
    a = 0.5 - cos((lat2 - lat1) * p)/2 + cos(lat1 * p) * cos(lat2 * p) * (1 - cos((lon2 - lon1) * p)) / 2
    return 12742 * asin(sqrt(a)) #2*R*asin...

if sys.argv.__len__() < 4:
    print("실행 인자가 부족합니다(1: csv파일명 / 2: 도시명 / 3: 사용 언어).")
    exit(1);

conn = pm.connect(server=appenv.MSSQL_SERVER, user=appenv.MSSQL_USER, password=appenv.MSSQL_PW, database=appenv.MSSQL_DB_NAME, port=appenv.MSSQL_PORT)
curs = conn.cursor()

#csv 파일 읽기
df = pd.read_csv(sys.argv[1], encoding="ISO-8859-1")
#df = pd.read_csv(sys.argv[1], names=['lat', 'lon', 'user_id_str', 'user_lang', 'donut', 'pie', 'dart', 'time'], encoding="ISO-8859-1")

def data_cal(rows, day_or_night, nationality):
    ### Link ###
    link = []
    source = []
    target = []
    weight = []
    s_lat = []  # 출발지의 위도
    s_lon = []  # 출발지의 경도
    t_lat = []  # 도착지의 위도
    t_lon = []  # 도착지의 경도
    city = sys.argv[2]
    distance = []

    ###CLink###
    cl_link = []
    cl_source = []
    cl_target = []
    cl_weight = []
    s_donut = []  # 출발지의 거리
    s_pie = []  # 출발지의 각도
    t_donut = []  # 도착지의 거리
    t_pie = []  # 도착지의 각도
    cl_distance = []  # 중점간의 거리

    ### Circle ###
    dart = []
    dart_lon = {}  # map
    dart_lat = {}  # map
    donut = []
    pie = []
    c_weight = []
    c_lon = []
    c_lat = []

    row_len = len(rows)
    print(day_or_night, nationality, "행길이: ", row_len)
    for i in range(0, row_len - 1):  # 같은 유저가 트윗시 출발, 도착으로 묶음
        if rows[i]['user_id_str'] == rows[i + 1]['user_id_str']:
            s = str(rows[i]['lat']) + "/" + str(rows[i]['lon'])  # 트윗끼리 링크
            t = str(rows[i + 1]['lat']) + "/" + str(rows[i + 1]['lon'])
            link.append(s + "_" + t)

            cl_link.append(rows[i]['dart'] + "_" + rows[i + 1]['dart'])  # Circle끼리 링크

        if i % 10000 == 0:
            print("링크 생성중... ", i / (row_len - 1))

    for i in range(0, row_len):
        dart.append(rows[i]['dart'])  # 다트 추가
        if dart_lon.get(rows[i]['dart'], 'null') == 'null':  # 배열에 이 위치가 없다면 추가
            dart_lon[rows[i]['dart']] = rows[i]['lon']
        else:
            dart_lon[rows[i]['dart']] = dart_lon[rows[i]['dart']] + rows[i]['lon']  # 있다면 위도 경도 + (중심점 위해)
        if dart_lat.get(rows[i]['dart'], 'null') == 'null':
            dart_lat[rows[i]['dart']] = rows[i]['lat']
        else:
            dart_lat[rows[i]['dart']] = dart_lat[rows[i]['dart']] + rows[i]['lat']

        if i % 10000 == 0:
            print("원 생성중... ", i / row_len)

    link_count = Counter(link)  # 같은 값들의 개수를 세어줌(값:개수)
    link_list = list(link_count)  # 값(키)만 뽑아 리스트로 만들어줌
    leng = link_list.__len__()

    for i in link_list:
        weight.append(link_count[i])
        source.append(re.split("_", i)[0])
        target.append(re.split("_", i)[1])

    for i in range(0, leng):
        s_lat.append(re.split("/", source[i])[0])
        s_lon.append(re.split("/", source[i])[1])
        t_lat.append(re.split("/", target[i])[0])
        t_lon.append(re.split("/", target[i])[1])
        distance.append(cal_Distance(float(s_lat[i]), float(s_lon[i]), float(t_lat[i]), float(t_lon[i])))

    dart_count = Counter(dart)
    dart_list = list(dart_count)
    c_leng = dart_list.__len__()

    for i in dart_list:
        c_weight.append(dart_count[i])
        c_lon.append(dart_lon[i] / dart_count[i])
        c_lat.append(dart_lat[i] / dart_count[i])
        donut.append(re.split("/", i)[0])
        pie.append(re.split("/", i)[1])

    link_count = Counter(cl_link)  # 같은 값들의 개수를 세어줌(값:개수)
    link_list = list(link_count)  # 값(키)만 뽑아 리스트로 만들어줌
    cl_leng = link_list.__len__()

    for i in link_list:
        cl_weight.append(link_count[i])
        temp_source = re.split("_", i)[0]
        temp_target = re.split("_", i)[1]
        cl_source.append(temp_source)
        cl_target.append(temp_target)
        cl_distance.append(cal_Distance(float(dart_lat[temp_source] / dart_count[temp_source]),
                                        float(dart_lon[temp_source] / dart_count[temp_source]),
                                        float(dart_lat[temp_target] / dart_count[temp_target]),
                                        float(dart_lon[temp_target] / dart_count[temp_target])))

    for i in range(0, cl_leng):
        s_donut.append(re.split("/", cl_source[i])[0])
        s_pie.append(re.split("/", cl_source[i])[1])
        t_donut.append(re.split("/", cl_target[i])[0])
        t_pie.append(re.split("/", cl_target[i])[1])

    tuples = []
    c_tuples = []
    cl_tuples = []
    for n in range(0, leng):
        tuples.append((source[n], target[n], weight[n], s_lat[n], t_lat[n], s_lon[n], t_lon[n], city, distance[n], nationality, day_or_night))
    for n in range(0, c_leng):
        c_tuples.append((city, donut[n], pie[n], c_weight[n], c_lon[n], c_lat[n], nationality, day_or_night))
    for n in range(0, cl_leng):
        cl_tuples.append((cl_source[n], cl_target[n], cl_weight[n], s_donut[n], s_pie[n], t_donut[n], t_pie[n], city,
                          cl_distance[n], nationality, day_or_night))

    curs.executemany(
        "insert into hottrace.dbo.htLink(source, target, weight, s_lat, t_lat, s_lon, t_lon, city, distance, nationality, day_or_night) values (%s, %s, %d, %s, %s, %s, %s, %s, %s, %s, %s)",
        tuples)
    print("Link 저장 완료")
    curs.executemany(
        "insert into hottrace.dbo.htCircle(city, donut, pie, weight, c_lon, c_lat, nationality, day_or_night) values (%s, %d, %d, %d, %s, %s, %s, %s)",
        c_tuples)
    print("Circle 저장 완료")
    curs.executemany(
        "insert into hottrace.dbo.htCLink(source, target, weight, s_donut, s_pie, t_donut, t_pie, city, distance, nationality, day_or_night) values (%s, %s, %d, %d, %d, %d, %d, %s, %s, %s, %s)",
        cl_tuples)
    print("CircleLink 저장 완료")

    conn.commit()

#####################################################
all_all = []
all_native = []
all_foreigner = []
day_all = []
day_native = []
day_foreigner = []
night_all = []
night_native = []
night_foreigner = []

length = len(df)
for i in range(0, length):

    all_all.append(df.loc[i])
    hour = int(re.split(":", re.split(" ", df.loc[i]['time'])[1])[0])

    if (hour >= 0 and hour < 6) or (hour >= 18 and hour < 24):
        night_all.append(df.loc[i])
    else:
        day_all.append(df.loc[i])

    if df.loc[i]['user_lang'] == sys.argv[3]:
        all_native.append(df.loc[i])
    else:
        all_foreigner.append(df.loc[i])

    if(i%10000 == 0):
        print("낮/밤, 내/외국인 분리중... ", i/length)

length1 = len(night_all)
for i in range(0, length1):
    if night_all[i]['user_lang'] == sys.argv[3]:
        night_native.append(night_all[i])
    else:
        night_foreigner.append(night_all[i])

    if(i%10000 == 0):
        print("밤, 내/외국인 분리중... ", i/length1)
        
length2 = len(day_all)
for i in range(0, length2):
    if day_all[i]['user_lang'] == sys.argv[3]:
        day_native.append(day_all[i])
    else:
        day_foreigner.append(day_all[i])

    if(i%10000 == 0):
        print("낮, 내/외국인 분리중... ", i/length2)

data_cal(all_all, "all", "all")
data_cal(all_native, "all", "native")
data_cal(all_foreigner, "all", "foreigner")
data_cal(day_all, "day", "all")
data_cal(day_native, "day", "native")
data_cal(day_foreigner, "day", "foreigner")
data_cal(night_all, "night", "all")
data_cal(night_native, "night", "native")
data_cal(night_foreigner, "night", "foreigner")
#####################################################


curs.close()
conn.close()
