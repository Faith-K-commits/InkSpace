#!/usr/bin/env python3

# Standard library imports
from datetime import datetime

# Remote library imports
from flask import request, session, jsonify, abort
from flask_restful import Resource
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError 
# Local imports
from config import app, db, api
from models import User, BlogPost, Category, Comment

# Secret key for sessions
app.config['SECRET_KEY'] = 'your_secret_key'

# Login required decorator
def login_required(f):
    def wrap(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'message': 'You need to log in first.'}), 401
        return f(*args, **kwargs)
    return wrap
    
class Register(Resource):
    def post(self):
        data = request.get_json()

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        user = User.query.filter_by(email=email).first()
        if user:
            return {"message": "User already exists"}, 400
        
        new_user = User(
            username=username,
            email=email,
            )
        user.password_hash = password

        try:
            db.session.add(user)
            db.session.commit()

            session['user_id'] = user.id

            return new_user.to_dict(), 201
        
        except IntegrityError:
            return {'error': '422 Unprocessable Entity'}, 422
        

class CheckSession(Resource):
    def get(self):

        user_id = session.get('user_id')
        if user_id:
            user = User.query.filter(User.id == user_id).first()

            return  user.to_dict(), 200
        else:
            return {"error": "Unauthorized"}, 401
        

class Login(Resource):
    def post(self):
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')
        
        user = User.query.filter_by(email=email).first()
        if user:
            if user.authenticate(password):

                session['user_id'] = user.id
                return user.to_dict(), 200
            
        return {"message": "Invalid email or password"}, 401
      
        
class Logout(Resource):
    @login_required
    def delete(self):

        session['user_id'] = None

        return {"message": "Logged out successfully"}, 204
     
     
# BlogPost Resource
class BlogPostResource(Resource):
    @login_required
    def get(self, post_id=None):
        if post_id:
            post = BlogPost.query.get_or_404(post_id)
            return jsonify(post.to_dict(only=("id","content")))
        else:
            posts = BlogPost.query.all()
            return jsonify([post.to_dict(only=("id","content")) for post in posts])

    @login_required
    def post(self):    
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        category_ids = data.get('category_ids')
    
        if not title or not content:
            return {'message': 'Missing title or content'}, 400

        user_id = session['user_id']
        user = User.query.get_or_404(user_id)

        post = BlogPost(title=title, content=content, author=user)

        if category_ids:
            categories = Category.query.filter(Category.id.in_(category_ids)).all()
            post.categories.extend(categories)

        db.session.add(post)
        db.session.commit()
        return jsonify(post.to_dict()), 201

    @login_required
    def put(self, post_id):
        post = BlogPost.query.get_or_404(post_id)
        data = request.get_json()

        post.title = data.get('title', post.title)
        post.content = data.get('content', post.content)

        if 'category_ids' in data:
            post.categories = Category.query.filter(Category.id.in_(data['category_ids'])).all()

        db.session.commit()
        return jsonify(post.to_dict())
    
    @login_required
    def delete(self, post_id):
        post = BlogPost.query.get_or_404(post_id)
        db.session.delete(post)
        db.session.commit()
        return {'message': 'Blog post deleted'}


# Comment Resource
class CommentResource(Resource):
    @login_required
    def get (self, post_id):
        if post_id:
            comments = Comment.query.filter_by(post_id=post_id)
            return jsonify([comment.to_dict(only=("id","content"))for comment in comments])
        else:
            comments = Comment.query.all()
            return jsonify([comment.to_dict(only=("id","content")) for comment in comments])

    @login_required
    def post(self, post_id):
        post = BlogPost.query.get_or_404(post_id)
        data = request.get_json()

        content = data.get('content')
        if not content:
            return {'message': 'Missing content'}, 400

        user_id = session['user_id']
        user = User.query.get_or_404(user_id)

        comment = Comment(content=content, post=post, author=user)
        db.session.add(comment)
        db.session.commit()

        return jsonify(comment.to_dict()), 201

    @login_required
    def delete(self, comment_id):
        comment = Comment.query.get_or_404(comment_id)
        db.session.delete(comment)
        db.session.commit()
        return {'message': 'Comment deleted'}


# Category Resource
class CategoryResource(Resource):
    @login_required
    def get(self):
        categories = Category.query.all()
        return jsonify([category.to_dict() for category in categories])
    
    @login_required
    def post(self):
        data = request.get_json()
        name = data.get('name')
        if not name:
            return {'message': 'Missing name'}, 400

        category = Category(name=name)
        db.session.add(category)
        db.session.commit()

        return jsonify(category.to_dict()), 201


# Adding resources to the API
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(BlogPostResource, '/posts', '/posts/<int:post_id>')
api.add_resource(CommentResource, '/posts/<int:post_id>/comments', '/comments/<int:comment_id>')
api.add_resource(CategoryResource, '/categories')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
