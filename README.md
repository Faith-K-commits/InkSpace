
# InkSpace 📝
InkSpace is a modern, feature-rich blogging platform that empowers writers to create, manage, and share their stories with the world. Built with performance and user experience in mind, it provides all the tools needed for effective content creation and community engagement.

## 🎯 Key Features

### For Writers
- User-Friendly Interface: Easy to navigate and use for all types of writers
- Writers can easily Create,Read, Update and Delete Posts
- Custom categories 


### For Readers
- Clean, distraction-free reading experience
- Comment system to allow you share your thougts on a specific post


## Getting Started

```console
 directory structure
.
├── CONTRIBUTING.md
├── LICENSE.md
├── Pipfile
├── README.md
├── requirements.txt
├── Procfile.dev
├── pipfile.lock
├── .env
├── .gitignore
├── client
│   ├── README.md
│   ├── package.json
│   ├── public
│   └── src
└── server
    ├── app.py
    ├── config.py
    ├── models.py
    └── seed.py
    └── migrations
```
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/Faith-K-commits/InkSpace.git
cd InkSpace
```

2. Install dependencies
```bash
 npm install --prefix client
 pipenv install && pipenv shell
```

3. Configure environment variables
```bash
create .env
add the following:
DATABASE_URI=postgresql://{retrieve this from from render}
```

4. Run the following commands to install upgrade and seed our database:
```bash
 cd server
 flask db upgrade
 python seed.py
```
5.You can now run the app locally with:
```bash
 honcho start -f Procfile.dev
``` 


## 📖 API Documentation

## Relationships and Models
![Alt text](images/relationship.png "Relationship diagram")

## Models
Our database consists of four main models :

1.User 
2.Category 
3.BlogPost
4.Comment

There is also an association tables (post_catgory) to handle the many-to-many relationship between BlogPosts and Categories

## Model Relationships
User 
i. A user can have multiple posts (one-to-many).
ii. A user can write many Comments(one-to-many)

Category
i. A category can have multiple blog posts (many-to-many)

BlogPost
i. A blog post is associated with one user (many-to-one).
ii. A blog post can have multiple categories (many-to-many).
iii. A blog post can have multiple comments (one-to-many).

Comment
i. A comment is associated with one user (many-to-one).
ii. A comment is associated with one blog post (many-to-one).

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user account |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |

### Blog Posts Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create new post |
| GET | `/api/posts/:id` | Get specific post |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |



## 🤝 Contributing

We love contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Link to deployed site
```
https://inkspace-m69o.onrender.com/
```
### 🙏 Acknowledgments

- All our amazing contributors

---

<p align="center">
  Made with ❤️ by the InkSpace Team
</p>



