import tensorflow as tf
import numpy as np
import sys
import appenv
import pymssql as pm

if sys.argv.__len__() < 6:
    print("실행 인자가 부족합니다(1: 도시명 / 2: 인원수 / 3: 평균나이 / 4: 보유금액 / 5: 체류시간).")
    exit(1);

# input(노드 5) -> hidden 1(노드 10) -> hidden 2(노드 10) -> output(노드 2: donut, pie)
# 활성함수 : ReLu
# 비용함수 : 최소제곱
# 경사하강법 : Adam
# 과적합방지 : Dropout

# Dropout
keep_prob = tf.placeholder(tf.float32)

########### Input Layer ###########
x = tf.placeholder(tf.float32, [None, 4])
y = tf.placeholder(tf.float32, [None, 2])

########### Hidden Layer1 ###########
# weight
w1 = tf.Variable(tf.random_normal([4, 10]))
# bias
b1 = tf.Variable(tf.random_normal([10]))
# result
h1 = tf.nn.relu(tf.matmul(x, w1) + b1)
h1 = tf.nn.dropout(h1, keep_prob=keep_prob)

########### Hidden Layer2 ###########
# weight
w2 = tf.Variable(tf.random_normal([10, 10]))
# bias
b2 = tf.Variable(tf.random_normal([10]))
# result
h2 = tf.nn.relu(tf.matmul(h1, w2) + b2)
h2 = tf.nn.dropout(h2, keep_prob=keep_prob)

########### Hidden Layer3 ###########
# weight
w3 = tf.Variable(tf.random_normal([10, 6]))
# bias
b3 = tf.Variable(tf.random_normal([6]))
# result
h3 = tf.nn.relu(tf.matmul(h2, w3) + b3)
h3 = tf.nn.dropout(h3, keep_prob=keep_prob)

########### Output Layer ###########
# weight
wout = tf.Variable(tf.random_normal([6, 2]))
# bias
b4 = tf.Variable(tf.random_normal([2]))
# result
_y = tf.nn.relu(tf.matmul(h3, wout)) + b4 # 어케바꿔야할까???
#_y = tf.nn.dropout(_y, keep_prob=keep_prob) 이걸 적용시키면 학습이잘 안됨.

# cost/loss function
cost = tf.reduce_mean(tf.square(y - _y))
train = tf.train.AdamOptimizer(0.05).minimize(cost)

# 모델 실행 및 저장
saver = tf.train.Saver()
sess = tf.Session()

# 만약 저장된 모델과 파라미터가 있으면 이를 불러오고 (Restore)
# Restored 모델을 이용해서 테스트 데이터에 대한 정확도를 출력하고 프로그램을 종료합니다.
city_path = appenv.MODELS_PATH + sys.argv[1]
ckpt = tf.train.get_checkpoint_state(city_path)
if ckpt and tf.train.checkpoint_exists(ckpt.model_checkpoint_path):
    saver.restore(sess, ckpt.model_checkpoint_path)
    r = sess.run(_y, feed_dict={x: [[float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])]], keep_prob: 1})
    print(int(round(r[0][0])))
    print(int(round(r[0][1]/15.0)*15))
else: # 저장된 모델이 없다면 session을 초기화하고 학습을 시작합니다.
    conn = pm.connect(server=appenv.MSSQL_SERVER, user=appenv.MSSQL_USER, password=appenv.MSSQL_PW,
                      database=appenv.MSSQL_DB_NAME, port=appenv.MSSQL_PORT)
    curs = conn.cursor()
    curs.execute("select board_donut, board_pie, board_people, board_age, board_money, board_time from hottrace.dbo.htBoard")
    #curs.execute("select * from hottrace.dbo.htCircle")
    rows = curs.fetchall()
    np_rows = np.matrix(rows) # DB에서 얻어온 rows를 numpy의 matrix형태로 변환
    curs.close()
    conn.close()

    #print(np_rows[:, 1].shape)
    # t(time)
    # a(age)
    # p(people)
    # m(money)

    donut = np_rows[:, 0]
    pie = np_rows[:, 1]
    people = np_rows[:, 2]
    age = np_rows[:, 3]
    money = np_rows[:, 4]
    time = np_rows[:, 5]

    x_data = np.hstack((people, age, money, time))
    y_data = np.hstack((donut, pie))
    # print(x_data)
    # print(y_data)

    sess.run(tf.global_variables_initializer())
    for step in range(30000):
        cost_val, _ = sess.run([cost, train], feed_dict={x: x_data, y: y_data, keep_prob: 0.7})
        if step % 100 == 0:
            print("cost: ", cost_val)
    saver.save(sess, city_path + '/' + sys.argv[1] + '_Model.ckpt', global_step=25000)
    r = sess.run(_y, feed_dict={x: [[1, 24, 200000, 10]], keep_prob: 1})
    print(r[0][0])
    print(r[0][1])
