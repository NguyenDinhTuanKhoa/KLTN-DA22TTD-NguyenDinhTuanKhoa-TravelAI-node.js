# 📸 Hướng Dẫn Cập Nhật Ảnh Thực Tế Các Địa Điểm

## 🎯 Tổng Quan

Hiện tại các địa điểm Trà Vinh đang sử dụng ảnh stock từ Unsplash. Để có ảnh thực tế, bạn cần:

1. **Thu thập ảnh thực tế** từ các nguồn hợp pháp
2. **Upload ảnh lên Cloud Storage**
3. **Cập nhật URL ảnh vào database**

---

## 📍 Cách 1: Lấy Ảnh Từ Nguồn Công Khai

### Nguồn ảnh miễn phí chất lượng cao:

1. **Unsplash** (https://unsplash.com)
   - Tìm kiếm: "Vietnam temple", "Vietnam pagoda", "Wind turbines"
   - License: Miễn phí thương mại

2. **Pexels** (https://www.pexels.com)
   - Tìm kiếm tương tự Unsplash
   - License: Miễn phí

3. **Pixabay** (https://pixabay.com)
   - Nhiều ảnh Việt Nam
   - License: Miễn phí

4. **Google Images**
   - Tools → Usage Rights → "Creative Commons licenses"
   - Nhớ kiểm tra license!

### Từ khóa tìm kiếm gợi ý:

| Địa điểm | Keywords |
|----------|----------|
| Ao Bà Om | "Tra Vinh lake", "Vietnamese lake ancient trees", "peaceful lake Vietnam" |
| Chùa Vàm Ray | "Khmer pagoda Vietnam", "Vietnamese Buddhist temple golden", "Angkor style temple Vietnam" |
| Chùa Cò | "bird sanctuary Vietnam", "stork pagoda", "birds temple Vietnam" |
| Điện gió Duyên Hải | "wind turbines Vietnam", "wind farm beach", "offshore wind turbines" |
| Biển Ba Động | "remote beach Vietnam", "peaceful beach sunset", "sandy beach Vietnam" |
| Rừng ngập mặn | "mangrove forest Vietnam", "coastal wetland", "mangrove ecosystem" |

---

## 📍 Cách 2: Chụp Ảnh Thực Tế Tại Địa Điểm

### Checklist chụp ảnh:

- ✅ Độ phân giải tối thiểu: **1920x1080px**
- ✅ Định dạng: **JPG hoặc PNG**
- ✅ Chụp nhiều góc độ (ít nhất 3-5 ảnh/địa điểm)
- ✅ Chụp vào golden hour (sáng sớm hoặc chiều tà)
- ✅ Tránh chụp người quá rõ mặt (vấn đề privacy)

### Địa điểm cần ưu tiên:

1. **Chùa Vàm Ray** - Địa điểm nổi tiếng nhất
2. **Chùa Cò** - Độc đáo với đàn cò
3. **Điện gió Duyên Hải** - Hot trend check-in
4. **Ao Bà Om** - Di tích văn hóa quan trọng
5. **Biển Ba Động** - Bãi biển hoang sơ

---

## 📍 Cách 3: Upload Và Quản Lý Ảnh

### Option A: Sử dụng Cloudinary (Recommended) 🌟

**Ưu điểm:**
- Free tier: 25GB storage, 25GB bandwidth/tháng
- Tự động optimize ảnh
- CDN toàn cầu (load nhanh)
- Hỗ trợ resize, crop, transform

**Cách setup:**

1. **Đăng ký Cloudinary**
   ```
   https://cloudinary.com/users/register/free
   ```

2. **Lấy credentials**
   - Cloud name
   - API Key
   - API Secret

3. **Upload ảnh qua Dashboard**
   - Hoặc dùng API (xem script bên dưới)

4. **Copy URL ảnh**
   - Format: `https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.jpg`

### Option B: Sử dụng ImgBB (Miễn phí, đơn giản)

**Ưu điểm:**
- Hoàn toàn miễn phí
- Không cần đăng ký
- Upload nhanh

**Cách dùng:**

1. Truy cập: https://imgbb.com
2. Upload ảnh
3. Copy Direct Link
4. Dán vào database

### Option C: AWS S3 (Professional)

**Ưu điểm:**
- Tin cậy cao
- Tốc độ nhanh
- Tích hợp CloudFront CDN

**Chi phí:**
- ~$0.023/GB storage/tháng
- Free tier: 5GB storage 12 tháng đầu

---

## 🔧 Cách Cập Nhật Ảnh Vào Database

### Method 1: Qua Admin Dashboard (UI)

1. **Đăng nhập Admin**
   ```
   http://localhost:3000/admin
   Email: admin@travelai.com
   Password: admin123
   ```

2. **Vào Destinations Management**
   ```
   http://localhost:3000/admin/destinations
   ```

3. **Click "Edit" trên địa điểm cần cập nhật**

4. **Paste URL ảnh mới vào field "Images"**

5. **Save**

### Method 2: Qua API (Postman)

```bash
PUT http://localhost:5001/api/destinations/{destination_id}
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "images": [
    "https://res.cloudinary.com/your-cloud/image/upload/ao-ba-om-1.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/ao-ba-om-2.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/ao-ba-om-3.jpg"
  ]
}
```

### Method 3: Dùng Script Helper

Tôi đã tạo sẵn script `updateDestinationImages.js` (xem bên dưới)

```bash
cd backend
node src/scripts/updateDestinationImages.js
```

---

## 🚀 Script Helper: Cập Nhật Ảnh Hàng Loạt

### File: `backend/src/scripts/updateDestinationImages.js`

```javascript
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Destination = require('../models/Destination');

// 🖼️ Mapping: Tên địa điểm → URL ảnh mới
const imageUpdates = {
  'Ao Bà Om': [
    'https://example.com/ao-ba-om-1.jpg',
    'https://example.com/ao-ba-om-2.jpg',
  ],
  'Chùa Vàm Ray (Ang Pagoda)': [
    'https://example.com/chua-vam-ray-1.jpg',
    'https://example.com/chua-vam-ray-2.jpg',
  ],
  'Điện gió Duyên Hải': [
    'https://example.com/dien-gio-1.jpg',
    'https://example.com/dien-gio-2.jpg',
  ],
  // ... Thêm các địa điểm khác
};

const updateImages = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected!');

    let updated = 0;
    for (const [name, images] of Object.entries(imageUpdates)) {
      const result = await Destination.updateOne(
        { name },
        { $set: { images } }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Updated: ${name}`);
        updated++;
      } else {
        console.log(`⚠️  Not found: ${name}`);
      }
    }

    console.log(`\n🎉 Updated ${updated}/${Object.keys(imageUpdates).length} destinations`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

updateImages();
```

**Cách dùng:**

1. Sửa object `imageUpdates` với URL ảnh thực tế
2. Run: `node src/scripts/updateDestinationImages.js`

---

## 📋 Checklist Hoàn Thành

### Địa Điểm Trà Vinh (14 địa điểm)

- [ ] **Ao Bà Om** - Hồ nước cổ thụ
- [ ] **Biển Ba Động** - Bãi biển hoang sơ
- [ ] **Rừng ngập mặn Long Khánh** - Hệ sinh thái
- [ ] **Điện gió Duyên Hải** - Cánh đồng quạt gió
- [ ] **Cồn Chim** - Du lịch cộng đồng
- [ ] **Cù lao Tân Quy** - Vườn trái cây
- [ ] **Cù lao Long Trị** - Sinh thái miệt vườn
- [ ] **Khu du lịch Huỳnh Kha** - Khu vui chơi
- [ ] **Chùa Âng** - Chùa Khmer cổ
- [ ] **Chùa Vàm Ray** - Chùa lớn nhất VN
- [ ] **Chùa Cò** - Chùa có đàn cò
- [ ] **Nhà thờ Mặc Bắc** - Nhà thờ cổ
- [ ] **Đền thờ Chủ tịch HCM** - Di tích lịch sử
- [ ] **Bảo tàng Văn hóa Khmer** - Văn hóa dân tộc

---

## 💡 Tips & Best Practices

### 1. Tối ưu SEO
- Đặt tên file ảnh có ý nghĩa: `chua-vam-ray-chinh-dien.jpg`
- Thêm alt text khi hiển thị
- Sử dụng WebP format nếu có thể

### 2. Hiệu suất
- Resize ảnh về kích thước hợp lý (1920px là max)
- Compress trước khi upload
- Sử dụng CDN để load nhanh

### 3. Bảo mật & Bản quyền
- Không upload ảnh có watermark
- Xin phép nếu ảnh có người rõ mặt
- Ghi nguồn nếu ảnh không phải tự chụp

### 4. Độ đa dạng
- Mỗi địa điểm nên có 3-5 ảnh
- Các góc độ khác nhau
- Cả ngày và đêm (nếu có)
- Cả mùa khô và mùa mưa

---

## 🆘 Troubleshooting

### Ảnh không hiển thị trên frontend?

**Nguyên nhân:**
- URL ảnh sai
- CORS blocked
- Image hosting down

**Giải pháp:**
1. Check URL bằng cách mở trực tiếp trong browser
2. Check console log của browser (F12 → Console)
3. Thử URL khác

### Ảnh load chậm?

**Giải pháp:**
- Dùng CDN (Cloudinary, AWS CloudFront)
- Compress ảnh trước khi upload
- Lazy loading (đã có sẵn trong Next.js Image component)

### Database connection error?

**Giải pháp:**
```bash
# Check MongoDB URI
echo $MONGODB_URI

# Restart backend
cd backend
npm run dev
```

---

## 📞 Liên Hệ & Hỗ Trợ

Nếu cần hỗ trợ:
1. Mở issue trên GitHub
2. Email: support@travelai.com
3. Telegram: @travelai_support

---

**Chúc bạn thành công! 🎉**
