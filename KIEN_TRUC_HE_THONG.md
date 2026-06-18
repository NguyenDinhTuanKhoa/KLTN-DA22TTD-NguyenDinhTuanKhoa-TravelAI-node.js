# Sơ đồ Kiến trúc Hệ thống TravelAI

## 1. Tổng quan kiến trúc

Hệ thống TravelAI được xây dựng theo mô hình **3-tier architecture** (Client-Server-Database) với kiến trúc **RESTful API**, tích hợp **AI Service** và các **External APIs**.

---

## 2. Các thành phần chính

### **Layer 1: Client Layer (Presentation Layer)**
```
┌─────────────────────────────────────────┐
│         FRONTEND (Next.js 16)           │
│  ┌───────────────────────────────────┐  │
│  │  User Interface Components        │  │
│  │  - Home Page                      │  │
│  │  - Destinations Listing           │  │
│  │  - Destination Detail             │  │
│  │  - AI Chat Interface              │  │
│  │  - Itinerary Management           │  │
│  │  - User Profile                   │  │
│  │  - Admin Dashboard                │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  State Management                 │  │
│  │  - AuthContext (JWT)              │  │
│  │  - React Hooks (useState, etc)    │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  UI Libraries                     │  │
│  │  - Tailwind CSS                   │  │
│  │  - React-Leaflet (Maps)           │  │
│  │  - React-Markdown                 │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
              ↓ HTTP/HTTPS (REST API)
```

### **Layer 2: Application Layer (Business Logic)**
```
┌─────────────────────────────────────────┐
│      BACKEND (Node.js + Express)        │
│  ┌───────────────────────────────────┐  │
│  │  API Routes (11 groups)           │  │
│  │  - /api/auth                      │  │
│  │  - /api/users                     │  │
│  │  - /api/destinations              │  │
│  │  - /api/itineraries               │  │
│  │  - /api/reviews                   │  │
│  │  - /api/ai (Chatbot)              │  │
│  │  - /api/weather                   │  │
│  │  - /api/recommendations           │  │
│  │  - /api/saved                     │  │
│  │  - /api/specialties               │  │
│  │  - /api/admin                     │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Middleware                       │  │
│  │  - JWT Authentication             │  │
│  │  - CORS                           │  │
│  │  - Body Parser                    │  │
│  │  - Error Handler                  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Business Logic Services          │  │
│  │  - aiService.js                   │  │
│  │  - routingService.js              │  │
│  │  - recommendationService.js       │  │
│  │  - weatherService.js              │  │
│  │  - geocodingService.js            │  │
│  │  - optimizeService.js             │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
         ↓                        ↓
    MongoDB                  External APIs
```

### **Layer 3: Data Layer**
```
┌─────────────────────────────────────────┐
│         DATABASE (MongoDB)              │
│  ┌───────────────────────────────────┐  │
│  │  Collections (7 models)           │  │
│  │  - users                          │  │
│  │  - destinations                   │  │
│  │  - itineraries                    │  │
│  │  - chathistories                  │  │
│  │  - reviews                        │  │
│  │  - provincespecialties            │  │
│  │  - userbehaviors                  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Mongoose ODM                     │  │
│  │  - Schema Validation              │  │
│  │  - Relationships                  │  │
│  │  - Indexes                        │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### **External Services Layer**
```
┌─────────────────────────────────────────┐
│         EXTERNAL APIs                   │
│  ┌───────────────────────────────────┐  │
│  │  NVIDIA AI API                    │  │
│  │  - Model: minimaxai/minimax-m2.7     │  │
│  │  - Chatbot Intelligence           │  │
│  │  - Streaming Response             │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  OpenWeatherMap API               │  │
│  │  - Current Weather                │  │
│  │  - 5-day Forecast                 │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Google Maps API                  │  │
│  │  - Directions                     │  │
│  │  - Geocoding                      │  │
│  │  - Distance Matrix                │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 3. Luồng dữ liệu (Data Flow)

### **3.1. Luồng đăng nhập/đăng ký**
```
User → Frontend → POST /api/auth/login 
     → Backend (validate) 
     → MongoDB (check user) 
     → Generate JWT 
     → Return token 
     → Frontend (save to localStorage)
```

### **3.2. Luồng AI Chatbot**
```
User → Frontend (AI Chat) 
     → POST /api/ai/chat-with-history 
     → Backend (aiService.js)
     → Build context (destinations, specialties, user preferences)
     → NVIDIA AI API (streaming)
     → Parse response (detect itinerary JSON)
     → Save to MongoDB (chathistories)
     → Stream response to Frontend
     → Frontend (display with markdown)
```

### **3.3. Luồng tạo lịch trình**
```
User → Frontend (Create Itinerary)
     → POST /api/itineraries
     → Backend (validate)
     → MongoDB (save itinerary)
     → Return itinerary ID
     → Frontend (redirect to detail page)
     → GET /api/itineraries/:id
     → Backend (populate destinations)
     → Apply Nearest Neighbor Algorithm
     → Calculate distances (Haversine)
     → Return optimized itinerary
     → Frontend (display with map)
```

### **3.4. Luồng tối ưu lộ trình**
```
Frontend (Itinerary Detail)
     → Get destinations with coordinates
     → Apply Nearest Neighbor Sort (client-side)
     → Build Google Maps URL (origin/destination/waypoints)
     → Display optimized route on map
     → Show distances between stops
```

### **3.5. Luồng lấy thời tiết**
```
Frontend → GET /api/weather/current?lat=...&lng=...
        → Backend (weatherService.js)
        → OpenWeatherMap API
        → Parse response
        → Return weather data
        → Frontend (display)
```

---

## 4. Kiến trúc chi tiết theo module

### **4.1. Authentication Module**
```
┌─────────────────────────────────────────┐
│  Frontend: Login/Register Form         │
│           ↓                             │
│  Backend: /api/auth/login               │
│           ↓                             │
│  Middleware: bcrypt (hash password)     │
│           ↓                             │
│  MongoDB: users collection              │
│           ↓                             │
│  Generate: JWT token                    │
│           ↓                             │
│  Return: { token, user }                │
└─────────────────────────────────────────┘
```

### **4.2. AI Chatbot Module**
```
┌─────────────────────────────────────────┐
│  Frontend: AI Chat Interface            │
│           ↓                             │
│  Backend: /api/ai/chat-with-history     │
│           ↓                             │
│  aiService.js:                          │
│    - detectRegionFromQuery()            │
│    - getFilteredDestinations()          │
│    - getFilteredSpecialties()           │
│    - getUserContext()                   │
│    - buildSystemPrompt()                │
│           ↓                             │
│  NVIDIA AI API (streaming)              │
│           ↓                             │
│  Parse response:                        │
│    - Extract markdown                   │
│    - Detect JSON block (itinerary)      │
│           ↓                             │
│  Save to MongoDB: chathistories         │
│           ↓                             │
│  Stream to Frontend (SSE)               │
└─────────────────────────────────────────┘
```

### **4.3. Itinerary Optimization Module**
```
┌─────────────────────────────────────────┐
│  Frontend: Itinerary Detail Page        │
│           ↓                             │
│  Get destinations with coordinates      │
│           ↓                             │
│  nearestNeighborSort():                 │
│    - Start from first destination       │
│    - Find nearest unvisited             │
│    - Repeat until all visited           │
│           ↓                             │
│  Calculate distances (Haversine)        │
│           ↓                             │
│  Build Google Maps URL:                 │
│    - origin = first destination         │
│    - destination = last destination     │
│    - waypoints = middle destinations    │
│           ↓                             │
│  Display on map with route              │
└─────────────────────────────────────────┘
```

### **4.4. Recommendation Module**
```
┌─────────────────────────────────────────┐
│  Frontend: Home/Explore Page            │
│           ↓                             │
│  Backend: /api/recommendations          │
│           ↓                             │
│  recommendationService.js:              │
│    - Get user preferences               │
│    - Get saved destinations             │
│    - Get search history                 │
│    - Calculate similarity score         │
│    - Filter by category/budget          │
│           ↓                             │
│  MongoDB: Query destinations            │
│           ↓                             │
│  Sort by score (descending)             │
│           ↓                             │
│  Return top N recommendations           │
└─────────────────────────────────────────┘
```

---

## 5. Công nghệ sử dụng

### **Frontend Stack**
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Maps**: Leaflet + React-Leaflet
- **Markdown**: React-Markdown
- **Export**: html2canvas, jsPDF, xlsx

### **Backend Stack**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcryptjs
- **AI**: NVIDIA API (Cerebras SDK)
- **Documentation**: Swagger UI

### **External APIs**
- **AI**: NVIDIA (minimaxai/minimax-m2.7-flash)
- **Weather**: OpenWeatherMap
- **Maps**: Google Maps Directions API
- **Geocoding**: OpenStreetMap

### **Algorithms**
- **Routing**: Nearest Neighbor Algorithm
- **Distance**: Haversine Formula
- **Recommendation**: Collaborative Filtering

---

## 6. Deployment Architecture (Đề xuất)

```
┌─────────────────────────────────────────┐
│         USER DEVICES                    │
│  (Web Browser, Mobile Browser)          │
└─────────────────────────────────────────┘
              ↓ HTTPS
┌─────────────────────────────────────────┐
│         CDN / Load Balancer             │
│         (Cloudflare, AWS)               │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    FRONTEND SERVER (Vercel/Netlify)     │
│         Next.js Application             │
└─────────────────────────────────────────┘
              ↓ REST API
┌─────────────────────────────────────────┐
│    BACKEND SERVER (Heroku/Railway)      │
│         Node.js + Express               │
└─────────────────────────────────────────┘
         ↓                    ↓
┌──────────────────┐  ┌──────────────────┐
│  MongoDB Atlas   │  │  External APIs   │
│  (Cloud DB)      │  │  - NVIDIA        │
│                  │  │  - Weather       │
│                  │  │  - Google Maps   │
└──────────────────┘  └──────────────────┘
```

---

## 7. Bảng tóm tắt các thành phần

| Layer | Component | Technology | Port |
|-------|-----------|------------|------|
| **Frontend** | Web UI | Next.js 16 + React 19 | 3000 |
| **Backend** | API Server | Node.js + Express | 5001 |
| **Database** | Data Storage | MongoDB | 27017 |
| **AI Service** | Chatbot | NVIDIA API | - |
| **Weather** | Weather Data | OpenWeatherMap | - |
| **Maps** | Routing | Google Maps | - |

---

## 8. Ghi chú vẽ sơ đồ

Khi vẽ sơ đồ kiến trúc, nên bao gồm:

1. **3 layers chính**: Client → Server → Database
2. **Các module chính**: Auth, AI Chat, Itinerary, Recommendations
3. **External APIs**: NVIDIA, Weather, Google Maps
4. **Data flow**: Mũi tên chỉ hướng luồng dữ liệu
5. **Protocols**: HTTP/HTTPS, REST API, WebSocket (streaming)
6. **Security**: JWT, CORS, HTTPS

**Màu sắc đề xuất**:
- Frontend: Xanh dương (#3B82F6)
- Backend: Xanh lá (#10B981)
- Database: Cam (#F59E0B)
- External APIs: Tím (#8B5CF6)