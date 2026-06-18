# 📊 TravelAI - Project Overview

## 🎯 Mô tả
TravelAI là nền tảng du lịch thông minh sử dụng AI để tư vấn và gợi ý lịch trình du lịch Việt Nam. Full-stack với Backend (Node.js/Express) + Frontend (Next.js).

---

## 🏗️ Kiến trúc

### Backend (Port 5001)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT + bcryptjs
- **AI**: NVIDIA API (`minimaxai/minimax-m2.7-flash`)
- **APIs**: Swagger UI tại `/api-docs`

### Frontend (Port 3000)
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Maps**: Leaflet + React-Leaflet

---

## 📁 Cấu trúc

```
backend/
├── src/
│   ├── config/db.js              # MongoDB connection
│   ├── middleware/auth.js        # JWT auth middleware
│   ├── models/                   # 7 MongoDB models
│   │   ├── User.js               # User (name, email, password, preferences, savedDestinations)
│   │   ├── Destination.js        # Destination (name, location, coordinates, images, category, rating)
│   │   ├── Itinerary.js          # Itinerary (user, title, dates, destinations, hotels, budget)
│   │   ├── ChatHistory.js        # ChatHistory (user, messages[], title)
│   │   ├── Review.js             # Review (user, destination, rating)
│   │   ├── ProvinceSpecialty.js  # ProvinceSpecialty (province, region, localDishes, souvenirs)
│   │   └── UserBehavior.js       # UserBehavior (tracking)
│   ├── routes/                   # 11 route groups
│   │   ├── auth.js               # POST /register, /login
│   │   ├── users.js              # GET/PUT /profile, GET /:id
│   │   ├── destinations.js       # CRUD destinations
│   │   ├── itineraries.js        # CRUD itineraries
│   │   ├── reviews.js            # CRUD reviews
│   │   ├── saved.js              # Toggle save destinations
│   │   ├── ai.js                 # ⭐ POST /chat, /chat-with-history (AI chatbot)
│   │   ├── weather.js            # GET /current, /forecast (OpenWeatherMap)
│   │   ├── recommendations.js    # GET /, /trending
│   │   ├── specialties.js        # GET / (đặc sản địa phương)
│   │   └── admin.js              # Admin: stats, manage users/destinations
│   ├── services/                 # Business logic
│   │   ├── aiService.js          # ⭐ Core AI logic
│   │   ├── routingService.js     # Tính khoảng cách, thời gian di chuyển
│   │   ├── recommendationService.js
│   │   ├── weatherService.js
│   │   ├── geocodingService.js
│   │   └── optimizeService.js
│   ├── scripts/                  # Seed data scripts
│   └── server.js                 # Entry point

frontend/
├── app/
│   ├── (auth)/login, register, onboarding
│   ├── admin/                    # Admin dashboard
│   ├── ai-chat/                  # ⭐ AI Chatbot page
│   ├── destinations/             # Listing + detail
│   ├── itinerary/                # List + detail
│   ├── explore/
│   ├── my-tours/
│   ├── components/
│   │   ├── AISection.tsx
│   │   ├── Map.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   ├── context/AuthContext.tsx
│   └── lib/api.ts, adminApi.ts
```

---

## 🔑 Tính năng chính

### 1. 🤖 AI Chatbot (`/api/ai/chat`)
- **Model**: NVIDIA - `minimaxai/minimax-m2.7-flash`
- Tư vấn du lịch Việt Nam
- Gợi ý lịch trình chi tiết theo ngày
- Tư vấn món ăn & đặc sản địa phương
- Ước tính ngân sách (VNĐ)
- Streaming response (SSE)

### 2. 🏝️ Quản lý Điểm đến
- 49 destinations
- Categories: beach, mountain, city, countryside, historical
- Price: budget, mid-range, luxury

### 3. 📅 Lịch trình
- Create/Read/Update/Delete itinerary
- Thêm destinations, hotels, restaurants
- Ước tính budget
- Status: planning, ongoing, completed

### 4. ⭐ Review & Rating
- Rate destinations (1-5 sao)
- Write review

### 5. ❤️ Lưu yêu thích
- Toggle save/unsave destinations

### 6. 🌤️ Thời tiết
- Current weather + 5-day forecast
- OpenWeatherMap API

### 7. 🎯 Recommendations
- Personalized based on user preferences
- Trending destinations

### 8. 👤 User Management
- Register/Login (JWT)
- Profile & preferences
- Role: user/admin

### 9. ⚙️ Admin Dashboard
- Manage users, destinations, reviews
- Statistics

---

## 🗄️ Database Schema

```
users: { name, email, password, avatar, role, preferences, savedDestinations[], searchHistory[] }
destinations: { name, description, location{ city, country, coordinates }, images[], category, priceRange, rating, reviewCount, amenities[], bestTimeToVisit[], activities[], cuisine }
itineraries: { user, title, description, startDate, endDate, destinations[{ destination, order, notes, activities }], hotels[], restaurants[], budget{ estimated, actual }, isPublic, status }
chathistories: { user, title, messages[{ role, content, timestamp }], lastMessage }
reviews: { user, destination, rating, title, content, visitDate }
provincespecialties: { province, region, localDishesText, souvenirsText, stt }
userbehaviors: { user, action, data, timestamp }
```

---

## 🔌 API Endpoints

| Route | Methods | Mô tả |
|-------|---------|-------|
| `/api/auth` | POST register, login | Authentication |
| `/api/users` | GET, PUT profile | User management |
| `/api/destinations` | GET, POST, PUT, DELETE | Destinations CRUD |
| `/api/itineraries` | GET, POST, PUT, DELETE | Itineraries CRUD |
| `/api/reviews` | GET, POST, DELETE | Reviews |
| `/api/saved` | GET, POST | Save destinations |
| `/api/ai` | POST chat, chat-with-history | ⭐ AI Chatbot |
| `/api/weather` | GET current, forecast | Weather |
| `/api/recommendations` | GET, trending | Recommendations |
| `/api/specialties` | GET | Province specialties |
| `/api/admin` | GET, PUT, DELETE | Admin management |

---

## 🧠 AI Service Logic (aiService.js)

### Region Detection
- Tự động phát hiện vùng miền từ câu hỏi user
- Miền Bắc, Miền Trung, Miền Nam, Tây Nguyên
- Lọc destinations & specialties theo vùng

### Context Injection
- Gửi danh sách destinations (top 20-30) cho AI
- Gửi đặc sản địa phương
- Gửi user preferences
- Gửi routing info (khoảng cách, thời gian)

### Itinerary Detection
- Phát hiện câu hỏi về lịch trình
- Yêu cầu AI trả về JSON block ẩn
- Frontend parse JSON để tự động lưu itinerary

### Key Functions
- `detectRegionFromQuery(query)` - Detect vùng miền
- `detectItineraryQuery(messages)` - Detect câu hỏi lịch trình
- `getFilteredDestinations(regionInfo)` - Lọc destinations theo vùng
- `getFilteredSpecialties(regionInfo)` - Lọc đặc sản theo vùng
- `buildSystemPrompt(messages, userId)` - Build prompt với context
- `chat(messages, onChunk, userId)` - Streaming chat
- `chatComplete(messages, userId)` - Non-streaming chat

---

## 🛠️ Scripts

```bash
# Backend
cd backend
npm install
npm run seed:all        # Seed all data (admin, destinations, cuisine)
npm run dev             # Start dev server (port 5001)

# Frontend
cd frontend
npm install
npm run dev             # Start dev server (port 3000)
```

---

## 📊 Thống kê

- **Symbols**: 740 (GitNexus index)
- **Relationships**: 1282
- **Execution Flows**: 57
- **API Routes**: 11 groups
- **Models**: 7
- **Services**: 6

---

## 🔗 External APIs

| API | Mục đích |
|-----|----------|
| NVIDIA (minimaxai/minimax-m2.7-flash) | AI Chatbot |
| OpenWeatherMap | Thời tiết |
| Leaflet/OpenStreetMap | Bản đồ |

---

## 📝 Ghi chú quan trọng

1. AI service chỉ gợi ý từ danh sách destinations/specialties có trong database
2. Region detection dùng keyword matching (REGION_KEYWORDS)
3. Itinerary JSON format: `{"destinations":["name1","name2"],"days":N,"budget":"X triệu VNĐ","summary":"..."}`
4. JWT token required cho most endpoints (except auth, destinations, weather, AI basic chat)
5. Admin routes require `role: admin`