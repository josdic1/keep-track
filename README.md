# keep-track

> Generated with **Uniform Build** on 10/20/2025

## 🏗️ Project Structure

```
keep-track/
├── backend/          # Flask API
├── frontend/         # React app
├── .gitignore
├── .uniform-project.json
└── README.md
```

## 📦 Tech Stack

**Backend:** Flask, SQLAlchemy, Marshmallow
**Frontend:** React, Vite, Axios

## 🗄️ Data Model


### Entities
- **Track**
- **Artist**
- **Link**
- **Tag**
- **Media**

### Relationships
- Track ↔ Artist (many-to-many)
- Link → Track (many-to-one)
- Track ↔ Tag (many-to-many)


## 🚀 Quick Start


### Option 1: Quick start (Unix/Mac)
```bash
./start-all.sh
```


### Option 2: Manual Setup


#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Backend runs on: `http://localhost:5555`



#### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`


## 📚 API Endpoints


### Track
- `GET    /api/tracks` - List all
- `GET    /api/tracks/:id` - Get one
- `POST   /api/tracks` - Create
- `PUT    /api/tracks/:id` - Update
- `DELETE /api/tracks/:id` - Delete

### Artist
- `GET    /api/artists` - List all
- `GET    /api/artists/:id` - Get one
- `POST   /api/artists` - Create
- `PUT    /api/artists/:id` - Update
- `DELETE /api/artists/:id` - Delete

### Link
- `GET    /api/links` - List all
- `GET    /api/links/:id` - Get one
- `POST   /api/links` - Create
- `PUT    /api/links/:id` - Update
- `DELETE /api/links/:id` - Delete

### Tag
- `GET    /api/tags` - List all
- `GET    /api/tags/:id` - Get one
- `POST   /api/tags` - Create
- `PUT    /api/tags/:id` - Update
- `DELETE /api/tags/:id` - Delete

### Media
- `GET    /api/medias` - List all
- `GET    /api/medias/:id` - Get one
- `POST   /api/medias` - Create
- `PUT    /api/medias/:id` - Update
- `DELETE /api/medias/:id` - Delete




## 🔧 Development

### Check Uniformity
```bash
cd ../uniformity-checker
npm run check ../keep-track
```

### Database Migrations
```bash
cd backend
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

## ✨ Features

- auth
- admin
- uploads

## 🎯 What Was Generated

- ✅ Backend with 5 models
- ✅ Frontend with React + Vite
- ✅ 3 relationship(s)
- ✅ Complete CRUD operations
- ✅ API service layer
- ✅ Context providers
- ✅ Reusable components

---

**Built with ❤️ using Uniform Build**

Run `uniform-check` to validate your code stays uniform!
# keep-track
