from flask import Flask, request, session
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'sdfh%^&k;lwe42' # tự tạo
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
    username = request.form['username']
    password = request.form['password']

    cursor = db_connection.cursor()
    query = "SELECT * FROM users WHERE username = %s AND password = %s"
    cursor.execute(query, (username, password))
    result = cursor.fetchone()

    if result:
        session['loggedIn'] = True
        session['username'] = username
        return 'success'
    else:
        return 'failure'

# Xử lý yêu cầu đăng ký
@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']

    cursor = db_connection.cursor()
    query = "SELECT * FROM users WHERE username = %s"
    cursor.execute(query, (username,))
    result = cursor.fetchone()

    if result:
        return 'failure'

    query = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"
    cursor.execute(query, (username, email, password))
    db_connection.commit()

    session['loggedIn'] = True
    session['username'] = username

    return 'success'

# Lưu ưa thích của người dùng
@app.route('/save-favorites', methods=['POST'])
def save_favorite():
    user_id = get_user_id_from_session() # Lấy user_id từ session
    if user_id:
        weather_type = request.form['weather_type']
        region = request.form['region']

        cursor = db_connection.cursor()
        query = "INSERT INTO favorites (user_id, weather_type, region) VALUES (%s, %s, %s)"
        cursor.execute(query, (user_id, weather_type, region))
        db_connection.commit()

        return 'success'
    else:
        return 'failure'

# Lấy user_id từ session
def get_user_id_from_session():
    session_key = 'loggedIn'
    if session.get(session_key):
        cursor = db_connection.cursor()
        query = "SELECT id FROM users WHERE username = %s"
        cursor.execute(query, (session['username'],))
        result = cursor.fetchone()
        if result:
            return result[0]
    return None

if __name__ == '__main__':
    app.run(debug=True)