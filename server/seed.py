#!/usr/bin/env python3

from config import app, db
from models import User, BlogPost, Category, Comment
from datetime import datetime
from faker import Faker

# Initialize Faker instance
fake = Faker()

# Function to seed the database
def seed_data():
    # Drop and recreate all tables
    db.drop_all()
    db.create_all()

    # Seed Users
    def seed_users(num_users=5):
        users = []
        for _ in range(num_users):
            user = User(
                username=fake.user_name(),
                email=fake.email(),
                password='password123'  
            )
            users.append(user)
            db.session.add(user)
        db.session.commit()
        return users

    # Seed Categories
    def seed_categories():
        categories = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Education']
        category_objs = []
        for name in categories:
            category = Category(name=name)
            category_objs.append(category)
            db.session.add(category)
        db.session.commit()
        return category_objs

    # Seed Blog Posts
    def seed_blog_posts(users, categories, num_posts=10):
        posts = []
        for _ in range(num_posts):
            post = BlogPost(
                title=fake.sentence(nb_words=6),
                content=fake.paragraph(nb_sentences=5),
                author=fake.random_element(users),  
                created_at=datetime.utcnow(),
                categories=[fake.random_element(categories)]  
            )
            posts.append(post)
            db.session.add(post)
        db.session.commit()
        return posts

    # Seed Comments
    def seed_comments(users, posts, num_comments=20):
        for _ in range(num_comments):
            comment = Comment(
                content=fake.sentence(nb_words=10),
                author=fake.random_element(users),  
                post=fake.random_element(posts),  
                created_at=datetime.utcnow()
            )
            db.session.add(comment)
        db.session.commit()

    # Call seed functions
    users = seed_users(num_users=10)  # Create 10 users
    categories = seed_categories()  # Create predefined categories
    posts = seed_blog_posts(users, categories, num_posts=20)  # Create 20 blog posts
    seed_comments(users, posts, num_comments=50)  # Create 50 comments

    print("Database seeded successfully!")

# Wrap operations in application context
if __name__ == '__main__':
    with app.app_context():
        seed_data()
