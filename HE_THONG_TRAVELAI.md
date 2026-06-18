# � TravelAI - Hệ Thống Gợi Ý Du Lịch Thông Minh

## 📋 Tổng Quan Dự Án

**TravelAI** là một hệ thống gợi ý du lịch thông minh tại Việt Nam, sử dụng trí tuệ nhân tạo (AI) để cá nhân hóa các gợi ý điểm đến, lịch trình cho người dùng dựa trên sở thích, ngân sách và hành vi.

---

## 🏗️ Kiến Trúc Hệ Thống

### Sơ Đồ Kiến Trúc

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js 16)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │   Home   │  │   AI     │  │Destination│  │ Itinerary│              │
│  │  Page    │  │   Chat   │  │   Page    │  │   Page   │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │             │             │             │                      │
│       └─────────────┴─────────────┴─────────────┘                      │
│                              │                                           │
│                      ┌───────▼───────┐                                  │
│                      │  AuthContext  │                                  │
│                      │    (JWT)      │                                  │
│                      └───────┬───────┘                                  │
└──────────────────────────────│───────────────────────────────────────────┘
                               │ HTTP/HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Express.js)                             │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                         API Routes                               │   │
│  │  /api/auth  /api/users  /api/destinations  /api/itineraries    │   │
│  │  /api/reviews  /api/ai  /api/recommendations  /api/admin       │   │
│  └────────────────────────────┬───────────────────────────────────┘   │
│                               │                                           │
│  ┌────────────────────────────▼───────────────────────────────────┐   │
│  │                       Services Layer                            │   │
│  │  ┌────────────────┐  ┌──────────────────┐  ┌───────────────┐  │   │
│  │  │  aiService     │  │ recommendation  │  │ weather       │  │   │
│  │  │  (Cerebras AI) │  │    Service      │  │ Service       │  │   │
│  │  └───────┬────────┘  └────────┬─────────┘  └───────┬───────┘  │   │
│  └──────────│────────────────────│────────────────────│──────────┘   │
│             │                    │                    │               │
└─────────────│────────────────────│────────────────────│───────────────┘
              │                    │                    │
              ▼                    ▼                    ▼
┌─────────────────┐   ┌───────────────────┐   ┌─────────────────────┐
│ MongoDB Atlas   │   │ External APIs     │   │ Weather API         │
│ Database        │   │ (Cerebras AI      │   │ (OpenWeatherMap)    │
│                 │   │  Llama 3.1-8B)   │   │                     │
└─────────────────┘   └───────────────────┘   └─────────────────────┘
```

### Công Nghệ Sử Dụng

| Phần | Công nghệ | Phiên bản |
|------|-----------|------------|
| **Frontend** | Next.js | 16.1.1 |
| | React | 19.2.3 |
| | TypeScript | 5.x |
| | Tailwind CSS | 4.x |
| **Backend** | Node.js | - |
| | Express.js | 4.21.0 |
| | Mongoose | 8.6.0 |
| **Database** | MongoDB Atlas | - |
| **Authentication** | JWT (jsonwebtoken) | 9.0.2 |
| **AI** | Cerebras AI (Llama 3.1-8B) | - |
| **Maps** | Leaflet, React-Leaflet | 1.9.4, 5.0.0 |

---

## 📁 Cấu Trúc Thư Mục

```
travelai/
├── backend/                         # Server Node.js + Express
│   ├── src/
│   │   ├── server.js               # Entry point của server
│   │   ├── config/
│   │   │   └── db.js               # Kết nối MongoDB
│   │   ├── middleware/
│   │   │   └── auth.js             # Xác thực JWT
│   │   ├── models/                 # Mongoose Models
│   │   │   ├── User.js             # Model người dùng
│   │   │   ├── Destination.js      # Model điểm đến
│   │   │   ├── Itinerary.js        # Model lịch trình
│   │   │   ├── Review.js            # Model đánh giá
│   │   │   ├── ChatHistory.js      # Model lịch sử chat AI
│   │   │   └── UserBehavior.js     # Model hành vi người dùng
│   │   ├── routes/                  # API Endpoints
│   │   │   ├── auth.js             # Đăng ký, đăng nhập
│   │   │   ├── users.js            # Quản lý user
│   │   │   ├── destinations.js     # CRUD điểm đến
│   │   │   ├── itineraries.js      # Quản lý lịch trình
│   │   │   ├── reviews.js          # Đánh giá
│   │   │   ├── ai.js               # AI Chat
│   │   │   ├── recommendations.js  # Gợi ý
│   │   │   ├── admin.js            # Admin functions
│   │   │   ├── weather.js          # Thời tiết
│   │   │   └── saved.js            # Lưu điểm đến
│   │   ├── services/               # Business Logic
│   │   │   ├── aiService.js        # Xử lý AI
│   │   │   ├── recommendationService.js
│   │   │   └── weatherService.js
│   │   ├── scripts/                # Seed data
│   │   │   ├── seedAdmin.js
│   │   │   ├── seedDestinations.js
│   │   │   └── seedCuisine.js
│   │   └── swagger.js              # Swagger config
│   └── package.json
│
├── frontend/                        # Next.js Application
│   ├── app/
│   │   ├── (auth)/                 # Trang xác thực
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── onboarding/
│   │   ├── admin/                  # Dashboard admin
│   │   │   ├── destinations/
│   │   │   ├── reviews/
│   │   │   └── users/
│   │   ├── ai-chat/                # Trang chat AI
│   │   ├── destinations/           # Danh sách điểm đến
│   │   ├── destinations/[id]/      # Chi tiết điểm đến
│   │   ├── itinerary/[id]/         # Chi tiết lịch trình
│   │   ├── saved/                  # Điểm đã lưu
│   │   ├── profile/                # Profile user
│   │   ├── explore/                # Trang khám phá
│   │   ├── components/             # Reusable components
│   │   │   ├── AISection.tsx
│   │   │   ├── SmartSuggestion.tsx  # Quiz gợi ý
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Map.tsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.tsx     # Auth state
│   │   └── lib/
│   │       ├── api.ts              # API client
│   │       └── adminApi.ts         # Admin API
│   └── package.json
│
└── package.json                     # Root package (hiện tại chỉ có tailwindcss)
```

---

## 🗄️ Cơ Sở Dữ Liệu (MongoDB)

### Thông Tin Kết Nối

```
MongoDB Atlas Connection String:
mongodb+srv://trantanhungga113_db_user:ljhAOe75HuOHnOGf@cluster0.dbig38e.mongodb.net/?appName=Cluster0
```

### Các Collections

#### 1. **users** - Người Dùng
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String, // 'user' | 'admin'
  preferences: {
    travelStyle: [String],      // ['Phiêu lưu', 'Văn hóa', 'Ẩm thực']
    budget: String,             // 'low' | 'medium' | 'high'
    interests: [String]        // ['Biển', 'Núi', 'Di tích']
  },
  savedDestinations: [ObjectId], // Tham chiếu đến Destination
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **destinations** - Điểm Đến
```javascript
{
  _id: ObjectId,```````
  name: String,
  description: String,
  location: {
    city: String,
    country: String
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  images: [String],
  category: String,            // 'beach' | 'mountain' | 'city' | 'heritage'
  priceRange: String,          // 'budget' | 'mid-range' | 'luxury'
  rating: Number,
  reviewCount: Number,
  amenities: [String],
  activities: [String],
  bestTimeToVisit: [String],
  cuisine: [{
    name: String,
    description: String
  }]
}
```

#### 3. **itineraries** - Lịch Trình
```javascript
{
  _id: ObjectId,
  user: ObjectId,              // Tham chiếu đến User
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  destinations: [{
    destination: ObjectId,    // Tham chiếu đến Destination
    day: Number,
    notes: String,
    activities: [String]
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. **reviews** - Đánh Giá
```javascript
{
  _id: ObjectId,
  user: ObjectId,
  destination: ObjectId,
  rating: Number,              // 1-5
  title: String,
  content: String,
  visitDate: Date,
  createdAt: Date
}
```

#### 5. **chathistories** - Lịch Sử Chat AI
```javascript
{
  _id: ObjectId,
  user: ObjectId,
  messages: [{
    role: String,             // 'user' | 'assistant'
    content: String,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### 6. **userbehaviors** - Hành Vi Người Dùng
```javascript
{
  _id: ObjectId,
  user: ObjectId,
  interactions: [{
    type: String,             // 'view' | 'search' | 'save' | 'review'
    destinationId: ObjectId,
    timestamp: Date,
    timeSpent: Number
  }]
}
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:5001/api
```

### 1. Authentication APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| POST | `/auth/register` | Đăng ký tài khoản | ❌ |
| POST | `/auth/login` | Đăng nhập | ❌ |

### 2. User APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/users/profile` | Lấy thông tin profile | ✅ |
| PUT | `/users/profile` | Cập nhật profile | ✅ |
| GET | `/users/:id` | Lấy user theo ID | ✅ (Admin) |

### 3. Destination APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/destinations` | Danh sách điểm đến | ❌ |
| GET | `/destinations/:id` | Chi tiết điểm đến | ❌ |
| POST | `/destinations` | Tạo điểm đến mới | ✅ (Admin) |
| PUT | `/destinations/:id` | Cập nhật điểm đến | ✅ (Admin) |
| DELETE | `/destinations/:id` | Xóa điểm đến | ✅ (Admin) |

**Query Parameters:**
- `?category=beach` - Lọc theo danh mục
- `?priceRange=budget` - Lọc theo giá
- `?search=Đà Nẵng` - Tìm kiếm
- `?limit=10` - Số lượng kết quả
- `?page=1` - Trang

### 4. Itinerary APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/itineraries` | Danh sách lịch trình | ✅ |
| POST | `/itineraries` | Tạo lịch trình mới | ✅ |
| GET | `/itineraries/:id` | Chi tiết lịch trình | ✅ |
| PUT | `/itineraries/:id` | Cập nhật lịch trình | ✅ |
| DELETE | `/itineraries/:id` | Xóa lịch trình | ✅ |
| POST | `/itineraries/:id/destinations` | Thêm điểm đến | ✅ |

### 5. Review APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/reviews/destination/:id` | Reviews của điểm đến | ❌ |
| POST | `/reviews` | Tạo review mới | ✅ |

### 6. AI APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| POST | `/ai/chat` | Chat với AI | ✅ |
| POST | `/ai/chat/stream` | Chat streaming | ✅ |
| POST | `/ai/suggest-itinerary` | Gợi ý lịch trình | ✅ |
| POST | `/ai/suggest-destinations` | Gợi ý điểm đến | ✅ |
| POST | `/ai/askDestination` | Hỏi về điểm đến | ✅ |

### 7. Recommendation APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/recommendations/personalized` | Gợi ý cá nhân hóa | ✅ |
| GET | `/recommendations/similar/:id` | Điểm đến tương tự | ❌ |
| GET | `/recommendations/popular` | Điểm đến phổ biến | ❌ |
| GET | `/recommendations/trending` | Điểm đến trending | ❌ |
| POST | `/recommendations/track/view` | Theo dõi lượt xem | ✅ |
| POST | `/recommendations/save/:id` | Lưu điểm đến | ✅ |
| GET | `/recommendations/saved` | Lấy danh sách đã lưu | ✅ |

### 8. Admin APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/admin/users` | Danh sách users | ✅ (Admin) |
| DELETE | `/admin/users/:id` | Xóa user | ✅ (Admin) |
| GET | `/admin/destinations` | Danh sách destinations | ✅ (Admin) |
| GET | `/admin/reviews` | Danh sách reviews | ✅ (Admin) |
| DELETE | `/admin/reviews/:id` | Xóa review | ✅ (Admin) |

---

## 🤖 AI Chat Flow

### Luồng Dữ Liệu AI

```
┌─────────────────┐
│   User làm Quiz │      ← SmartSuggestion.tsx
│  (5 câu hỏi)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Tạo prompt từ  │
│    answers      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ localStorage    │     ← Lưu 'smartSuggestionPrompt'
│ .setItem()      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Redirect to     │
│ /ai-chat        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ useEffect đọc   │
│ localStorage    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ sendMessage()   │     ← Gọi API /ai/chat
│ → fetch API     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend AI    │     ← aiService.js
│   Service       │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│ Query │ │ Query │
│ Dest. │ │ User  │
└───┬───┘ └───┬───┘
    │         │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│ Cerebras AI    │     ← Llama 3.1-8B
│ (API call)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Response →      │
│ Hiển thị UI    │
└─────────────────┘
```

### 5 Câu Hỏi Quiz

| # | Câu hỏi | Loại | Giá trị |
|---|---------|------|---------|
| 1 | Phong cách du lịch | Multiple | Phiêu lưu, Thư giãn, Văn hóa, Ẩm thực, Thiên nhiên, Lịch sử |
| 2 | Ngân sách | Single | low, medium, high |
| 3 | Địa hình yêu thích | Multiple | Biển, Núi, Thành phố, Nông thôn, Di tích, Ẩm thực |
| 4 | Thời gian đi | Single | weekend (1-2 ngày), short (3-5 ngày), long (6+ ngày) |
| 5 | Đi cùng ai | Single | solo, couple, family, friends |

---

## 🔐 Authentication

### JWT Flow

1. **Đăng nhập:** Gửi email/password → Server trả về JWT token
2. **Lưu token:** Client lưu vào localStorage
3. **Gửi request:** Thêm header `Authorization: Bearer <token>`
4. **Xác thực:** Middleware kiểm tra token hợp lệ

### User Roles

| Role | Quyền |
|------|-------|
| `user` | Đăng nhập, xem điểm đến, tạo lịch trình, đánh giá, chat AI |
| `admin` | Tất cả quyền user + quản lý users, destinations, reviews |

---

## 🚀 Cách Chạy Dự Án

### Yêu Cầu
- Node.js 18+
- MongoDB Atlas account
- Cerebras AI API key

### Backend

```bash
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env
# Chỉnh sửa .env với MongoDB URI và API keys

# Chạy server
npm run dev        # Development với nodemon
npm start          # Production

# Seed data (optional)
npm run seed:all   # Chạy tất cả seed
npm run seed:admin # Tạo admin user
```

### Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build
npm start
```

### Truy Cập

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5001/api |
| Swagger Docs | http://localhost:5001/api-docs |

---

## 📦 Scripts

### Backend Scripts

```bash
npm run seed:admin         # Tạo tài khoản admin mặc định
npm run seed:destinations  # Seed dữ liệu điểm đến
npm run seed:cuisine       # Seed dữ liệu ẩm thực
npm run seed:all           # Chạy tất cả seed
```

### Frontend Scripts

```bash
npm run dev    # Chạy development server
npm run build  # Build cho production
npm run start  # Chạy production server
npm run lint   # Kiểm tra lỗi code
```

---

## 🔧 Cấu Hình Môi Trường

### Backend (.env)

```env
PORT=5001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_key
CEREBRAS_API_KEY=your_cerebras_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

---

## 📊 Tính Năng Chính

1. **🤖 AI Chat & Gợi Ý Thông Minh**
   - Quiz 5 câu hỏi để thu thập sở thích
   - AI cá nhân hóa gợi ý điểm đến
   - Gợi ý lịch trình tự động

2. **🏝️ Quản Lý Điểm Đến**
   - Danh sách điểm đến với filter
   - Chi tiết điểm đến với bản đồ
   - Tìm kiếm và lọc nâng cao

3. **📅 Lịch Trình Cá Nhân**
   - Tạo và quản lý lịch trình
   - Thêm điểm đến vào lịch trình
   - Lưu và chia sẻ

4. **⭐ Hệ Thống Đánh Giá**
   - Đánh giá và nhận xét
   - Rating 1-5 sao
   - Cải thiện gợi ý AI

5. **👤 Quản Lý Người Dùng**
   - Đăng ký/Đăng nhập JWT
   - Lưu điểm đến yêu thích
   - Quản lý profile

6. **🔧 Admin Dashboard**
   - CRUD điểm đến
   - Quản lý users
   - Quản lý reviews

---

## 📝 Tài Liệu Tham Khảo

- [API Documentation](./API_DOCUMENTATION.md)
- [AI Chat Flow](./AI_CHAT_FLOW.md)
- [Database Schema](./database_mongoAslat.md)
- [Đề Cương Chi Tiết](./DE_CUONG_CHI_TIET.md)

---

*Document created: 2026-03-21*
*Project: TravelAI - Smart Travel Recommendation System*
