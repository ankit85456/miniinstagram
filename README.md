# 📸 MiniInstagram
A full-stack Mini Instagram web application built using Node.js, Express, MongoDB, and EJS.  
Users can register, login, upload posts with images, and view posts in a feed.
---
## 🚀 Features
- 🔐 User Authentication (Register/Login)
- 🖼️ Upload Image Posts
- 📰 Instagram-style Feed
- 👤 View My Posts
- ❤️ Like System
- 📅 Timestamp (CreatedAt & UpdatedAt)
- 🗂 MongoDB Atlas Database Integration
---
## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, EJS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** Express-session / JWT (if used)
- **File Upload:** Multer
---
## 📂 Project Structure
miniinstagram/
│
├── models/
│ ├── User.js
│ └── Post.js
│
├── routes/
│ ├── auth.js
│ └── posts.js
│
├── views/
│ ├── login.ejs
│ ├── register.ejs
│ ├── feed.ejs
│ └── upload.ejs
│
├── public/
│ └── uploads/
│
├── app.js
├── package.json
└── README.md

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/miniinstagram.git
cd miniinstagram
2️⃣ Install dependencies
npm install
3️⃣ Create .env file
Create a .env file in the root directory and add:
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
4️⃣ Start the server
npm start
Server will run on:
http://localhost:5000
🗄️ Database Schema
User Schema
username
email
password
createdAt
Post Schema
userId
username
caption
image
likes
createdAt
updatedAt

📸 Screenshots
<img width="1885" height="907" alt="image" src="https://github.com/user-attachments/assets/e7370a1b-6e98-44dc-ae3b-dd0b4085a917" />
<img width="1114" height="760" alt="image" src="https://github.com/user-attachments/assets/85fdfc1b-b287-4909-8081-7e13b6a5d8ba" />
<img width="1114" height="760" alt="image" src="https://github.com/user-attachments/assets/b942e771-a1cd-4559-9875-e690d14d0e28" />

node_modules/
.env
📈 Future Improvements
🔔 Notifications

💬 Comments System

👥 Follow/Unfollow Feature

❤️ Real-time Likes

🎨 UI Improvements
👨‍💻 Author
Ankit Kumar
Aspiring Full Stack Developer
Building projects to strengthen backend & database concepts 🚀
