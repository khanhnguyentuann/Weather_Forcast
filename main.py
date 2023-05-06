from flask import Flask, request, session
import mysql.connector
from flask_cors import CORS, cross_origin
from flask_session import Session

app = Flask(__name__)
app.secret_key = 'sdfh%^&k;lwe42'

CORS(app, origins=["http://127.0.0.1:5500"], supports_credentials=True)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = './.flask_session/'
Session(app)

db_connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="weather_forcast"
)

@app.route('/check-login', methods=['POST'])
@cross_origin()
def check_login():
    # Lấy tên đăng nhập và mật khẩu từ yêu cầu gửi đến server
    username = request.form.get('username')
    password = request.form.get('password')

    # Kiểm tra xem có thiếu tên đăng nhập hoặc mật khẩu không
    if not username or not password:
        return 'failure'

    # Lấy con trỏ đến CSDL để thực hiện truy vấn
    cursor = db_connection.cursor()

    # Tạo câu truy vấn SQL để lấy thông tin người dùng có tên đăng nhập và mật khẩu tương ứng
    query = "SELECT * FROM users WHERE username = %s AND password = %s"

    # Thực hiện truy vấn SQL với tên đăng nhập và mật khẩu đã lấy được từ yêu cầu gửi đến server
    cursor.execute(query, (username, password))

    # Lấy kết quả truy vấn
    result = cursor.fetchone()

    # Kiểm tra xem kết quả truy vấn có tồn tại hay không
    if result:
        # Nếu tồn tại thì lưu thông tin đăng nhập vào phiên làm việc
        session['loggedIn'] = True
        session['username'] = username
        return 'success'
    else:
        # Nếu không tồn tại thì trả về kết quả thất bại
        return 'failure'

@app.route('/register', methods=['POST'])
@cross_origin()
def register():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')

    if not username or not email or not password:
        return 'failure'

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

@app.route('/save-favorites', methods=['POST'])
@cross_origin(supports_credentials=True)
def save_favorite():
    
    # username = session.get('username') # Lấy tên đăng nhập từ session
    username = request.form.get('username')

    print(f"username: {username}") # In ra tên đăng nhập kiểm tra

    # Nếu không tìm thấy tên đăng nhập thì trả về failure
    if not username:
        return 'failure'
    
    # Tạo con trỏ đến database
    cursor = db_connection.cursor()
    # Lấy id của người dùng từ bảng users
    query = "SELECT id FROM users WHERE username = %s"
    cursor.execute(query, (username,))
    result = cursor.fetchone()
    
    # Nếu không tìm thấy kết quả thì trả về failure
    if not result:
        return 'failure'
    
    # Lấy user_id từ kết quả tìm được
    user_id = result[0]

    # Lấy thông tin thời tiết và khu vực yêu thích từ request form
    weather_type = request.form.get('weather_type')
    region = request.form.get('region')

    # Nếu thông tin thiếu thì trả về failure
    if not weather_type or not region:
        return 'failure'

    # Thêm thông tin vào bảng favorites trong database
    cursor = db_connection.cursor()
    query = "INSERT INTO user_favorites (user_id, weather_type, region) VALUES (%s, %s, %s)"
    cursor.execute(query, (user_id, weather_type, region))
    db_connection.commit()

    return 'success'

if __name__ == '__main__':
    app.run(debug=True)
