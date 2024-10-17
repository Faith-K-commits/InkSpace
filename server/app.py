from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_restful import reqparse

# Initialize app and extensions
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'yoursecretkey'  # Replace with a strong secret key for sessions
CORS(app)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
ma = Marshmallow(app)
api = Api(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)

    def __init__(self, email, password):
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('posts', lazy=True))

# Marshmallow Schemas
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User

class BlogPostSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BlogPost

user_schema = UserSchema()
post_schema = BlogPostSchema()
posts_schema = BlogPostSchema(many=True)

# Request Parsers
user_parser = reqparse.RequestParser()
user_parser.add_argument('email', type=str, required=True, help='Email cannot be blank')
user_parser.add_argument('password', type=str, required=True, help='Password cannot be blank')

post_parser = reqparse.RequestParser()
post_parser.add_argument('title', type=str, required=True, help='Title cannot be blank')
post_parser.add_argument('content', type=str, required=True, help='Content cannot be blank')

# Resources

class Register(Resource):
    def post(self):
        args = user_parser.parse_args()
        email = args['email']
        password = args['password']
        
        user = User.query.filter_by(email=email).first()
        if user:
            return {"message": "User already exists"}, 400
        
        new_user = User(email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        
        return user_schema.jsonify(new_user), 201

class Login(Resource):
    def post(self):
        args = user_parser.parse_args()
        email = args['email']
        password = args['password']
        
        user = User.query.filter_by(email=email).first()
        if not user or not bcrypt.check_password_hash(user.password, password):
            return {"message": "Invalid email or password"}, 401
        
        session['user_id'] = user.id
        return {"message": "Login successful"}, 200

class Logout(Resource):
    def post(self):
        session.pop('user_id', None)
        return {"message": "Logged out successfully"}, 200

class BlogPostList(Resource):
    def get(self):
        posts = BlogPost.query.all()
        return posts_schema.jsonify(posts), 200
    
    def post(self):
        if 'user_id' not in session:
            return {"message": "Unauthorized"}, 401
        
        args = post_parser.parse_args()
        title = args['title']
        content = args['content']
        user_id = session['user_id']
        
        new_post = BlogPost(title=title, content=content, user_id=user_id)
        db.session.add(new_post)
        db.session.commit()
        
        return post_schema.jsonify(new_post), 201

class BlogPostDetail(Resource):
    def get(self, id):
        post = BlogPost.query.get(id)
        if not post:
            return {"message": "Post not found"}, 404
        return post_schema.jsonify(post), 200
    
    def put(self, id):
        if 'user_id' not in session:
            return {"message": "Unauthorized"}, 401

        post = BlogPost.query.get(id)
        if not post:
            return {"message": "Post not found"}, 404

        if post.user_id != session['user_id']:
            return {"message": "You can only edit your own posts"}, 403

        args = post_parser.parse_args()
        post.title = args['title']
        post.content = args['content']
        db.session.commit()

        return post_schema.jsonify(post), 200
    
    def delete(self, id):
        if 'user_id' not in session:
            return {"message": "Unauthorized"}, 401

        post = BlogPost.query.get(id)
        if not post:
            return {"message": "Post not found"}, 404

        if post.user_id != session['user_id']:
            return {"message": "You can only delete your own posts"}, 403

        db.session.delete(post)
        db.session.commit()

        return {"message": "Post deleted"}, 200

# Register API Resources
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(BlogPostList, '/posts')
api.add_resource(BlogPostDetail, '/post/<int:id>')

# Run the app
if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
