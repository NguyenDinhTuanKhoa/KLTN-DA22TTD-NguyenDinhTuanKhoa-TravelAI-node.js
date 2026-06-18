# 🧹 HƯỚNG DẪN CLEAR CACHE - QUAN TRỌNG!

## 🎯 VẤN ĐỀ
Map vẫn hiển thị vị trí cũ vì browser đang cache API response.

## ✅ GIẢI PHÁP - LÀM THEO THỨ TỰ

### 1️⃣ Clear Next.js Cache
```bash
cd d:/travelai/frontend

# Stop frontend (Ctrl+C)

# Xóa thư mục .next
rm -rf .next         # Linux/Mac
rmdir /s /q .next    # Windows

# Start lại
npm run dev
```

### 2️⃣ Clear Browser Cache (QUAN TRỌNG!)

#### 🔹 Cách 1: Hard Refresh (Nhanh nhất)
```
1. Mở trang: http://localhost:3000/destinations
2. Nhấn: Ctrl + Shift + R (Windows)
        hoặc Cmd + Shift + R (Mac)
```

#### 🔹 Cách 2: Clear Storage
```
1. Nhấn F12 (DevTools)
2. Tab "Application"
3. Storage → "Clear site data"
4. Click nút "Clear site data"
5. F5 để refresh
```

#### 🔹 Cách 3: Network Disable Cache
```
1. Nhấn F12 (DevTools)
2. Tab "Network"
3. Check ✅ "Disable cache"
4. Giữ DevTools mở
5. F5 để refresh
```

### 3️⃣ Xác Nhận Kết Quả

#### 📍 Test API trực tiếp
```bash
curl "http://localhost:5001/api/destinations?search=Bãi+Sao"
```

Kết quả phải là:
```json
{
  "name": "Bãi Sao",
  "location": {
    "city": "Phú Quốc",
    "coordinates": {
      "lat": 10.1599,  ✅ ĐÚNG
      "lng": 103.9959  ✅ ĐÚNG
    }
  }
}
```

#### 🗺️ Kiểm tra trên Map
```
1. Truy cập: http://localhost:3000/destinations?search=Bãi+Sao

2. Click vào card "Bãi Sao"

3. Map phải hiển thị marker ở:
   📍 Phú Quốc (phía Nam đảo)
   📍 KHÔNG phải Vũng Tàu hoặc vị trí khác

4. Zoom in để xác nhận vị trí chính xác
```

---

## 🚨 NẾU VẪN KHÔNG ĐỔI

### Option A: Thử trình duyệt khác
```
1. Mở Incognito/Private mode
2. Hoặc thử Chrome → Firefox → Edge
```

### Option B: Clear tất cả localStorage
```javascript
// Mở Console (F12) → Console tab
// Paste và Enter:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Option C: Restart toàn bộ
```bash
# Stop tất cả (Ctrl+C)

# Backend
cd d:/travelai/backend
npm run dev

# Frontend (terminal mới)
cd d:/travelai/frontend
rm -rf .next
npm run dev
```

---

## ✅ KẾT QUẢ MONG ĐỢI

Sau khi clear cache xong:

### 🎯 Bãi Sao
- ✅ Hiển thị ở **Phú Quốc, Kiên Giang**
- ✅ Tọa độ: `10.1599, 103.9959`
- ✅ Marker hiển thị đúng vị trí phía Nam đảo
- ✅ Popup có ảnh + thông tin đúng

### 🎯 OpenStreetMap Link
```
https://www.openstreetmap.org/?mlat=10.1599&mlon=103.9959#map=15/10.1599/103.9959
```

---

## 💡 LƯU Ý

- Frontend code đã được fix → **KHÔNG cache nữa**
- Database đã đúng
- API đã trả về đúng
- Chỉ cần clear browser cache 1 lần là xong

---

**Nếu vẫn không được, chụp ảnh màn hình console (F12 → Console tab) gửi cho tôi nhé!** 📸
