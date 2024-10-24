import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
load_dotenv()

# Get the absolute path of the client/build directory
client_build_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../client/build'))

# Instantiate app, set attributes
app = Flask(
    __name__,
    static_url_path='',
    static_folder=client_build_path,
    template_folder=client_build_path
)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://inkspace_user:VQtOIIiSJvZTBmyyjrf9kYJynK1EIi6T@dpg-csd8m256l47c739h6en0-a.oregon-postgres.render.com/inkspace')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Initialize extensions
metadata = MetaData(naming_convention={
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
CORS(app)
api = Api(app)

# Initialize SQLAlchemy with the app
db.init_app(app)

# Serve the index.html file for the root URL
@app.route('/')
def serve_index():
    return send_from_directory(client_build_path, 'index.html')

# Serve static files
@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory(client_build_path, path)