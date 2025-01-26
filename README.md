# News Summarizer App

A personalized news application that delivers curated news content based on user preferences and reading habits.

## Features

- **User Authentication**
  - Register with email and password
  - Secure login system
  - Password change functionality

- **Personalized News Feed**
  - Select up to 3 preferred categories
  - Adaptive content based on reading habits
  - Category-based news filtering

- **News Categories**
  - Education
  - Economy
  - Finance
  - Weather
  - Culture
  - Fashion
  - Entertainment
  - Politics
  - Health
  - Sports
  - Technology

- **Interactive Features**
  - Category preference reset
  - User statistics tracking

## Technology Stack

- **Frontend**
  - React Native
  - Expo
  - React Navigation
  - Axios

- **Backend**
  - Node.js
  - Express
  - PostgreSQL
  - REST API

## Installation

1. Clone the repository
```bash
git clone https://github.com/utakatalp/PersonalizedNewsApplication.git
cd PersonalizedNewsApplication
```

2. Install dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. Configure environment variables
```bash
# In backend folder, create .env file
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=NewsSummarizer
DB_PASSWORD=your_password
DB_PORT=5432
```

4. Set up the database
```bash
# Create database and tables
psql -U postgres -f init.sql

# Load sample data (optional)
psql -U postgres -d NewsSummarizer -f sample_data.sql
```

5. Start the application
```bash
# Start backend server
cd backend
npm start

# Start frontend (in another terminal)
cd ..
npm start
```

## API Endpoints

- **Authentication**
  - POST `/api/auth/register` - Register new user
  - POST `/api/auth/login` - User login
  - POST `/api/auth/change-password` - Change password

- **News**
  - GET `/api/news/:userId` - Get personalized news feed
  - GET `/api/news/category/:category` - Get news by category
  - GET `/api/news/summary/:id` - Get detailed news article

- **Categories**
  - POST `/api/category/initialize` - Initialize user categories
  - POST `/api/category/update` - Update category preferences, increased personalized experience

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## Acknowledgments

- Inspired by modern news aggregation services
- Built with love for news enthusiasts
