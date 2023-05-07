from flask import Flask, request
import mysql.connector
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
app.secret_key = 'sdfh%^&k;lwe42'

CORS(app, origins=["http://127.0.0.1:5500"], supports_credentials=True)

db_connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="weather_forcast"
)

@app.route('/check-login', methods=['POST'])
@cross_origin()
def check_login():
    username = request.form.get('username')
    password = request.form.get('password')

    cursor = db_connection.cursor()

    query = "SELECT * FROM users WHERE username = %s AND password = %s"

    cursor.execute(query, (username, password))

    result = cursor.fetchone()

    if result:
        return 'success'
    else:
        return 'failure'

@app.route('/register', methods=['POST'])
@cross_origin()
def register():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')

    cursor = db_connection.cursor()
    query = "SELECT * FROM users WHERE username = %s"
    cursor.execute(query, (username,))
    result = cursor.fetchone()

    if result:
        return 'failure'

    query = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"
    cursor.execute(query, (username, email, password))
    db_connection.commit()

    return 'success'

@app.route('/save-favorites', methods=['POST'])
@cross_origin(supports_credentials=True)
def save_favorite():

    username = request.form.get('username')

    if not username:
        return 'failure'
    
    cursor = db_connection.cursor()
    query = "SELECT id FROM users WHERE username = %s"
    cursor.execute(query, (username,))
    result = cursor.fetchone()
    
    if not result:
        return 'failure'
    
    user_id = result[0]

    weather_type = request.form.get('weather_type')
    region = request.form.get('region')

    if not weather_type or not region:
        return 'failure'

    cursor = db_connection.cursor()
    query = "INSERT INTO user_favorites (user_id, weather_type, region) VALUES (%s, %s, %s)"
    cursor.execute(query, (user_id, weather_type, region))
    db_connection.commit()

    return 'success'

@app.route('/get-favorites', methods=['POST'])
@cross_origin(supports_credentials=True)
def get_favorites():
    username = request.form.get('username')

    if not username:
        return 'failure'

    cursor = db_connection.cursor()
    query = "SELECT id FROM users WHERE username = %s"
    cursor.execute(query, (username,))
    result = cursor.fetchone()

    if not result:
        return 'failure'

    user_id = result[0]

    cursor = db_connection.cursor()
    query = "SELECT weather_type, region FROM user_favorites WHERE user_id = %s"
    cursor.execute(query, (user_id,))

    favorites = cursor.fetchall()
    favorites_list = [{"weather_type": fav[0], "region": fav[1]} for fav in favorites]

    return json.dumps(favorites_list)

if __name__ == '__main__':
    app.run(debug=True)
