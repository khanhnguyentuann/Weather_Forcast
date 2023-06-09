# Weather Forecast Website

## Introduction

This project is a weather forecast website that provides real-time weather information to users. It allows users to view weather conditions, search for specific locations, and save their favorite weather preferences.

![Weather Forecast Website](weather-forecast.png)

## Features

- Map: The website includes an interactive map that displays weather information for different regions.
- Left Toolbar:
  - Menu: Users can choose preferred weather conditions and receive weather alerts.
  - Search: Users can search for weather information for specific locations.
  - Share: Users can share weather updates on social media platforms.
- Right Info Tool:
  - Log Out: Users can log out from their accounts.
  - Zoom In/Out: Users can zoom in/out on the map for a closer look.
  - Hello User: Users are greeted with a personalized message.
- Map Layer Icons: Users can add additional map layers for more weather-related data.

## Installation

1. Clone the repository: `git clone https://github.com/khanhnguyentuann/Weather_Forcast.git`
2. Install the required packages:
   - `pip install mysql-connector-python`
   - `pip install Flask`
   - `pip install flask-cors`
3. Set up the database using MySQL through Xampp:
   - Create a database named `weather_forecast`.
   - Run the following SQL commands to create the necessary tables:
   
     ```
     CREATE TABLE users (
       id INT(11) NOT NULL AUTO_INCREMENT,
       username VARCHAR(50) NOT NULL,
       password VARCHAR(255) NOT NULL,
       email VARCHAR(100) NOT NULL,
       PRIMARY KEY (id)
     );

     CREATE TABLE user_favorites (
       id INT(11) NOT NULL AUTO_INCREMENT,
       user_id INT(11) NOT NULL,
       weather_type VARCHAR(50) NOT NULL,
       region VARCHAR(50) NOT NULL,
       PRIMARY KEY (id),
       FOREIGN KEY (user_id) REFERENCES users(id)
     );
     ```
4. Update the database configuration in `config.py` file with your MySQL credentials.

## Usage

1. Start Xampp and ensure that Apache and MySQL services are running.
2. Run the Flask application: `python main.py`.
3. Access the website by opening `main.html` in a web browser. It is recommended to use a live server for proper functionality.

## API Key

To access weather data, you need to obtain an API key from a weather service provider. Once you have the API key, update the `API_KEY` variable in the `config.py` file with your own key.
- ed32be58df3a0bd09ff4c02c0da7443
- 527afe48950c282cf057bbcd097c6aff
- c9c8e558cd1dad0583f2600da8c72b7e
- 41fb46afccd1a8c36210e21fb8e28471

## File Structure

The main files and directories in this project are organized as follows:

- `main.py`: The main Python file that runs the Flask application.
- `main.html`: The main HTML file for the weather forecast website.
- `static/`: Directory containing static files such as CSS stylesheets, JavaScript files, and images.
- `templates/`: Directory containing HTML templates used by the Flask application.
- `config.py`: Configuration file to set up the database and API key.

## License

This project is licensed under the [MIT License](LICENSE).