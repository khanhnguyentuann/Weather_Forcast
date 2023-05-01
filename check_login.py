from flask import Flask, request
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Kết nối đến cơ sở dữ liệu
db_connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="weather_forcast"
)

# Xử lý yêu cầu đăng nhập
@app.route('/check-login', methods=['POST'])
def check_login():
    # Lấy thông tin đăng nhập từ yêu cầu POST
    username = request.form['username']
    password = request.form['password']

    # Kiểm tra thông tin đăng nhập với cơ sở dữ liệu
    cursor = db_connection.cursor()
    query = "SELECT * FROM users WHERE username = %s AND password = %s"
    cursor.execute(query, (username, password))
    result = cursor.fetchone()

    # Nếu thông tin đăng nhập đúng, trả về 'success'
    if result:
        return 'success'
    else:
        return 'failure'


if __name__ == '__main__':
    app.run(debug=True)
