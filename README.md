# 📝 Mindly

Mindly is a modern full-stack diary application built with the MERN stack. It allows users to securely write, edit, delete, and organize their personal diary entries. The application also includes AI-powered diary summaries to help users quickly review their thoughts.

---

## ✨ Features

- 🔐 User Authentication (JWT)
- 📝 Create Diary Entries
- ✏️ Edit Existing Entries
- 🗑️ Delete Entries
- 📖 View Individual Diary Entry
- 🤖 AI Generated Summary
- 📄 Pagination for Diary Entries
- 🔒 Protected Routes
- 📱 Responsive User Interface

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- Axios
- CSS Modules
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

---

## 📂 Project Structure

```
mindly/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/<your-username>/mindly.git
```

### Install Frontend

```bash
cd client
npm install
```

### Install Backend

```bash
cd ../server
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server` folder.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_api_key
```

---

## ▶️ Run the Application

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
cd client
npm run dev
```

---

## 📸 Screenshots

- Landing Page
- Login Page
- Diary List
- Diary Details
- AI Summary
- Create Diary Entry

Uploding Soon

---

## 🌱 Future Improvements

- Search Diary Entries
- Filter by Mood
- Tags Support
- Dark Mode
- Rich Text Editor
- Image Upload
- Calendar View
- Export Diary as PDF

---

## 👨‍💻 Author

Anurag

GitHub: https://github.com/anurag4788