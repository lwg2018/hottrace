import warnings
warnings.simplefilter(action = "ignore", category = FutureWarning)
import pandas as pd
import pymssql as pm
from collections import Counter
import re
import appenv


conn = pm.connect(server=appenv.MSSQL_SERVER, user=appenv.MSSQL_USER, password=appenv.MSSQL_PW, database=appenv.MSSQL_DB_NAME, port=appenv.MSSQL_PORT)
curs = conn.cursor()

f = open("circles.txt", 'w')

curs.execute("select c_lat, c_lon, weight from hottrace.dbo.htCircle order by weight desc")
row = curs.fetchone()
while row:
    data = "%s %s %s\n" % (row[0], row[1], row[2])
    f.write(data)
    row = curs.fetchone()

f.close()
curs.close()
conn.close()