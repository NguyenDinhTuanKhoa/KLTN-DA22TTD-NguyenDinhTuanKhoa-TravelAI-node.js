# 🤖 Luồng Dữ Liệu: AI Chat & Gợi Ý Thông Minh

## Tổng Quan

Tài liệu này mô tả chi tiết cách dữ liệu được truyền từ tính năng "Gợi ý thông minh" (Quiz) đến AI Chat, và cách AI xử lý để đưa ra gợi ý cá nhân hóa.

---

## 1. Kiến Trúc Tổng Quan

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐    localStorage    ┌──────────────────┐      │
│  │  SmartSuggestion │ ───────────────────▶│    AI Chat Page  │      │
│  │     (Quiz)       │   smartPrompt      │                  │      │
│  └──────────────────┘                    └────────┬─────────┘      │
│                                                   │                 │
└───────────────────────────────────────────────────┼─────────────────┘
                                                    │ fetch API
                                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Express.js)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐         ┌──────────────────┐                 │
│  │   AI Routes      │────────▶│   AI Service     │                 │
│  │  /api/ai/*       │         │                  │                 │
│  └──────────────────┘         └────────┬─────────┘                 │
│                                        │                            │
│                          ┌─────────────┼─────────────┐              │
│                          ▼             ▼             ▼              │
│                    ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│                    │Destination│  │   User   │  │Itinerary │        │
│                    │  Model   │  │  Model   │  │  Model   │        │
│                    └──────────┘  └──────────┘  └──────────┘        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL API (NVIDIA NIM)                        │
│       stepfun-ai/step-3.7-flash (reasoning, reasoning_effort=low)   │
│   Fallback: minimaxai/minimax-m2.7 → opencode mimo-v2.5-free        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Chi Tiết Từng Bước

### Bước 1: Thu Thập Dữ Liệu Từ Quiz

**File:** `frontend/app/components/SmartSuggestion.tsx`

```typescript
// State lưu trữ câu trả lời của user
const [answers, setAnswers] = useState<QuizAnswer>({
  travelStyle: [],    // Mảng: ['Phiêu lưu', 'Văn hóa', 'Ẩm thực']
  budget: '',         // String: 'low' | 'medium' | 'high'
  interests: [],      // Mảng: ['Biển', 'Núi', 'Di tích']
  duration: '',       // String: 'weekend' | 'short' | 'long'
  companion: ''       // String: 'solo' | 'couple' | 'family' | 'friends'
});
```

**5 câu hỏi Quiz:**
| # | Câu hỏi | Loại | Giá trị |
|---|---------|------|---------|
| 1 | Phong cách du lịch | Multiple | Phiêu lưu, Thư giãn, Văn hóa, Ẩm thực, Thiên nhiên, Lịch sử |
| 2 | Ngân sách | Single | low, medium, high |
| 3 | Địa hình yêu thích | Multiple | Biển, Núi, Thành phố, Nông thôn, Di tích, Ẩm thực |
| 4 | Thời gian đi | Single | weekend (1-2 ngày), short (3-5 ngày), long (6+ ngày) |
| 5 | Đi cùng ai | Single | solo, couple, family, friends |

---

### Bước 2: Tạo Prompt và Lưu localStorage

**File:** `frontend/app/components/SmartSuggestion.tsx`

```typescript
const handleStartChat = () => {
  // Chuyển đổi answers thành câu văn tự nhiên
  const prompt = `Tôi muốn đi du lịch với phong cách ${answers.travelStyle.join(', ')}, 
    ngân sách ${answers.budget === 'low' ? 'tiết kiệm' : answers.budget === 'medium' ? 'trung bình' : 'cao cấp'}, 
    thích ${answers.interests.join(', ')}, 
    thời gian ${answers.duration === 'weekend' ? '1-2 ngày' : answers.duration === 'short' ? '3-5 ngày' : '6+ ngày'}, 
    đi ${answers.companion === 'solo' ? 'một mình' : answers.companion === 'couple' ? 'cặp đôi' : answers.companion === 'family' ? 'gia đình' : 'nhóm bạn'}. 
    Gợi ý cho tôi điểm đến phù hợp!`;
  
  // Lưu vào localStorage để AI Chat đọc
  localStorage.setItem('smartSuggestionPrompt', prompt);
  
  // Chuyển hướng sang trang AI Chat
  window.location.href = '/ai-chat';
};
```

**Ví dụ prompt được tạo:**
```
"Tôi muốn đi du lịch với phong cách Phiêu lưu, Văn hóa, ngân sách trung bình, 
thích Biển, Di tích, thời gian 3-5 ngày, đi cặp đôi. Gợi ý cho tôi điểm đến phù hợp!"
```

---

### Bước 3: AI Chat Đọc Prompt Từ localStorage

**File:** `frontend/app/ai-chat/page.tsx`

```typescript
const { user, token, loading: authLoading } = useAuth();
const [smartPromptProcessed, setSmartPromptProcessed] = useState(false);

// useEffect đợi auth load xong rồi mới xử lý
useEffect(() => {
  // Đợi auth loading xong
  if (authLoading || smartPromptProcessed) return;
  
  // Đọc prompt từ localStorage
  const smartPrompt = localStorage.getItem('smartSuggestionPrompt');
  
  if (smartPrompt) {
    // Xóa khỏi localStorage để không gửi lại
    localStorage.removeItem('smartSuggestionPrompt');
    setSmartPromptProcessed(true);
    
    // Delay nhỏ để đảm bảo UI đã render
    setTimeout(() => {
      sendMessage(smartPrompt);  // Gửi message tự động
    }, 300);
  }
}, [authLoading, smartPromptProcessed]);
```

**Tại sao cần đợi authLoading?**
- Nếu gửi message trước khi auth load xong → `user` và `token` là null
- Message sẽ được gửi ở chế độ Guest → không lưu lịch sử
- Đợi auth load xong → có token → lưu được lịch sử chat

---

### Bước 4: Gửi Request Lên Backend

**File:** `frontend/app/ai-chat/page.tsx`

```typescript
const sendMessage = async (content: string) => {
  // Nếu đã đăng nhập
  if (user && token) {
    // Tạo chat mới nếu chưa có
    let chatId = currentChatId;
    if (!chatId) {
      const createRes = await fetch(`${API_URL}/ai/history`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      chatId = createData.data._id;
    }

    // Gửi message với lịch sử
    const res = await fetch(`${API_URL}/ai/history/${chatId}/message`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ content: content.trim() })
    });
  }
};
```

---

### Bước 5: Backend Xử Lý Request

**File:** `backend/src/routes/ai.js`

```javascript
// POST /api/ai/history/:id/message
router.post('/history/:id/message', protect, async (req, res) => {
  const { content } = req.body;  // Prompt từ quiz
  
  // Tìm chat history
  const chat = await ChatHistory.findOne({ 
    _id: req.params.id, 
    user: req.user._id 
  });

  // Thêm message của user
  chat.messages.push({ role: 'user', content });
  
  // Chuẩn bị messages cho AI
  const aiMessages = chat.messages.map(m => ({ 
    role: m.role, 
    content: m.content 
  }));
  
  // Gọi AI Service với userId để lấy context
  const aiResponse = await aiService.chatComplete(aiMessages, req.user._id);
  
  // Lưu response của AI
  chat.messages.push({ role: 'assistant', content: aiResponse });
  await chat.save();

  res.json({ success: true, data: { response: aiResponse } });
});
```

---

### Bước 6: AI Service Xử Lý

**File:** `backend/src/services/aiService.js`

```javascript
async chatComplete(messages, userId = null) {
  let systemPrompt = SYSTEM_PROMPT;
  
  // 1. LẤY DANH SÁCH DESTINATIONS TỪ DATABASE
  const destinationsList = await this.getDestinationsList();
  if (destinationsList) {
    systemPrompt += `\n\n[DANH SÁCH ĐIỂM ĐẾN TRONG HỆ THỐNG]\n${destinationsList}`;
  }
  
  // 2. LẤY CONTEXT CỦA USER (nếu đã đăng nhập)
  if (userId) {
    const userContext = await this.getUserContext(userId);
    if (userContext) {
      systemPrompt += `\n\n[THÔNG TIN NGƯỜI DÙNG]\n${userContext}`;
    }
  }
  
  // 3. GỌI NVIDIA NIM (step-3.7-flash, reasoning model)
  const completion = await nvidiaClient.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages  // Chứa prompt từ quiz
    ],
    model: 'stepfun-ai/step-3.7-flash',
    reasoning_effort: 'low',  // dồn token cho câu trả lời thay vì phần <think>
    max_tokens: 8192,
    temperature: 0.4,
    top_p: 0.9
  });

  return completion.choices[0]?.message?.content;
}
```

---

### Bước 7: Lấy Danh Sách Destinations

**File:** `backend/src/services/aiService.js`

```javascript
async getDestinationsList() {
  // Query tất cả destinations từ MongoDB
  const destinations = await Destination.find({})
    .select('name location category priceRange rating')
    .sort({ rating: -1 })
    .limit(100);

  // Format thành text cho AI đọc
  const list = destinations.map(d => 
    `- ${d.name} (${d.location?.city}) [${categoryMap[d.category]}, ${priceMap[d.priceRange]}, ⭐${d.rating}]`
  ).join('\n');

  return list;
}
```

**Ví dụ output:**
```
- Vịnh Hạ Long (Quảng Ninh) [Biển, Trung bình, ⭐4.9]
- Phố cổ Hội An (Quảng Nam) [Di tích, Trung bình, ⭐4.8]
- Sapa (Lào Cai) [Núi, Tiết kiệm, ⭐4.7]
- Đà Nẵng (Đà Nẵng) [Biển, Trung bình, ⭐4.8]
```

---

### Bước 8: Lấy Context Người Dùng

**File:** `backend/src/services/aiService.js`

```javascript
async getUserContext(userId) {
  const user = await User.findById(userId)
    .populate('savedDestinations', 'name location category');
  
  const itineraries = await Itinerary.find({ user: userId })
    .populate('destinations.destination', 'name')
    .limit(5);

  let context = '';

  // Sở thích từ profile
  if (user.preferences) {
    context += `\n- Phong cách: ${user.preferences.travelStyle?.join(', ')}`;
    context += `\n- Ngân sách: ${user.preferences.budget}`;
    context += `\n- Sở thích: ${user.preferences.interests?.join(', ')}`;
  }

  // Địa điểm đã lưu
  if (user.savedDestinations?.length) {
    context += `\n- Đã lưu: ${user.savedDestinations.map(d => d.name).join(', ')}`;
  }

  // Lịch trình đã tạo
  if (itineraries.length) {
    context += `\n- Lịch trình: ${itineraries.map(it => it.title).join(', ')}`;
  }

  return context;
}
```

---

## 3. System Prompt Hoàn Chỉnh

```
Bạn là TravelAI - trợ lý du lịch thông minh của Việt Nam...

QUAN TRỌNG: Khi gợi ý điểm đến, hãy ƯU TIÊN các địa điểm có trong danh sách hệ thống.

[DANH SÁCH ĐIỂM ĐẾN TRONG HỆ THỐNG]
- Vịnh Hạ Long (Quảng Ninh) [Biển, Trung bình, ⭐4.9]
- Phố cổ Hội An (Quảng Nam) [Di tích, Trung bình, ⭐4.8]
- Sapa (Lào Cai) [Núi, Tiết kiệm, ⭐4.7]
...

[THÔNG TIN NGƯỜI DÙNG]
- Phong cách: Phiêu lưu, Văn hóa
- Ngân sách: medium
- Sở thích: Biển, Di tích
- Đã lưu: Đà Nẵng, Hội An
```

---

## 4. Sơ Đồ Luồng Tóm Tắt

```
┌─────────────────┐
│   User làm Quiz │
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
│ localStorage    │
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
│ sendMessage()   │
│ → fetch API     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ POST /api/ai/   │
│ history/:id/msg │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ aiService       │
│ .chatComplete() │
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
│ Build System    │
│ Prompt + Context│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ NVIDIA NIM      │
│ (step-3.7-flash)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Response →      │
│ Hiển thị UI     │
└─────────────────┘
```

---

## 5. Các File Liên Quan

| File | Mô tả |
|------|-------|
| `frontend/app/components/SmartSuggestion.tsx` | Component Quiz trên trang chủ |
| `frontend/app/ai-chat/page.tsx` | Trang AI Chat |
| `frontend/app/context/AuthContext.tsx` | Context quản lý auth state |
| `backend/src/routes/ai.js` | API routes cho AI |
| `backend/src/services/aiService.js` | Service xử lý AI logic |
| `backend/src/models/Destination.js` | Model điểm đến |
| `backend/src/models/User.js` | Model người dùng |
| `backend/src/models/ChatHistory.js` | Model lịch sử chat |

---

## 6. Lưu Ý Kỹ Thuật

1. **Cache Destinations:** Danh sách destinations được cache 5 phút để giảm query DB
2. **Auth Loading:** Phải đợi auth load xong trước khi gửi message từ quiz
3. **localStorage:** Dùng để truyền data giữa 2 page (SmartSuggestion → AI Chat)
4. **System Prompt:** Inject cả danh sách DB và context user để AI gợi ý chính xác
