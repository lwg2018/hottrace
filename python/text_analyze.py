import sys
import csv
import appenv

csv.field_size_limit(sys.maxsize)

class City:
    def setData(self, name, dStart, dEnd, dInterval, pStart, pEnd, pInterval):
        self.name = name
        self.dStart = dStart
        self.dEnd = dEnd
        self.dInterval = dInterval
        self.pStart = pStart
        self.pEnd = pEnd
        self.pInterval = pInterval

    def __init__(self, name, dStart, dEnd, dInterval, pStart, pEnd, pInterval):
        self.setData(name, dStart, dEnd, dInterval, pStart, pEnd, pInterval)

class Place:

    def setData(self, donut, pie, text):
        self.donut = donut
        self.pie = pie
        self.text = text

    def __init__(self, donut, pie, text):
        self.setData(donut, pie, text)

city = []
text = {}
score = {}

city_london = City('London', 1, 25, 1, 1, 25, 15) # donut 범위, donut 단위, pie범위, pie 단위
city_berlin = City('Berlin', 1, 41, 1, 1, 25, 15)
city_manchester = City('Manchester', 1, 41, 1, 1, 25, 15)
city_paris = City('Paris', 1, 41, 1, 1, 25, 15)
city_rome = City('Rome', 1, 41, 1, 1, 25, 15)
city_saint_petersburg = City('Saint_petersburg', 1, 41, 1, 1, 25, 15)
city_madrid = City('Madrid', 1, 41, 1, 1, 25, 15)
city_moscow = City('Moscow', 1, 41, 1, 1, 25, 15)
city_ankara = City('Ankara', 1, 41, 1, 1, 25, 15)

city = [city_london, city_berlin, city_manchester, city_paris, city_rome, city_saint_petersburg, city_madrid, city_moscow, city_ankara]

for i in range(0, len(city)):
    for m in range(city[i].dStart, city[i].dEnd):
        mTemp = m * city[i].dInterval
        for n in range(city[i].pStart, city[i].pEnd):
            nTemp = n * city[i].pInterval
            key = str(mTemp) + '/' + str(nTemp)
            text[key] = ''
            score[key] = (0, 0)

def textAppend(city):               # 각 장소마다의 Text를 이어붙이는 작업
    f = open('csv/'+ city.name + '.csv', 'r', encoding="ISO-8859-1")        # Input : CSV 파일
    lines = csv.reader(f)
    next(lines, None)

    for line in lines:
        if(line[14] == ''):
            place = Place(line[10], line[11], line[5])
            text[str(place.donut) + '/' + str(place.pie)] += (place.text + ' ')

pFile = open("wordset/positive.txt", "r")
posWord = pFile.read()
pWord = posWord.split('\n')

nFile = open("wordset/negative.txt", "r")
negWord = nFile.read()
nWord = negWord.split('\n')

pFile.close()
nFile.close()

def posAnalysis(text):
    num = 0
    temp = text.split()
    for tmp in temp:
        for wrd in pWord:
            if tmp.lower() == wrd:
                num += 1
    return num

def negAnalysis(text):
    num = 0
    temp = text.split()
    for tmp in temp:
        for wrd in nWord:
            if tmp.lower() == wrd:
                num += 1
    return num

def analysisResult(key):
    pos = posAnalysis(text[key])
    neg = negAnalysis(text[key])
    estr = ''
    if pos + neg != 0:
        eval = pos / (pos + neg)
        if eval > 0.9:
            estr = '매우 긍정적'
        elif eval > 0.8:
            estr = '약간 긍정적'
        elif eval > 0.65:
            estr = '보통'
        elif eval > 0.55:
            estr = '약간 부정적'
        else:
            estr = '매우 부정적'
    else :
        estr = '평가 없음'

    score[key] = (pos, neg, estr)
    return score[key]

import pymssql as pm

conn = pm.connect(server=MSSQL_SERVER, user=MSSQL_USER, password=MSSQL_PW, database=MSSQL_DB_NAME, port=MSSQL_PORT)
curs = conn.cursor()

def save(city):
    temp = []
    for i in range(city.dStart, city.dEnd):
        itemp = i * city.dInterval
        for j in range(city.pStart, city.pEnd):
            jtemp = j * city.pInterval
            key = str(itemp) + '/' + str(jtemp)
            if text[key] != '':
                print(text[key])
                result = analysisResult(key)
                curs.execute("update hottrace.dbo.htCircle set pos=" + str(result[0]) + ", neg=" + str(result[1]) + ", evaluation='" + result[2] + "' where city='" + city.name + "' and donut=" + str(itemp) + " and pie=" + str(jtemp))
                conn.commit()

textAppend(city[7])
save(city[7])
curs.close()
conn.close()


