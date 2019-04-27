import folium
import warnings
warnings.simplefilter(action = "ignore", category = FutureWarning)
import pandas as pd
import math
from collections import Counter
import sqlite3
import re

from sklearn.datasets import make_blobs
from sklearn.cluster import DBSCAN
from sklearn import metrics
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import make_moons
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler
import numpy as np
from matplotlib import rc

con = sqlite3.connect(r"Seoul.db") # DB 연결
# user_id_str 및 cdate로 정렬이 되어 있는 상태의 DB
cur = con.cursor()

df = pd.read_sql_query("select lat,lon from seoul limit 10000", con)

#######################

# Generate sample data
#centers = [[1, 1], [-1, -1], [1, -1]]
# X, labels_true = make_blobs(n_samples=750, centers=centers, cluster_std=0.4,
#                             random_state=0)

X = np.zeros((10000, 2))
for i in range(0, 10000):
    X[i][0] = df.get("lat")[i]
    X[i][1] = df.get("lon")[i]
print(X)
X = StandardScaler().fit_transform(X)

# #############################################################################
# # Compute DBSCAN
# db = DBSCAN(eps=0.3, min_samples=10000).fit(X)
# core_samples_mask = np.zeros_like(db.labels_, dtype=bool)
# core_samples_mask[db.core_sample_indices_] = True
# labels = db.labels_
#
# # Number of clusters in labels, ignoring noise if present.
# n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)
# n_noise_ = list(labels).count(-1)
#
# # Plot result
# import matplotlib.pyplot as plt
#
# # Black removed and is used for noise instead.
# unique_labels = set(labels)
# colors = [plt.cm.Spectral(each)
#           for each in np.linspace(0, 1, len(unique_labels))]
# for k, col in zip(unique_labels, colors):
#     if k == -1:
#         # Black used for noise.
#         col = [0, 0, 0, 1]
#
#     class_member_mask = (labels == k)
#
#     xy = X[class_member_mask & core_samples_mask]
#     plt.plot(xy[:, 0], xy[:, 1], 'o', markerfacecolor=tuple(col),
#              markeredgecolor='k', markersize=14)
#
#     xy = X[class_member_mask & ~core_samples_mask]
#     plt.plot(xy[:, 0], xy[:, 1], 'o', markerfacecolor=tuple(col),
#              markeredgecolor='k', markersize=6)
#
# plt.title('Estimated number of clusters: %d' % n_clusters_)
# plt.show()

# dataset
# x = [[125, 126], [125, 200]]
# print(x)
#
# # MinMaxScaler 메소드로 전처리
# scaler_MMS = MinMaxScaler().fit(x)
# x_scaled_MMS = scaler_MMS.transform(x) # 전처리 메소드를 훈련데이터에 적용
# dbscan = DBSCAN(eps=0.3, min_samples=6) # 모델생성
# clusters_MMS = dbscan.fit_predict(x_scaled_MMS) # 모델 학습
# print('np.unique(clusters_MMS)\n예측한 레이블: {}'.format(np.unique(clusters_MMS))) # [0]
#
# ### 예측한 레이블이 0으로 전부 하나의 클러스터로 표현
# ### MinMaxScaler전처리가 적합하지 않음
#
# scaler_ss = StandardScaler().fit(x)
# x_scaled_ss = scaler_ss.transform(x)
# dbscan = DBSCAN()
# clusters_ss = dbscan.fit_predict(x_scaled_ss)
# print('np.unique(clusters_ss)\n예측한 레이블:{}'.format(np.unique(clusters_ss))) # [0 ,1]
#
# ### 2차원 데이터셋을 0과 1로 구분했기 때문에 전처리가 잘되었음을 확인
#
# # visualization
#
# df = np.hstack([x_scaled_ss, clusters_ss.reshape(-1, 1)]) # x_scaled_ss 오른쪽에 1열 붙이기
# df_ft0 = df[df[:,2]==0, :] # 클러스터 0 추출
# df_ft1 = df[df[:,2]==1, :] # 클러스터 1 추출
#
# # matplotlib로 그래프 그리기
# plt.scatter(df_ft0[:, 0], df_ft0[:, 1], label='cluster 0', cmap='Pairs') # x, y, label, 색상
# plt.scatter(df_ft1[:, 0], df_ft1[:, 1], label='cluster 1', cmap='Pairs')
# plt.xlabel('feature 0')
# plt.ylabel('feature 1')
# plt.legend()
# plt.show()
#######################




df = pd.read_sql_query("select * from seoul order by user_id_str ASC, cdate ASC limit 500000", con)
print(df)

# import csv
# from operator import itemgetter
# reader = csv.reader(open("Seoul.csv"), delimiter=",")
# sortedList = sorted(reader, key=itemgetter(22), reverse=True)
# print(sortedList)

# 엑셀에서의 MROUND함수를 정의
# 그리드 만들기
def mround(num,mul):
    return round(num/mul,0)*mul #
Grid = input("몇 m 그리드를 만드실 건가요?") #10000
mul = int(Grid)/100000 #0.1

g_lat = [] # 그리드의 위도
g_lon = [] # 그리드의 경도
# 실제 링크를 만드는 데에는 cell의 값을 사용하지만 이 부분에서 파일을 추출해 분석을 진행할 때도 있어 남겨둠
cell = []
for gm in df.index:
    m_lat = mround(df['lat'][gm],mul)
    m_lon = mround(df['lon'][gm],mul)
    g_lat.append(m_lat)
    g_lon.append(m_lon)
    cell.append(str(m_lat) + "/" + str(m_lon)) #그리드의 이름

df = df.assign(G_lat = g_lat, G_lon = g_lon, Cell = cell)
print(df)

link = [] # 경로의 이름
for n in df.index:
    try:
        if df['user_id_str'][n]==df['user_id_str'][n+1]:
            link.append(str(df['Cell'][n])+"//"+str(df['Cell'][n+1]))
        else:
            pass
    except KeyError:
        break

link_list = Counter(link) # 경로의 weight값 계산(각 경로가 몇번이나 등장하는지)
l_list = list(link_list)
weight = []
for l in l_list:
    weight.append(link_list[l])

source = []
target = []
for i in l_list:
    source.append(re.split("//",i)[0])
    target.append(re.split("//",i)[1])

data = {'Source':source,'Target':target, 'Weight':weight}
df2 = pd.DataFrame(data)
print(df2)

df3 = df2.sort_values('Weight',ascending=False) # 경로를 Weight 값에 따라 정렬
df3 = df3.reset_index()
df3 = df3.drop('index', 1)

s_lat = [] # 출발지의 위도
s_lon = [] # 출발지의 경도
t_lat = [] # 도착지의 위도
t_lon = [] # 도착지의 경도
for i in df3.index:
    s_lat.append(re.split("/",df3['Source'][i])[0])
    s_lon.append(re.split("/",df3['Source'][i])[1])
    t_lat.append(re.split("/",df3['Target'][i])[0])
    t_lon.append(re.split("/",df3['Target'][i])[1])

df3 = df3.assign(s_lat = s_lat, s_lon = s_lon, t_lat = t_lat, t_lon = t_lon)
print(df3)

map = folium.Map(location=[37.619, 127.058], zoom_start=16)

s_points = []
t_points = []
for n in df3.index:
    s_points.append([float(df3['s_lat'][n]), float(df3['s_lon'][n])])
    t_points.append([float(df3['t_lat'][n]), float(df3['t_lon'][n])])

for n in df3.index:
    line = []
    line.append([s_points[n], t_points[n]])
    folium.PolyLine(line, weight=float(df3['Weight'][n] / 500), opacity=1, radius=5).add_to(map)

map.save(r"./test.html")