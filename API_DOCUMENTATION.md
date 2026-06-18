3# 📚 TravelAI API Documentation

## 🌐 Base URL
```
http://localhost:5001/api
```

## 🔐 Authentication
Sử dụng JWT Bearer Token trong header:
```
Authorization: Bearer <token>
```

---

## TEST TRÊN POSTMAN

### Bước 1: Đăng nhập lấy Token
```
POST http://localhost:5001/api/auth/login
Content-Type: application/json

Body:
{
  "email": "tranhungit@gmail.com",
  "password": "123456"
}
```
→ Copy `token` từ response để dùng cho các API cần xác thực.

### Bước 2: Thêm Token vào Header
Trong Postman, vào tab **Authorization**:
- Type: `Bearer Token`
- Token: paste token đã copy

Hoặc vào tab **Headers**:
- Key: `Authorization`
- Value: `Bearer eyJhbGciOiJIUzI1NiIs...`

---
### lấy thông tin đánh giá
GET /api/reviews/my
## 📋 DANH SÁCH API CHI TIẾT

---

## 1. 🔑 AUTHENTICATION APIs

### POST /api/auth/register - Đăng ký
```
URL: http://localhost:5001/api/auth/register
Method: POST
Auth: Không cần

Headers:
  Content-Type: application/json

Body (raw JSON):
{
  "name": "Nguyễn Văn A",
  "email": "test@example.com",
  "password": "123456"
}

Response 201:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "6784a1b2c3d4e5f678901234",
    "name": "Nguyễn Văn A",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### POST /api/auth/login - Đăng nhập
```
URL: http://localhost:5001/api/auth/login
Method: POST
Auth: Không cần

Headers:
  Content-Type: application/json

Body (raw JSON):
{
  "email": "tranhungit@gmail.com",
  "password": "123456"
}

Response 200:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "6784a1b2c3d4e5f678901234",
    "name": "Trần Tấn Hưng",
    "email": "tranhungit@gmail.com",
    "role": "user"
  }
}
```

---

## 2. 👤 USER APIs

### GET /api/users/profile - Lấy thông tin user
```
URL: http://localhost:5001/api/users/profile
Method: GET
Auth: ✅ Bearer Token

Headers:
  Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": {
    "_id": "6784a1b2c3d4e5f678901234",
    "name": "Trần Tấn Hưng",
    "email": "tranhungit@gmail.com",
    "role": "user",
    "preferences": {
      "travelStyle": ["Phiêu lưu", "Văn hóa"],
      "budget": "medium",
      "interests": ["Biển", "Ẩm thực"]
    }
  }
}
```

### PUT /api/users/profile - Cập nhật profile
```
URL: http://localhost:5001/api/users/profile
Method: PUT
Auth: ✅ Bearer Token

Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body (raw JSON):
{
  "name": "Trần Tấn Hưng Updated",
  "preferences": {
    "travelStyle": ["Phiêu lưu", "Thư giãn"],
    "budget": "high",
    "interests": ["Biển", "Núi", "Ẩm thực"]
  }
}

Response 200:
{
  "success": true,
  "data": { ... }
}
```

### GET /api/users/:id - Lấy user theo ID
```
URL: http://localhost:5001/api/users/6784a1b2c3d4e5f678901234
Method: GET
Auth: ✅ Bearer Token (Admin)

Response 200:
{
  "success": true,
  "data": {
    "_id": "6784a1b2c3d4e5f678901234",
    "name": "Trần Tấn Hưng",
    "email": "tranhungit@gmail.com",
    "role": "user"
  }
}
```

### GET /api/users/search/:name - Tìm user theo tên
```
URL: http://localhost:5001/api/users/search/Hung
Method: GET
Auth: ✅ Bearer Token (Admin)

Response 200:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Trần Tấn Hưng",
      "email": "tranhungit@gmail.com"
    }
  ]
}
```

---

## 3. 🏝️ DESTINATIONS APIs

### GET /api/destinations - Lấy danh sách điểm đến
```
URL: http://localhost:5001/api/destinations
Method: GET
Auth: Không cần

Query Parameters (optional):
  ?category=beach
  ?priceRange=budget
  ?search=Đà Nẵng
  ?limit=10
  ?page=1

Ví dụ: http://localhost:5001/api/destinations?category=beach&limit=5

Response 200:
{
  "success": true,
  "data": [
    {
      "_id": "6784a1b2c3d4e5f678901234",
      "name": "Vịnh Hạ Long",
      "description": "Di sản thiên nhiên thế giới...",
      "location": {
        "city": "Quảng Ninh",
        "country": "Việt Nam"
      },
      "coordinates": {
        "lat": 20.9101,
        "lng": 107.1839
      },
      "images": ["https://..."],
      "category": "beach",
      "priceRange": "mid-range",
      "rating": 4.8,
      "reviewCount": 1250,
      "cuisine": [
        { "name": "Chả mực", "description": "Đặc sản nổi tiếng..." }
      ]
    }
  ],
  "total": 49,
  "page": 1,
  "pages": 5
}
```
###  lấy theo danh mục
# Lấy điểm đến biển
GET http://localhost:5001/api/destinations?category=beach

# Lấy điểm đến núi
GET http://localhost:5001/api/destinations?category=mountain

# Kết hợp nhiều filter
GET http://localhost:5001/api/destinations?category=beach&priceRange=budget&limit=10

# Tìm kiếm + phân loại
GET http://localhost:5001/api/destinations?category=beach&search=Nha

### GET /api/destinations/:id - Lấy chi tiết điểm đến
```
URL: http://localhost:5001/api/destinations/6784a1b2c3d4e5f678901234
Method: GET
Auth: Không cần

⚠️ Lưu ý: ID là MongoDB ObjectId (24 ký tự hex)
   Lấy ID từ API GET /api/destinations

Response 200:
{
  "success": true,
  "data": {
    "_id": "6784a1b2c3d4e5f678901234",
    "name": "Vịnh Hạ Long",
    "description": "...",
    "location": { ... },
    "coordinates": { "lat": 20.9101, "lng": 107.1839 },
    "images": [...],
    "category": "beach",
    "priceRange": "mid-range",
    "rating": 4.8,
    "amenities": ["Wifi", "Parking"],
    "activities": ["Chèo thuyền", "Tham quan hang động"],
    "bestTimeToVisit": ["Tháng 3", "Tháng 4", "Tháng 5"],
    "cuisine": [...]
  }
}
```

### POST /api/destinations - Tạo điểm đến (Admin)
```
URL: http://localhost:5001/api/destinations
Method: POST
Auth: ✅ Bearer Token (Admin only)

Headers:
  Authorization: Bearer <admin_token>
  Content-Type: application/json

Body (raw JSON):
{
  "name": "Phú Quốc",
  "description": "Đảo ngọc phương Nam",
  "location": {
    "city": "Kiên Giang",
    "country": "Việt Nam"
  },
  "coordinates": {
    "lat": 10.2899,
    "lng": 103.9840
  },
  "images": ["https://example.com/phuquoc.jpg"],
  "category": "beach",
  "priceRange": "mid-range",
  "amenities": ["Resort", "Spa"],
  "activities": ["Lặn biển", "Câu cá"],
  "bestTimeToVisit": ["Tháng 11", "Tháng 12", "Tháng 1"]
}

Response 201:
{
  "success": true,
  "data": { ... }
}
```

---

## 4. ⭐ REVIEWS APIs

### GET /api/reviews/destination/:destinationId - Lấy reviews
```
URL: http://localhost:5001/api/reviews/destination/6784a1b2c3d4e5f678901234
Method: GET
Auth: Không cần

⚠️ destinationId là MongoDB ObjectId của destination

Response 200:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "user": {
        "_id": "...",
        "name": "Nguyễn Văn A"
      },
      "destination": "6784a1b2c3d4e5f678901234",
      "rating": 5,
      "title": "Tuyệt vời!",
      "content": "Cảnh đẹp, đồ ăn ngon...",
      "visitDate": "2024-01-15",
      "createdAt": "2024-01-20T10:30:00Z"
    }
  ]
}
```

### POST /api/reviews - Tạo review mới
```
URL: http://localhost:5001/api/reviews
Method: POST
Auth: ✅ Bearer Token

Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body (raw JSON):
{
  "destination": "6784a1b2c3d4e5f678901234",
  "rating": 5,
  "title": "Chuyến đi tuyệt vời!",
  "content": "Cảnh đẹp, người dân thân thiện, đồ ăn ngon.",
  "visitDate": "2024-01-15"
}

Response 201:
{
  "success": true,
  "data": { ... }
}
```

---

## 5. 📅 ITINERARIES APIs (Lịch trình)

### GET /api/itineraries - Lấy danh sách lịch trình
```
URL: http://localhost:5001/api/itineraries
Method: GET
Auth: ✅ Bearer Token

Headers:
  Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Du lịch Đà Nẵng",
      "description": "Chuyến đi 3 ngày 2 đêm",
      "startDate": "2024-02-15",
      "endDate": "2024-02-17",
      "destinations": [...]
    }
  ]
}
```

### POST /api/itineraries - Tạo lịch trình mới
```
URL: http://localhost:5001/api/itineraries
Method: POST
Auth: ✅ Bearer Token

Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body (raw JSON):
{
  "title": "Du lịch Đà Nẵng",
  "description": "Chuyến đi 3 ngày 2 đêm khám phá Đà Nẵng",
  "startDate": "2024-02-15",
  "endDate": "2024-02-17"
}

Response 201:
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Du lịch Đà Nẵng",
    ...
  }
}
```

### GET /api/itineraries/:id - Lấy chi tiết lịch trình
```
URL: http://localhost:5001/api/itineraries/6784a1b2c3d4e5f678901234
Method: GET
Auth: ✅ Bearer Token

Response 200:
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Du lịch Đà Nẵng",
    "destinations": [
      {
        "destination": { "_id": "...", "name": "Bà Nà Hills" },
        "notes": "Đến vào buổi sáng",
        "activities": ["Cáp treo", "Cầu Vàng"]
      }
    ]
  }
}
```

### POST /api/itineraries/:id/destinations - Thêm điểm đến vào lịch trình
```
URL: http://localhost:5001/api/itineraries/6784a1b2c3d4e5f678901234/destinations
Method: POST
Auth: ✅ Bearer Token

Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body (raw JSON):
{
  "destinationId": "6784a1b2c3d4e5f678905678",
  "day": 1,
  "notes": "Đến vào buổi sáng sớm",
  "activities": ["Tắm biển", "Ăn hải sản"]
}

Response 200:
{
  "success": true,
  "data": { ... }
}
```

### DELETE /api/itineraries/:id - Xóa lịch trình
```
URL: http://localhost:5001/api/itineraries/6784a1b2c3d4e5f678901234
Method: DELETE
Auth: ✅ Bearer Token

Response 200:
{
  "success": true,
  "message": "Đã xóa lịch trình"
}
```

---

## 6. ❤️ SAVED APIs (Lưu điểm đến)

### GET /api/saved - Lấy danh sách đã lưu
```
URL: http://localhost:5001/api/saved
Method: GET
Auth: ✅ Bearer Token

Headers:
  Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Vịnh Hạ Long",
      "images": [...],
      "location": { ... },
      "rating": 4.8
    }
  ]
}
```

### POST /api/saved/:destinationId - Toggle lưu/bỏ lưu
```
URL: http://localhost:5001/api/saved/6784a1b2c3d4e5f678901234
Method: POST
Auth: ✅ Bearer Token

Headers:
  Authorization: Bearer <token>

Response 200 (Đã lưu):
{
  "success": true,
  "saved": true,
  "message": "Đã lưu điểm đến"
}

Response 200 (Đã bỏ lưu):
{
  "success": true,
  "saved": false,
  "message": "Đã bỏ lưu điểm đến"
}
```

### GET /api/saved/check/:destinationId - Kiểm tra đã lưu chưa
```
URL: http://localhost:5001/api/saved/check/6784a1b2c3d4e5f678901234
Method: GET
Auth: ✅ Bearer Token

Response 200:
{
  "success": true,
  "saved": true
}
```

---

## 7. 🤖 AI CHAT APIs

### POST /api/ai/chat - Chat không lưu lịch sử
```
URL: http://localhost:5001/api/ai/chat
Method: POST
Auth: Không cần

Headers:
  Content-Type: application/json

Body (raw JSON):
{
  "messages": [
    {
      "role": "user",
      "content": "Gợi ý cho tôi địa điểm du lịch biển đẹp ở Việt Nam"
    }
  ]
}

⚠️ Lưu ý: role phải là "user", "assistant", hoặc "system"
   KHÔNG dùng tên người dùng làm role!

Response 200:
{
  "response": "Dựa trên yêu cầu của bạn, tôi gợi ý một số địa điểm biển đẹp:\n\n1. **Vịnh Hạ Long** - Di sản thiên nhiên thế giới...\n2. **Phú Quốc** - Đảo ngọc phương Nam...\n3. **Nha Trang** - Thành phố biển sôi động..."
}
```

### POST /api/ai/chat-with-history - Chat có lưu lịch sử
```
URL: http://localhost:5001/api/ai/chat-with-history
Method: POST
Auth: ✅ Bearer Token

Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body (raw JSON):
{
  "message": "Tôi muốn đi du lịch Đà Nẵng, bạn có gợi ý gì không?"
}

Response 200:
{
  "response": "Đà Nẵng là điểm đến tuyệt vời! Dựa trên sở thích của bạn...",
  "chatId": "..."
}
```

### GET /api/ai/history - Lấy lịch sử chat
```
URL: http://localhost:5001/api/ai/history
Method: GET
Auth: ✅ Bearer Token

Response 200:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Gợi ý du lịch Đà Nẵng",
      "createdAt": "2024-01-20T10:30:00Z"
    }
  ]
}
```

### DELETE /api/ai/history - Xóa toàn bộ lịch sử
```
URL: http://localhost:5001/api/ai/history
Method: DELETE
Auth: ✅ Bearer Token

Response 200:
{
  "success": true,
  "message": "Đã xóa lịch sử chat"
}
```

---

## 8. 🌤️ WEATHER APIs

### GET /api/weather/current - Thời tiết hiện tại
```
URL: http://localhost:5001/api/weather/current?lat=16.0544&lng=108.2022
Method: GET
Auth: Không cần

Query Parameters:
  lat: Vĩ độ (required)
  lng: Kinh độ (required)

Tọa độ một số địa điểm:
  - Hà Nội: lat=21.0285, lng=105.8542
  - TP.HCM: lat=10.8231, lng=106.6297
  - Đà Nẵng: lat=16.0544, lng=108.2022
  - Huế: lat=16.4637, lng=107.5909
  - Nha Trang: lat=12.2388, lng=109.1967
  - Đà Lạt: lat=11.9404, lng=108.4583

Response 200:
{
  "success": true,
  "data": {
    "temp": 28,
    "feelsLike": 32,
    "humidity": 75,
    "description": "Trời nắng",
    "iconUrl": "https://openweathermap.org/img/wn/01d@2x.png",
    "windSpeed": 12,
    "cityName": "Đà Nẵng"
  }
}
```

### GET /api/weather/forecast - Dự báo 5 ngày
```
URL: http://localhost:5001/api/weather/forecast?lat=16.0544&lng=108.2022
Method: GET
Auth: Không cần

Response 200:
{
  "success": true,
  "data": [
    {
      "date": "2024-01-21",
      "temp": { "min": 22, "max": 30 },
      "description": "Trời nắng",
      "iconUrl": "..."
    },
    ...
  ]
}
```

---

## 9. 📊 RECOMMENDATIONS APIs

### GET /api/recommendations - Gợi ý cá nhân hóa
```
URL: http://localhost:5001/api/recommendations
Method: GET
Auth: ✅ Bearer Token

Response 200:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Vịnh Hạ Long",
      "score": 0.95,
      "reason": "Phù hợp với sở thích biển của bạn"
    }
  ]
}
```

### GET /api/recommendations/trending - Điểm đến trending
```
URL: http://localhost:5001/api/recommendations/trending
Method: GET
Auth: Không cần

Response 200:
{
  "success": true,
  "data": [...]
}
```

---

## 10. ⚙️ ADMIN APIs

### GET /api/admin/stats - Thống kê tổng quan
```
URL: http://localhost:5001/api/admin/stats
Method: GET
Auth: ✅ Bearer Token (Admin only)

Response 200:
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalDestinations": 49,
    "totalReviews": 320,
    "totalItineraries": 85
  }
}
```

### GET /api/admin/users - Danh sách users
```
URL: http://localhost:5001/api/admin/users
Method: GET
Auth: ✅ Bearer Token (Admin only)

Response 200:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "..."
    }
  ]
}
```

### PUT /api/admin/users/:id/role - Đổi role user
```
URL: http://localhost:5001/api/admin/users/6784a1b2c3d4e5f678901234/role
Method: PUT
Auth: ✅ Bearer Token (Admin only)

Body (raw JSON):
{
  "role": "admin"
}

Response 200:
{
  "success": true,
  "message": "Đã cập nhật role"
}
```

### DELETE /api/admin/users/:id - Xóa user
```
URL: http://localhost:5001/api/admin/users/6784a1b2c3d4e5f678901234
Method: DELETE
Auth: ✅ Bearer Token (Admin only)

Response 200:
{
  "success": true,
  "message": "Đã xóa user"
}
```

---

## 📝 RESPONSE FORMAT

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Mô tả lỗi"
}
```

---

## 🔒 ERROR CODES

| Code | Mô tả |
|------|-------|
| 200 | Thành công |
| 201 | Tạo mới thành công |
| 400 | Request không hợp lệ |
| 401 | Chưa đăng nhập / Token hết hạn |
| 403 | Không có quyền truy cập |
| 404 | Không tìm thấy |
| 500 | Lỗi server |

---

## 📌 SWAGGER UI

Test API trực tiếp trên trình duyệt:
```
http://localhost:5001/api-docs
```

---

## 🔧 EXTERNAL APIs

| API | Mục đích |
|-----|----------|
| Cerebras AI (Llama 3.1) | Chatbot AI hỗ trợ du lịch |
| OpenWeatherMap | Thời tiết điểm đến |
| OpenStreetMap (Leaflet) | Hiển thị bản đồ |

---

## 💡 MẸO TEST POSTMAN

1. **Tạo Collection** cho TravelAI
2. **Tạo Environment** với biến:
   - `base_url`: `http://localhost:5001/api`
   - `token`: (để trống, sẽ điền sau khi login)
3. **Sau khi login**, copy token và set vào biến `token`
4. **Dùng biến** trong URL: `{{base_url}}/destinations`
5. **Dùng biến** trong Header: `Bearer {{token}}`
