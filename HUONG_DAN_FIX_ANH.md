# Hướng Dẫn Fix Hình Ảnh Địa Điểm

## 🎯 Tổng Quan

Hệ thống đã được cải thiện để xử lý hình ảnh tốt hơn:
- ✅ Tự động fallback sang ảnh khác nếu ảnh đầu tiên lỗi
- ✅ Mỗi địa điểm có 3 ảnh từ các nguồn uy tín
- ✅ Hiển thị icon nếu tất cả ảnh đều lỗi

## 📊 Tình Trạng Hiện Tại

**Bến Tre:** 234/234 địa điểm có ảnh (100%)
- Tổng số ảnh: 684 ảnh (trung bình 3 ảnh/địa điểm)
- Nguồn ảnh: Booking.com, Agoda, TripAdvisor, Airbnb, Expedia

## 🛠️ Scripts Hữu Ích

### 1. Kiểm tra tình trạng ảnh
```bash
cd backend
node src/scripts/checkBenTreImages.js
```
Hiển thị thống kê: bao nhiêu địa điểm có/không có ảnh

### 2. Fix ảnh bị thiếu
```bash
node src/scripts/fixBenTreImages.js
```
Tự động lấy ảnh từ Google Images cho địa điểm không có ảnh

### 3. Thay thế ảnh Google proxy
```bash
node src/scripts/replaceGoogleProxyImagesBatch.js
```
Thay thế ảnh Google Maps proxy (bị chặn CORS) bằng ảnh công khai

### 4. Kiểm tra chi tiết URL ảnh
```bash
node src/scripts/inspectBenTreImages.js
```
Xem 20 địa điểm đầu tiên và URL ảnh của chúng

### 5. Test URL ảnh có load được không
```bash
node src/scripts/testImageUrls.js
```
Test xem URL ảnh nào bị lỗi 403, 404, timeout...

## 🔧 Component Frontend

### FallbackImage Component
Component mới được tạo để xử lý fallback ảnh tự động:

```tsx
<FallbackImage
  images={destination.images || []}
  alt={destination.name}
  className="w-full h-full object-cover"
  fallbackIcon="📍"
/>
```

**Cách hoạt động:**
1. Hiển thị ảnh đầu tiên (`images[0]`)
2. Nếu ảnh lỗi → tự động chuyển sang `images[1]`
3. Nếu `images[1]` lỗi → chuyển sang `images[2]`
4. Nếu tất cả ảnh lỗi → hiển thị icon fallback

## 🚀 Cách Thêm Ảnh Cho Tỉnh Mới

### Bước 1: Fetch từ SerpAPI
```bash
# Sửa file fetchSerpApiBenTre.js, thay "Bến Tre" bằng tỉnh mới
node src/scripts/fetchSerpApiBenTre.js
```

### Bước 2: Kiểm tra kết quả
```bash
# Thay "Bến Tre" trong script thành tỉnh mới
node src/scripts/checkBenTreImages.js
```

### Bước 3: Fix ảnh bị thiếu (nếu có)
```bash
node src/scripts/fixBenTreImages.js
```

## 📝 Lưu Ý

### Nguồn Ảnh Tốt
- ✅ Booking.com (cf.bstatic.com)
- ✅ Agoda (pix10.agoda.net)
- ✅ TripAdvisor (tripadvisor.com)
- ✅ Airbnb (muscache.com)
- ✅ Expedia (trvl-media.com)

### Nguồn Ảnh Nên Tránh
- ❌ Google Maps proxy (googleusercontent.com/gps) - Bị chặn CORS
- ❌ TikTok - Bị chặn hotlinking (403)
- ⚠️ YouTube thumbnails - Có thể bị giới hạn

## 🔐 API Keys

Hệ thống sử dụng 2 SerpAPI keys với cơ chế xoay vòng:
- Key 1 hết quota → tự động chuyển sang Key 2
- Cấu hình trong `.env`: `SERPAPI_KEYS=key1,key2`

## 🐛 Troubleshooting

### Vấn đề: Ảnh không hiển thị
**Giải pháp:**
1. Mở DevTools (F12) → Console
2. Xem lỗi CORS hoặc 403/404
3. Chạy `replaceGoogleProxyImagesBatch.js` để thay ảnh

### Vấn đề: Một số địa điểm vẫn mất ảnh
**Giải pháp:**
1. Chạy `checkBenTreImages.js` để xác định địa điểm nào
2. Chạy `fixBenTreImages.js` để tự động fix
3. Nếu vẫn lỗi, thêm ảnh thủ công qua Admin panel

### Vấn đề: SerpAPI hết quota
**Giải pháp:**
1. Thêm key mới vào `.env`: `SERPAPI_KEYS=key1,key2,key3`
2. Hệ thống tự động xoay vòng

## 📞 Liên Hệ

Nếu cần hỗ trợ thêm, vui lòng tạo issue hoặc liên hệ team dev.
