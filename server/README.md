# 📌 API Documentation

## 🚀 Overview
This API provides authentication, user management, posts, comments, and likes functionalities. It allows users to register, log in, create posts, comment on posts, and like/unlike posts.

---

## 📡 Base URL
```
http://localhost:3000/api
```

---

## 🔑 Authentication
### **Register**
**Endpoint:** `POST /auth/register`

📌 **Request Body:**
```json
{
    "full_name": "test testovich",
    "username": "test",
    "email": "testovich@test.co",
    "password": "test"
}
```
📌 **Response:**
```json
{
    "message": "User registered successfully",
    "user": {
        "id": "123456789",
        "username": "test"
    }
}
```

---
### **Login**
**Endpoint:** `POST /auth/login`

📌 **Request Body:**
```json
{
    "login": "test",
    "password": "test"
}
```
📌 **Response:**
```json
{
    "message": "Login successful",
    "token": "your_jwt_token"
}
```

---

## 📝 Comments
### **Add Comment**
**Endpoint:** `POST /comment/:postId`

📌 **Request Body:**
```json
{
    "text": "first comment to first post POG"
}
```
📌 **Response:**
```json
{
    "message": "Comment has been created successfully",
    "data": {
        "user_id": "67ccf85e76721c8a786397de",
        "ref_id": "67ce140883a9fac734148e65",
        "ref_type": "Post",
        "_id": "67cf4246e0728fe8a9e51dbb",
        "__v": 0
    }
}
```

### **Delete Comment**
**Endpoint:** `DELETE /comment/:commentId`

📌 **Response:**
```json
{
    "message": "The comment has been successfully deleted."
}
```

---

## ❤️ Likes
### **Like Post**
**Endpoint:** `POST /like/:postId`

📌 **Response:**
```json
{
    "message": "Post liked successfully"
}
```

### **Unlike Post**
**Endpoint:** `DELETE /like/:postId`

📌 **Response:**
```json
{
    "message": "Post unliked successfully"
}
```

---

## 📸 Posts
### **Create Post**
**Endpoint:** `POST /post/create`

📌 **Response:**
```json
{
    "message": "Post created successfully",
    "post": {
        "id": "123456",
        "description": "New post description"
    }
}
```

### **Get Post by ID**
**Endpoint:** `GET /post/:postId`

📌 **Response:**
```json
{
    "post": {
        "id": "123456",
        "description": "New post description",
        "likes_count": 10,
        "comments_count": 2
    }
}
```

---

## 👤 Users
### **Get User by ID**
**Endpoint:** `GET /user/:id`

📌 **Response:**
```json
{
    "user": {
        "id": "98765",
        "username": "test",
        "full_name": "test testovich",
        "posts_count": 5
    }
}
```

---

## 🛠 Setup & Run
1️⃣ Install dependencies:
```sh
npm install
```

2️⃣ Start the  dev server:
```sh
npm run dev
```

---

## 📌 Notes
- All authenticated routes require a valid **JWT Token** in the `Authorization` header.
- Replace `localhost:3000/api` with the actual server URL in production.

📌 **Happy Coding! 🚀**


