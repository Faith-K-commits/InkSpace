#!/usr/bin/env python3

# Standard library imports
import datetime
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, BlogPost, Category, Comment


if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        #Delete all rows in tables
        Comment.query.delete()
        BlogPost.query.delete()
        User.query.delete()
        Category.query.delete()
        db.session.commit()

        #Add categories
        CATEGORIES = ["Technology", "Science", "Art", "Travel","Health"]
        categories = [Category(name=category) for category in CATEGORIES]
        db.session.add_all(categories)
        db.session.commit()

        #add users
        fake = Faker()
        users = []
        for _ in range (10):
            user = User(
                username=fake.user_name(),
                email=fake.email(),
                password=fake.password()
            )
            users.append(user)
        db.session.add_all(users)
        db.session.commit()


        #add blog posts
        posts = []
        for _ in range(30):
            post = BlogPost(
                title=fake.sentence(nb_words=6),
                content=fake.text(max_nb_chars=200),
                user_id=rc(users).id,
                )
            
            categories_to_assign= set()
            while len(categories_to_assign) < randint(1, 5):
                category = rc(categories)
               # if category not in categories_to_assign:
                categories_to_assign.add(category)
            
            posts.append(post)
        db.session.add_all(posts)
        db.session.commit()

        #add comments
        comments = []
        for _ in range(50):
            comment = Comment(
                content=fake.sentence(nb_words=10),
                post_id=rc(posts).id,
                user_id=rc(users).id
            )
            comments.append(comment)
        db.session.add_all(comments)
        db.session.commit()

        print("Seeding completed successfully!")


