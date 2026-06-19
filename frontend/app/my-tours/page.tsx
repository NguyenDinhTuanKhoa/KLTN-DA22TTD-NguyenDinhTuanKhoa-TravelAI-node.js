'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TourDetailModal, { PRICE_CONFIG, useTourSaved } from '../components/TourDetailModal';
import { toggleSavedTour, type Tour } from '../lib/savedTours';

// ── Mock Community Tours Data ──────────────────────────────────────────────────
const COMMUNITY_TOURS: Tour[] = [
  {
    id: 'ct-1',
    title: '2 Ngày Tại Trà Vinh — Khám Phá Văn Hoá Khmer',
    coverImage: 'https://ik.imagekit.io/tvlk/blog/2022/02/dia-diem-du-lich-tra-vinh-cover.jpeg',
    duration: '2 ngày 1 đêm',
    days: 2,
    category: 'Di sản',
    categoryIcon: '🏛️',
    region: 'Tây Nam Bộ',
    priceRange: 'budget',
    priceLabel: '1.500.000 ₫',
    rating: 4.8,
    reviewCount: 127,
    viewCount: 3420,
    tags: ['Văn hóa Khmer', 'Chùa chiền', 'Ẩm thực địa phương', 'Thiên nhiên'],
    highlights: ['Ao Bà Om huyền bí', 'Bảo tàng Văn hóa Khmer', 'Chùa Âng 1.000 năm tuổi', 'Cồn Chim sinh thái'],
    badge: '🔥 Phổ biến nhất',
    badgeColor: 'bg-red-500',
    author: 'Minh Khoa',
    authorAvatar: 'MK',
    completedDate: '03/2026',
    description: 'Hành trình 2 ngày khám phá Trà Vinh — vùng đất của những ngôi chùa Khmer cổ kính, ao sen bát ngát và ẩm thực độc đáo. Thích hợp cho những ai muốn thoát khỏi nhịp sống thành thị và tìm về bình yên.',
    stops: [
      { name: 'Ao Bà Om', city: 'Trà Vinh', image: 'https://thamhiemmekong.com/wp-content/uploads/2020/06/aobaom-02.jpg', category: 'nature', rating: 4.8, description: 'Hồ nước linh thiêng của người Khmer', coordinates: { lat: 9.91761, lng: 106.30409 } },
      { name: 'Bảo tàng Văn hóa Khmer', city: 'Trà Vinh', image: 'https://images.vietnamtourism.gov.vn/vn//images/2024/thang_5/0805.nhabaotang_tra_vinh.jpg', category: 'heritage', rating: 4.1, description: 'Bộ sưu tập hiện vật văn hóa Khmer lớn nhất miền Nam', coordinates: { lat: 9.91704, lng: 106.30534 } },
      { name: 'Đền thờ Chủ tịch Hồ Chí Minh', city: 'Trà Vinh', image: 'https://ta-img.tatinta.com/resize/1024/webp/destination/file-1732161953434.jpg', category: 'heritage', rating: 4.5, description: 'Công trình tưởng niệm điêu khắc tinh xảo', coordinates: { lat: 9.9846, lng: 106.33025 } },
      { name: 'Cồn Chim', city: 'Trà Vinh', image: 'https://i.ytimg.com/vi/Ly1r45dNJzg/maxresdefault.jpg', category: 'nature', rating: 4.5, description: 'Khu sinh thái cồn đảo giữa sông Cổ Chiên', coordinates: { lat: 9.92177, lng: 106.42289 } },
      { name: 'Chùa Cò (Nodol Pagoda)', city: 'Trà Vinh', image: 'https://thamhiemmekong.com/wp-content/uploads/2020/04/chuaco.jpg', category: 'heritage', rating: 4.7, description: 'Hàng nghìn con cò trú ngụ trên cây cổ thụ', coordinates: { lat: 9.64448, lng: 106.30332 } },
      { name: 'Chùa Vàm Ray (Ang Pagoda)', city: 'Trà Vinh', image: 'https://thamhiemmekong.com/wp-content/uploads/2020/03/chuavamraytravinh-1.jpg', category: 'heritage', rating: 4.8, description: 'Ngôi chùa Khmer đẹp nhất miền Tây', coordinates: { lat: 9.65635, lng: 106.27513 } },
      { name: 'Rừng ngập mặn Long Khánh', city: 'Trà Vinh', image: 'https://exotrails.com/explore/wp-content/uploads/2024/11/50371ca8-ff49-4a2e-9666-2910ebbfee8f.png', category: 'nature', rating: 4.4, description: 'Hệ sinh thái rừng ngập mặn nguyên sinh', coordinates: { lat: 9.6519, lng: 106.5089 } },
      { name: 'Biển Ba Động', city: 'Trà Vinh', image: 'https://dulichviet.com.vn/images/bandidau/bien-ba-dong-dia-diem-thu-hut-dong-dao-khach-du-lich-tai-tra-vinh.jpg', category: 'beach', rating: 4.2, description: 'Bãi biển hoang sơ cuối tỉnh Trà Vinh', coordinates: { lat: 9.61973, lng: 106.558 } },
    ],
    reviews: [
      { name: 'Lan Anh', avatar: 'LA', date: '04/2026', rating: 5, text: 'Chuyến đi tuyệt vời! Ao Bà Om đẹp hơn mình tưởng rất nhiều. Người dân thân thiện, đồ ăn ngon, giá rẻ. Chắc chắn sẽ quay lại!', helpful: 34 },
      { name: 'Quang Bình', avatar: 'QB', date: '03/2026', rating: 5, text: 'Mình đi theo đúng lịch trình này, cực kỳ hợp lý. Chùa Vàm Ray là điểm nhấn thực sự không thể bỏ qua. Recommend!', helpful: 22 },
      { name: 'Thu Hà', avatar: 'TH', date: '02/2026', rating: 4, text: 'Khá ok nhưng đoạn đường từ Cồn Chim về thành phố hơi xa. Nên thuê xe máy thay vì taxi sẽ tiết kiệm hơn nhiều.', helpful: 15 },
    ],
  },
  {
    id: 'ct-2',
    title: 'Hội An — Đà Nẵng Huyền Bí 5N4Đ',
    coverImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=900&q=80',
    duration: '5 ngày 4 đêm',
    days: 5,
    category: 'Di sản',
    categoryIcon: '🏛️',
    region: 'Miền Trung',
    priceRange: 'mid-range',
    priceLabel: '8.500.000 ₫',
    rating: 4.9,
    reviewCount: 589,
    viewCount: 15200,
    tags: ['Di sản UNESCO', 'Ẩm thực', 'Phố cổ', 'Biển'],
    highlights: ['Phố cổ Hội An về đêm', 'Cầu Vàng Bà Nà Hills', 'Mì Quảng & Cao Lầu', 'Bãi biển Mỹ Khê'],
    badge: '⭐ Được yêu thích',
    badgeColor: 'bg-amber-500',
    author: 'Phương Linh',
    authorAvatar: 'PL',
    completedDate: '03/2026',
    description: 'Hành trình 5 ngày khám phá 2 thành phố biển đẹp nhất miền Trung. Kết hợp giữa văn hóa cổ kính của Hội An và sự hiện đại năng động của Đà Nẵng.',
    stops: [
      { name: 'Phố cổ Hội An', city: 'Hội An', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&q=80', category: 'heritage', rating: 4.9, description: 'Di sản văn hóa thế giới UNESCO', coordinates: { lat: 15.8801, lng: 108.338 } },
      { name: 'Cù Lao Chàm', city: 'Hội An', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80', category: 'island', rating: 4.7, description: 'Đảo san hô tuyệt đẹp cách bờ 15km', coordinates: { lat: 15.95897, lng: 108.5073 } },
      { name: 'Bà Nà Hills — Cầu Vàng', city: 'Đà Nẵng', image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=80', category: 'mountain', rating: 4.8, description: 'Cây cầu vàng nổi tiếng thế giới', coordinates: { lat: 15.99494, lng: 107.99656 } },
      { name: 'Bãi biển Mỹ Khê', city: 'Đà Nẵng', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', category: 'beach', rating: 4.6, description: 'Một trong những bãi biển đẹp nhất châu Á', coordinates: { lat: 16.0544, lng: 108.2479 } },
      { name: 'Ngũ Hành Sơn', city: 'Đà Nẵng', image: 'https://images.unsplash.com/photo-1533002832-1721d16b4bb9?w=400&q=80', category: 'heritage', rating: 4.5, description: 'Cụm núi đá cẩm thạch huyền bí', coordinates: { lat: 16.00371, lng: 108.26316 } },
    ],
    reviews: [
      { name: 'Văn Nam', avatar: 'VN', date: '04/2026', rating: 5, text: 'Tour hoàn hảo! 5 ngày trải dài từ phố cổ Hội An đến Cầu Vàng đều rất cân bằng. Không quá gấp, không nhàm chán.', helpful: 88 },
      { name: 'Bích Ngọc', avatar: 'BN', date: '03/2026', rating: 5, text: 'Đây là chuyến đi đẹp nhất mình từng có. Hội An ban đêm rực rỡ đèn lồng thật sự mê hồn!', helpful: 65 },
      { name: 'Tuấn Anh', avatar: 'TA', date: '02/2026', rating: 4, text: 'Rất tốt nhưng Bà Nà hơi đông người, nên đi sớm vào buổi sáng. Phần ẩm thực thì không chê được!', helpful: 41 },
    ],
  },
  {
    id: 'ct-3',
    title: 'Sa Pa — Chinh Phục Nóc Nhà Đông Dương',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
    duration: '4 ngày 3 đêm',
    days: 4,
    category: 'Núi',
    categoryIcon: '🏔️',
    region: 'Tây Bắc',
    priceRange: 'mid-range',
    priceLabel: '5.900.000 ₫',
    rating: 4.7,
    reviewCount: 342,
    viewCount: 8760,
    tags: ['Trekking', 'Văn hóa H\'Mông', 'Núi cao', 'Homestay'],
    highlights: ['Đỉnh Fansipan 3.143m', 'Ruộng bậc thang Mù Cang Chải', 'Bản H\'Mông', 'Chợ Bắc Hà'],
    badge: '🏔️ Thách thức',
    badgeColor: 'bg-emerald-600',
    author: 'Hùng Cường',
    authorAvatar: 'HC',
    completedDate: '02/2026',
    description: 'Hành trình trekking 4 ngày chinh phục Fansipan và khám phá văn hóa các dân tộc thiểu số. Cần thể lực tốt, nhưng phong cảnh sẽ đền đáp xứng đáng.',
    stops: [
      { name: 'Thị trấn Sa Pa', city: 'Lào Cai', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', category: 'city', rating: 4.6, description: 'Thị trấn sương mù lãng mạn', coordinates: { lat: 22.3364, lng: 103.8438 } },
      { name: 'Đỉnh Fansipan', city: 'Lào Cai', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80', category: 'mountain', rating: 4.9, description: 'Nóc nhà Đông Dương ở độ cao 3.143m', coordinates: { lat: 22.33498, lng: 103.84447 } },
      { name: 'Bản Cát Cát', city: 'Sa Pa', image: 'https://images.unsplash.com/photo-1535268244668-0bbb6573a3f5?w=400&q=80', category: 'countryside', rating: 4.4, description: 'Bản người H\'Mông cổ kính', coordinates: { lat: 22.327, lng: 103.831 } },
      { name: 'Ruộng bậc thang Mù Cang Chải', city: 'Yên Bái', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80', category: 'countryside', rating: 4.8, description: 'Kỳ quan ruộng bậc thang đẹp nhất Việt Nam', coordinates: { lat: 21.8333, lng: 104.0667 } },
    ],
    reviews: [
      { name: 'Dũng Mạnh', avatar: 'DM', date: '03/2026', rating: 5, text: 'Fansipan bằng cáp treo rất thuận tiện, cảnh trên đỉnh tuyệt vời. Nhưng đường xuống đi bộ rất thử thách, cần chuẩn bị giày tốt!', helpful: 56 },
      { name: 'Hoa Trúc', avatar: 'HT', date: '02/2026', rating: 4, text: 'Homestay tại bản H\'Mông là trải nghiệm không thể quên. Gia đình chủ nhà cực thân thiện và đồ ăn ngon!', helpful: 38 },
    ],
  },
  {
    id: 'ct-4',
    title: 'Phú Quốc Đảo Ngọc — Kỳ Nghỉ Sang Trọng',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80',
    duration: '4 ngày 3 đêm',
    days: 4,
    category: 'Biển',
    categoryIcon: '🏖️',
    region: 'Đồng bằng SCL',
    priceRange: 'luxury',
    priceLabel: '12.000.000 ₫',
    rating: 4.8,
    reviewCount: 421,
    viewCount: 11300,
    tags: ['Resort 5★', 'Lặn biển', 'Hoàng hôn', 'Hải sản'],
    highlights: ['Lặn ngắm san hô An Thới', 'Hoàng hôn Mũi Ông Đội', 'Vinpearl Safari', 'Chợ đêm Dinh Cậu'],
    badge: '👑 Premium',
    badgeColor: 'bg-violet-600',
    author: 'Thanh Thảo',
    authorAvatar: 'TT',
    completedDate: '01/2026',
    description: 'Kỳ nghỉ xa xỉ 4 ngày trên đảo ngọc Phú Quốc. Từ resort 5 sao ven biển đến lặn ngắm san hô và thưởng thức hải sản tươi sống dưới ánh hoàng hôn.',
    stops: [
      { name: 'Bãi Dài — Phú Quốc', city: 'Kiên Giang', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', category: 'beach', rating: 4.9, description: 'Bãi biển dài nhất Phú Quốc', coordinates: { lat: 10.3197, lng: 103.8497 } },
      { name: 'Vinpearl Safari', city: 'Phú Quốc', image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&q=80', category: 'nature', rating: 4.7, description: 'Khu bảo tồn động vật hoang dã lớn nhất VN', coordinates: { lat: 10.33704, lng: 103.89145 } },
      { name: 'Quần đảo An Thới', city: 'Phú Quốc', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80', category: 'island', rating: 4.8, description: 'Lặn ngắm san hô đẹp nhất Phú Quốc', coordinates: { lat: 10.0167, lng: 104.0167 } },
      { name: 'Chợ đêm Dinh Cậu', city: 'Phú Quốc', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&q=80', category: 'city', rating: 4.5, description: 'Chợ hải sản và ẩm thực nhộn nhịp nhất', coordinates: { lat: 10.2167, lng: 103.9583 } },
    ],
    reviews: [
      { name: 'Minh Châu', avatar: 'MC', date: '02/2026', rating: 5, text: 'Chuyến đi honeymoon hoàn hảo! Resort view biển tuyệt đẹp, hải sản tươi ngon. Sẽ quay lại năm sau!', helpful: 72 },
      { name: 'Khánh An', avatar: 'KA', date: '01/2026', rating: 5, text: 'Lặn ngắm san hô ở An Thới là trải nghiệm đỉnh nhất. Nước trong và san hô đẹp hơn cả Nha Trang!', helpful: 58 },
      { name: 'Bảo Long', avatar: 'BL', date: '12/2025', rating: 4, text: 'Khá đắt nhưng xứng đáng với chất lượng. Chỉ cần lưu ý book sớm vì mùa cao điểm rất đông.', helpful: 33 },
    ],
  },
  {
    id: 'ct-5',
    title: 'Đà Lạt — Thành Phố Ngàn Hoa 3N2Đ',
    coverImage: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&q=80',
    duration: '3 ngày 2 đêm',
    days: 3,
    category: 'Thành phố',
    categoryIcon: '🌸',
    region: 'Tây Nguyên',
    priceRange: 'budget',
    priceLabel: '3.200.000 ₫',
    rating: 4.6,
    reviewCount: 278,
    viewCount: 7890,
    tags: ['Hoa đào', 'Cà phê', 'Thác nước', 'Vườn dâu'],
    highlights: ['Vườn hoa thành phố', 'Thác Datanla', 'Cáp treo Lang Biang', 'Phố cà phê về đêm'],
    badge: '🌸 Lãng mạn',
    badgeColor: 'bg-pink-500',
    author: 'Ngọc Bích',
    authorAvatar: 'NB',
    completedDate: '03/2026',
    description: 'Đà Lạt 3 ngày nhẹ nhàng và thư thái. Thành phố ngàn hoa với không khí se lạnh, những vườn dâu tây ngọt lịm và cà phê sữa nóng buổi sáng.',
    stops: [
      { name: 'Hồ Xuân Hương', city: 'Đà Lạt', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&q=80', category: 'nature', rating: 4.6, description: 'Hồ nước giữa lòng thành phố', coordinates: { lat: 11.94074, lng: 108.44154 } },
      { name: 'Vườn hoa thành phố Đà Lạt', city: 'Đà Lạt', image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc9e?w=400&q=80', category: 'nature', rating: 4.7, description: 'Muôn loài hoa rực rỡ', coordinates: { lat: 11.95025, lng: 108.44983 } },
      { name: 'Thác Datanla', city: 'Đà Lạt', image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80', category: 'nature', rating: 4.5, description: 'Thác nước đẹp + trò chơi mạo hiểm', coordinates: { lat: 11.90343, lng: 108.4497 } },
      { name: 'Đồi chè Cầu Đất', city: 'Đà Lạt', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&q=80', category: 'countryside', rating: 4.8, description: 'Đồn điền chè xanh mướt tuyệt đẹp', coordinates: { lat: 11.87908, lng: 108.56051 } },
      { name: 'Làng Cù Lần', city: 'Đà Lạt', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80', category: 'countryside', rating: 4.4, description: 'Làng du lịch sinh thái yên bình', coordinates: { lat: 12.02601, lng: 108.3637 } },
    ],
    reviews: [
      { name: 'Hương Giang', avatar: 'HG', date: '04/2026', rating: 5, text: 'Đà Lạt mùa này đẹp quá! Đồi chè Cầu Đất mình chụp ảnh cả tiếng đồng hồ. Tour này rất hợp lý cho couple!', helpful: 44 },
      { name: 'Phúc Lộc', avatar: 'PL', date: '03/2026', rating: 4, text: 'Lịch trình nhàn, không quá nhiều điểm nhưng mỗi nơi đều có thời gian chill. Đúng kiểu nghỉ dưỡng.', helpful: 29 },
    ],
  },
  {
    id: 'ct-6',
    title: 'Ninh Bình — Cố Đô Hoa Lư & Tràng An',
    coverImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=900&q=80',
    duration: '2 ngày 1 đêm',
    days: 2,
    category: 'Di sản',
    categoryIcon: '🏛️',
    region: 'Miền Bắc',
    priceRange: 'budget',
    priceLabel: '2.800.000 ₫',
    rating: 4.7,
    reviewCount: 195,
    viewCount: 5430,
    tags: ['Tràng An', 'Chèo thuyền', 'Cố đô', 'Hang động'],
    highlights: ['Tràng An - Di sản hỗn hợp UNESCO', 'Tam Cốc chèo thuyền', 'Cố đô Hoa Lư', 'Bích Động 3 tầng'],
    badge: '✨ Trending',
    badgeColor: 'bg-sky-500',
    author: 'Đức Anh',
    authorAvatar: 'DA',
    completedDate: '02/2026',
    description: 'Hành trình 2 ngày khám phá cố đô ngàn năm lịch sử. Chèo thuyền qua hang động kỳ bí, ngắm ruộng lúa xanh mướt và chiêm ngưỡng kiến trúc triều Đinh.',
    stops: [
      { name: 'Tràng An Scenic Landscape', city: 'Ninh Bình', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&q=80', category: 'heritage', rating: 4.9, description: 'Di sản hỗn hợp thiên nhiên - văn hóa UNESCO', coordinates: { lat: 20.2526, lng: 105.9184 } },
      { name: 'Tam Cốc — Bích Động', city: 'Ninh Bình', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80', category: 'nature', rating: 4.7, description: 'Chèo thuyền qua hang động tuyệt đẹp', coordinates: { lat: 20.21851, lng: 105.91755 } },
      { name: 'Cố đô Hoa Lư', city: 'Ninh Bình', image: 'https://images.unsplash.com/photo-1533002832-1721d16b4bb9?w=400&q=80', category: 'heritage', rating: 4.5, description: 'Kinh đô đầu tiên của nhà nước phong kiến VN', coordinates: { lat: 20.2856, lng: 105.9117 } },
      { name: 'Hang Múa', city: 'Ninh Bình', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80', category: 'nature', rating: 4.6, description: '500 bậc thang lên đỉnh nhìn toàn cảnh Ninh Bình', coordinates: { lat: 20.23101, lng: 105.9378 } },
    ],
    reviews: [
      { name: 'Kỳ Dương', avatar: 'KD', date: '03/2026', rating: 5, text: 'Tràng An đẹp hơn cả tranh vẽ! Được chèo thuyền qua hang động là trải nghiệm không tưởng. Hoàn toàn xứng đáng.', helpful: 61 },
      { name: 'Mai Linh', avatar: 'ML', date: '02/2026', rating: 5, text: 'Hang Múa leo hơi mệt nhưng view đỉnh hoàn toàn bù đắp. Đừng bỏ qua nhé!', helpful: 45 },
    ],
  },
  {
    id: 'ct-7',
    title: '2 Ngày Tại Bến Tre — Trải Nghiệm Sông Nước Xứ Dừa',
    coverImage: 'https://phetravel.com/uploads/du-lich-ben-tre-1.webp',
    duration: '2 ngày 1 đêm',
    days: 2,
    category: 'Di sản',
    categoryIcon: '🥥',
    region: 'Tây Nam Bộ',
    priceRange: 'budget',
    priceLabel: '1.200.000 ₫',
    rating: 4.7,
    reviewCount: 98,
    viewCount: 2850,
    tags: ['Xứ dừa', 'Du lịch miệt vườn', 'Đèo chèo xuồng', 'Di tích'],
    highlights: ['Khám phá Cồn Phụng sinh thái', 'Chèo xuồng ba lá tại Lan Vương', 'Ngắm chim tại Vàm Hồ', 'Viếng lăng cụ Nguyễn Đình Chiểu'],
    badge: '🌴 Sinh thái',
    badgeColor: 'bg-emerald-500',
    author: 'Thanh Nhàn',
    authorAvatar: 'TN',
    completedDate: '04/2026',
    description: 'Hành trình 2 ngày hòa mình vào thiên nhiên thanh bình của Bến Tre. Trải nghiệm cuộc sống người dân xứ dừa, đi thuyền ba lá, thưởng thức kẹo dừa nóng hổi và nghe đờn ca tài tử.',
    stops: [
      { name: 'Cồn Phụng', city: 'Bến Tre', image: 'https://ik.imagekit.io/tvlk/blog/2022/11/khu-du-lich-con-phung-4.jpg', category: 'nature', rating: 4.7, description: 'Khu du lịch sinh thái nổi tiếng giữa sông Tiền', coordinates: { lat: 10.32689, lng: 106.34986 } },
      { name: 'Khu du lịch Lan Vương', city: 'Bến Tre', image: 'https://vietthangtravel.com/thumbs/800x533x2/upload/product/khu-du-lich-lan-vuong-ben-tre-diem-vui-choi-cuc-hut-khach-01-1667253572-4151.jpeg', category: 'countryside', rating: 4.6, description: 'Điểm vui chơi miệt vườn sông nước đậm chất Tây Nam Bộ', coordinates: { lat: 10.20858, lng: 106.3707 } },
      { name: 'Sân chim Vàm Hồ', city: 'Bến Tre', image: 'https://owa.bestprice.vn/images/destinations/uploads/san-chim-vam-ho-5435e982807dc.jpg', category: 'nature', rating: 4.5, description: 'Nơi cư trú của hàng ngàn cá thể chim và cò trắng', coordinates: { lat: 10.15813, lng: 106.61549 } },
      { name: 'Lăng mộ Nguyễn Đình Chiểu', city: 'Bến Tre', image: 'https://thamhiemmekong.com/wp-content/uploads/2020/06/langmonguyendinhchieu.jpg', category: 'heritage', rating: 4.8, description: 'Khu di tích lịch sử thờ nhà thơ yêu nước nổi tiếng', coordinates: { lat: 10.0689, lng: 106.6011 } },
    ],
    reviews: [
      { name: 'Tuấn Khải', avatar: 'TK', date: '04/2026', rating: 5, text: 'Lan Vương vui cực kỳ! Chèo xuồng ngã ướt sũng nhưng rất sướng. Kẹo dừa mua tại lò ăn nóng siêu ngon.', helpful: 25 },
      { name: 'Hồng Vân', avatar: 'HV', date: '03/2026', rating: 4, text: 'Không khí trong lành, ẩm thực miền Tây tuyệt vời đặc biệt là cá lóc nướng trui cuốn lá sen non.', helpful: 14 }
    ]
  },
  {
    id: 'ct-8',
    title: '3 Ngày Hà Giang — Chinh Phục Con Đường Hạnh Phúc',
    coverImage: 'http://tuyengiao.hagiang.gov.vn/upload/64711/20221110/grabca3efcot_co_lung_cu_nguoiduatinvn_11.jpg',
    duration: '3 ngày 2 đêm',
    days: 3,
    category: 'Núi',
    categoryIcon: '🏔️',
    region: 'Đông Bắc',
    priceRange: 'mid-range',
    priceLabel: '4.500.000 ₫',
    rating: 4.9,
    reviewCount: 215,
    viewCount: 9280,
    tags: ['Đèo hiểm trở', 'Văn hóa Mông', 'Cao nguyên đá', 'Cột cờ quốc gia'],
    highlights: ['Chinh phục đèo Mã Pí Lèng', 'Cột cờ Lũng Cú cực Bắc', 'Dinh thự họ Vương cổ kính', 'Dạo quanh Phố cổ Đồng Văn'],
    badge: '🏔️ Mạo hiểm',
    badgeColor: 'bg-orange-600',
    author: 'Hoàng Lâm',
    authorAvatar: 'HL',
    completedDate: '04/2026',
    description: 'Hành trình 3 ngày chinh phục Hà Giang kỳ vĩ. Đi qua những con đèo uốn lượn bên vách đá dựng đứng, gặp gỡ đồng bào vùng cao và ngắm cột cờ địa đầu tổ quốc.',
    stops: [
      { name: 'Cột cờ Lũng Cú', city: 'Hà Giang', image: 'https://ik.imagekit.io/tvlk/blog/2023/06/cot-co-lung-cu-1.jpg', category: 'heritage', rating: 4.9, description: 'Điểm cực Bắc thiêng liêng của Tổ quốc', coordinates: { lat: 23.3667, lng: 105.3167 } },
      { name: 'Phố cổ Đồng Văn', city: 'Hà Giang', image: 'https://images2.thanhnien.vn/528068263637045248/2024/10/1/h4-1727757960262146313542.png', category: 'city', rating: 4.7, description: 'Khu phố cổ kính nằm lọt thỏm giữa cao nguyên đá', coordinates: { lat: 23.2833, lng: 105.3667 } },
      { name: 'Dinh thự họ Vương (Dinh Vua Mèo)', city: 'Hà Giang', image: 'https://hanoitourist.vn/sites/default/files/2024/05/DINH-THU-VUA-MEO.jpg', category: 'heritage', rating: 4.8, description: 'Kiệt tác kiến trúc cổ kính của vương triều H\'Mông xưa', coordinates: { lat: 23.25521, lng: 105.2626 } },
      { name: 'Đèo Mã Pí Lèng', city: 'Hà Giang', image: 'https://mia.vn/media/uploads/blog-du-lich/chinh-phuc-deo-ma-pi-leng-tu-dai-dinh-deo-cua-vung-nui-dat-bac-1642065331.jpg', category: 'mountain', rating: 5.0, description: 'Một trong tứ đại đỉnh đèo hiểm trở bậc nhất Việt Nam', coordinates: { lat: 23.24, lng: 105.4 } },
    ],
    reviews: [
      { name: 'Anh Quân', avatar: 'AQ', date: '04/2026', rating: 5, text: 'Đèo Mã Pí Lèng nhìn xuống sông Nho Quế đẹp đến nín thở. Khuyên mọi người nên tự thuê xe máy chạy trải nghiệm!', helpful: 56 },
      { name: 'Diệu Thảo', avatar: 'DT', date: '03/2026', rating: 5, text: 'Dinh Vua Mèo mang vẻ huyền bí cổ kính rất đáng đi. Con người Hà Giang hiền hòa mến khách.', helpful: 31 }
    ]
  },
  {
    id: 'ct-9',
    title: '2 Ngày Du Ngoạn Vịnh Hạ Long — Kỳ Quan Thiên Nhiên',
    coverImage: 'https://halongbay.com.vn/Data/files/B%E1%BB%A9c%20tranh%20thu%E1%BB%B7%20m%E1%BA%B7c%204_Nh%C3%A2n%20d%C3%A2n.png',
    duration: '2 ngày 1 đêm',
    days: 2,
    category: 'Biển',
    categoryIcon: '🏖️',
    region: 'Miền Bắc',
    priceRange: 'mid-range',
    priceLabel: '3.500.000 ₫',
    rating: 4.8,
    reviewCount: 340,
    viewCount: 11000,
    tags: ['Vịnh biển', 'Du thuyền', 'Hang động', 'Kỳ quan UNESCO'],
    highlights: ['Nghỉ dưỡng trên du thuyền 5★', 'Ngắm toàn cảnh vịnh từ đỉnh Ti Tốp', 'Khám phá Hang Sửng Sốt kỳ vĩ', 'Dạo quanh Chợ đêm Hạ Long'],
    badge: '🔥 Hot',
    badgeColor: 'bg-red-500',
    author: 'Khánh Linh',
    authorAvatar: 'KL',
    completedDate: '04/2026',
    description: 'Hành trình 2 ngày 1 đêm du ngoạn trên Vịnh Hạ Long. Trải nghiệm ngủ đêm trên du thuyền sang trọng, chèo thuyền kayak qua các hang động đá vôi cổ kính.',
    stops: [
      { name: 'Vịnh Hạ Long', city: 'Quảng Ninh', image: 'https://nhandan.vn/special/30-nam-mot-chang-duong-di-san-Vinh-Ha-Long/assets/HLCklusX0n/things-to-do-in-ha-long-bay-banner-1-1920x1080.jpg', category: 'nature', rating: 4.9, description: 'Di sản thiên nhiên thế giới UNESCO', coordinates: { lat: 20.9101, lng: 107.1839 } },
      { name: 'Đảo Ti Tốp', city: 'Hạ Long', image: 'https://statics.vinpearl.com/dao-titop-quang-ninh-02_1625285135.jpg', category: 'island', rating: 4.7, description: 'Bãi tắm hình vầng trăng khuyết tuyệt đẹp', coordinates: { lat: 20.85908, lng: 107.08015 } },
      { name: 'Hang Sửng Sốt', city: 'Hạ Long', image: 'https://www.vietnamairlines.com/content/dam/legacy-site-assets/SEO-images/2025%20SEO/Traffic%20TA/MB/sung-sot-cave/morning-tours-typically-offer-cooler-temperatures-and-better-lighting-for-photography-inside-the-cave.jpg', category: 'nature', rating: 4.8, description: 'Hang động thạch nhũ hoành tráng nhất vịnh', coordinates: { lat: 20.84398, lng: 107.09148 } },
      { name: 'Chợ đêm Hạ Long', city: 'Hạ Long', image: 'https://vivuhalong.com/wp-content/uploads/2024/07/cho-dem-hl.jpg', category: 'city', rating: 4.5, description: 'Khu mua sắm hải sản và quà lưu niệm sầm uất', coordinates: { lat: 20.95034, lng: 107.04367 } }
    ],
    reviews: [
      { name: 'Ngọc Minh', avatar: 'NM', date: '04/2026', rating: 5, text: 'Trải nghiệm ngủ đêm trên du thuyền tuyệt vời lắm mọi người ơi. Bình minh trên vịnh đẹp vô cùng.', helpful: 42 },
      { name: 'Hoàng Bách', avatar: 'HB', date: '03/2026', rating: 4, text: 'Hang Sửng Sốt đi bộ hơi mệt nhưng vào trong thạch nhũ cực kỳ hoành tráng.', helpful: 18 }
    ]
  },
  {
    id: 'ct-10',
    title: '3 Ngày Khám Phá Cố Đô Huế Cổ Kính',
    coverImage: 'https://khamphahue.com.vn/Portals/0/KhamPha/DiTich-DiSan/DanhLamThangCanh/LangTam/QuanTheDiTichCoDoHue/Khamphahue_Quan-the-di-tich-co-do-hue.jpg',
    duration: '3 ngày 2 đêm',
    days: 3,
    category: 'Di sản',
    categoryIcon: '🏛️',
    region: 'Miền Trung',
    priceRange: 'budget',
    priceLabel: '2.600.000 ₫',
    rating: 4.7,
    reviewCount: 189,
    viewCount: 6240,
    tags: ['Cố đô', 'Lăng tẩm', 'Nhã nhạc cung đình', 'Ẩm thực Huế'],
    highlights: ['Tham quan Kinh thành Đại Nội', 'Ngắm hoàng hôn bên Chùa Thiên Mụ', 'Chiêm ngưỡng Lăng Khải Định tinh xảo', 'Thưởng thức ẩm thực Chợ Đông Ba'],
    badge: '🏛️ Di sản',
    badgeColor: 'bg-amber-600',
    author: 'Minh Trí',
    authorAvatar: 'MT',
    completedDate: '03/2026',
    description: 'Tìm về vẻ đẹp trầm mặc, cổ kính của cố đô Huế. Hành trình đi qua những lăng tẩm triều Nguyễn uy nghiêm, nghe ca Huế trên sông Hương thơ mộng.',
    stops: [
      { name: 'Đại Nội Huế', city: 'Huế', image: 'https://image.vietgoing.com/destination/large/vietgoing_awy2103053798.webp', category: 'heritage', rating: 4.8, description: 'Hoàng cung cổ kính triều đại nhà Nguyễn xưa', coordinates: { lat: 16.4637, lng: 107.5794 } },
      { name: 'Chùa Thiên Mụ', city: 'Huế', image: 'https://ik.imagekit.io/tvlk/blog/2023/06/chua-thien-mu-1.jpg', category: 'heritage', rating: 4.7, description: 'Ngôi chùa cổ linh thiêng bên dòng sông Hương', coordinates: { lat: 16.45309, lng: 107.54485 } },
      { name: 'Lăng Khải Định', city: 'Huế', image: 'https://hue.gov.vn/Portals/0/MINH2022/MINH%20THANG%205/M_20220805_KHAIDINH.jpg', category: 'heritage', rating: 4.8, description: 'Kiệt tác nghệ thuật khảm sành sứ độc đáo', coordinates: { lat: 16.39895, lng: 107.59029 } },
      { name: 'Chợ Đông Ba', city: 'Huế', image: 'https://vj-prod-website-cms.s3.ap-southeast-1.amazonaws.com/depositphotos196442922xl-1732498164999.jpg', category: 'city', rating: 4.5, description: 'Chợ truyền thống lâu đời của người dân xứ Huế', coordinates: { lat: 16.47201, lng: 107.58826 } }
    ],
    reviews: [
      { name: 'Vân Khánh', avatar: 'VK', date: '04/2026', rating: 5, text: 'Đồ ăn Huế siêu ngon và rẻ, bún bò, bánh lọc bánh nậm ăn hoài không chán. Lăng Khải Định chụp ảnh rất nghệ.', helpful: 29 },
      { name: 'Trường Giang', avatar: 'TG', date: '03/2026', rating: 4, text: 'Đại Nội siêu rộng, nên đi vào buổi chiều mát hoặc thuê xe điện để di chuyển.', helpful: 15 }
    ]
  },
  {
    id: 'ct-11',
    title: '3 Ngày Nha Trang — Biển Xanh Vẫy Gọi',
    coverImage: 'https://ik.imagekit.io/tvlk/blog/2023/07/bai-bien-nha-trang-8-1024x576.jpg?tr=q-70,c-at_max,w-1000,h-600',
    duration: '3 ngày 2 đêm',
    days: 3,
    category: 'Biển',
    categoryIcon: '🏖️',
    region: 'Miền Trung',
    priceRange: 'mid-range',
    priceLabel: '3.900.000 ₫',
    rating: 4.8,
    reviewCount: 290,
    viewCount: 9400,
    tags: ['Vui chơi giải trí', 'Lặn biển', 'Tháp cổ Chăm', 'Tắm bùn khoáng'],
    highlights: ['Vui chơi tẹt ga tại VinWonders', 'Khám phá Tháp Bà Ponagar cổ kính', 'Check-in danh thắng Hòn Chồng', 'Lên chùa cổ Long Sơn bình yên'],
    badge: '🏖️ Năng động',
    badgeColor: 'bg-sky-500',
    author: 'Hoài Nam',
    authorAvatar: 'HN',
    completedDate: '04/2026',
    description: 'Hành trình 3 ngày trọn vẹn khám phá vịnh biển Nha Trang xinh đẹp. Kết hợp giữa khu vui chơi đẳng cấp thế giới, di tích văn hóa Chăm cổ và ẩm thực hải sản phong phú.',
    stops: [
      { name: 'VinWonders Nha Trang', city: 'Nha Trang', image: 'https://phetravel.com/uploads/vinwonders-nha-trang-1.jpg', category: 'nature', rating: 4.9, description: 'Thiên đường giải trí đẳng cấp thế giới', coordinates: { lat: 12.20256, lng: 109.21742 } },
      { name: 'Tháp Bà Ponagar', city: 'Nha Trang', image: 'https://ik.imagekit.io/tvlk/blog/2022/07/thap-ba-Ponagar-1.jpg', category: 'heritage', rating: 4.7, description: 'Quần thể đền tháp Chăm cổ kính linh thiêng', coordinates: { lat: 12.26537, lng: 109.19537 } },
      { name: 'Hòn Chồng', city: 'Nha Trang', image: 'https://ik.imagekit.io/tvlk/blog/2023/04/hon-chong-1.jpg?tr=q-70,c-at_max,w-1000,h-600', category: 'nature', rating: 4.6, description: 'Quần thể đá tự nhiên nhô ra vịnh biển', coordinates: { lat: 12.27173, lng: 109.20474 } },
      { name: 'Chùa Long Sơn', city: 'Nha Trang', image: 'https://www.mercurenhatrangbeach.com/wp-content/uploads/sites/156/2025/07/Long-Son-Pagoda-scaled.jpeg', category: 'heritage', rating: 4.7, description: 'Ngôi chùa có pho tượng Kim Thân Phật Tổ khổng lồ', coordinates: { lat: 12.25018, lng: 109.18018 } }
    ],
    reviews: [
      { name: 'Gia Bảo', avatar: 'GB', date: '04/2026', rating: 5, text: 'VinWonders chơi cả ngày không chán, cáp treo vượt biển ngắm hoàng hôn siêu đỉnh. Tháp Bà Ponagar cổ kính lắm.', helpful: 37 },
      { name: 'Bích Thủy', avatar: 'BT', date: '03/2026', rating: 5, text: 'Khách sạn sát biển view đẹp mê mẩn. Đồ ăn hải sản tươi rói, giá cả phải chăng.', helpful: 22 }
    ]
  },
  {
    id: 'ct-12',
    title: '2 Ngày Vũng Tàu — Đổi Gió Cuối Tuần',
    coverImage: 'https://owa.bestprice.vn/images/destinations/uploads/bai-truoc-609ca7036edb7.jpg',
    duration: '2 ngày 1 đêm',
    days: 2,
    category: 'Biển',
    categoryIcon: '🏖️',
    region: 'Đông Nam Bộ',
    priceRange: 'budget',
    priceLabel: '1.400.000 ₫',
    rating: 4.6,
    reviewCount: 312,
    viewCount: 12500,
    tags: ['Biển gần Sài Gòn', 'Hải sản giá rẻ', 'Ngọn hải đăng', 'Dạo biển'],
    highlights: ['Leo bộ lên Tượng Chúa Kitô Vua', 'Ngắm hoàng hôn từ Ngọn Hải Đăng', 'Chill tắm biển tại Bãi Sau', 'Tham quan di tích Bạch Dinh'],
    badge: '🌴 Cuối tuần',
    badgeColor: 'bg-emerald-500',
    author: 'Thảo Vy',
    authorAvatar: 'TV',
    completedDate: '04/2026',
    description: 'Chuyến du lịch ngắn ngày hoàn hảo cho gia đình và nhóm bạn từ Sài Gòn. Thư giãn tắm biển Bãi Sau, ngắm nhìn toàn cảnh thành phố từ ngọn hải đăng cổ.',
    stops: [
      { name: 'Tượng Chúa Kitô Vua', city: 'Vũng Tàu', image: 'https://mia.vn/media/uploads/blog-du-lich/tuong-chua-kito-vung-tau-tuong-chua-jesus-lon-nhat-chau-a-1633941577.jpg', category: 'heritage', rating: 4.7, description: 'Tượng Chúa Giêsu lớn nhất châu Á trên đỉnh núi Nhỏ', coordinates: { lat: 10.3297, lng: 107.0878 } },
      { name: 'Ngọn hải đăng Vũng Tàu', city: 'Vũng Tàu', image: 'https://static.vinwonders.com/production/2025/05/kien-truc-hai-dang-o-vung-tau.jpg', category: 'heritage', rating: 4.6, description: 'Ngọn hải đăng cổ xưa nhất Việt Nam', coordinates: { lat: 10.33409, lng: 107.07766 } },
      { name: 'Bãi Sau', city: 'Vũng Tàu', image: 'https://vcdn1-vnexpress.vnecdn.net/2025/08/28/tam-thang-1-1756373725-6857-1756374331.jpg?w=500&h=300&q=100&dpr=2&fit=crop&s=p-_HQ41-tlHpoujtthqszA', category: 'beach', rating: 4.5, description: 'Bãi tắm nhộn nhịp, sóng biển êm ả', coordinates: { lat: 10.34101, lng: 107.09391 } },
      { name: 'Bạch Dinh', city: 'Vũng Tàu', image: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/White_Palace_Vung_Tau_from_Flycam.jpg', category: 'heritage', rating: 4.5, description: 'Dinh thự kiến trúc Pháp cổ kính nhìn ra biển', coordinates: { lat: 10.35084, lng: 107.06866 } }
    ],
    reviews: [
      { name: 'Hoàng Long', avatar: 'HL', date: '04/2026', rating: 4, text: 'Lên đỉnh Tượng Chúa mệt nhưng view nhìn ra biển Vũng Tàu quá xứng đáng. Bánh khọt Cô Ba Vũng Tàu ăn siêu cuốn.', helpful: 41 },
      { name: 'Thanh Trúc', avatar: 'TT', date: '03/2026', rating: 5, text: 'Rất thích hợp cho chuyến đi nhanh 2 ngày xả stress cuối tuần. Hải sản chợ đêm Vũng Tàu rất tươi ngon.', helpful: 29 }
    ]
  },
  {
    id: 'ct-13',
    title: '2 Ngày Cần Thơ — Sông Nước Tây Đô',
    coverImage: 'https://datviettour.com.vn/uploads/images/tin-tuc-SEO/mien-tay/Can-tho/cho-noi-cai-rang.jpg',
    duration: '2 ngày 1 đêm',
    days: 2,
    category: 'Thành phố',
    categoryIcon: '🏙️',
    region: 'Tây Nam Bộ',
    priceRange: 'budget',
    priceLabel: '1.600.000 ₫',
    rating: 4.7,
    reviewCount: 145,
    viewCount: 4500,
    tags: ['Chợ nổi', 'Miệt vườn sông nước', 'Tây Đô', 'Nhà cổ cổ kính'],
    highlights: ['Trải nghiệm Chợ nổi Cái Răng từ sáng sớm', 'Dạo bước ngắm cảnh Bến Ninh Kiều', 'Tham quan Nhà cổ Bình Thủy tráng lệ', 'Cầu an tại Chùa Ông cổ kính'],
    badge: '🛶 Sông nước',
    badgeColor: 'bg-blue-500',
    author: 'Tấn Phát',
    authorAvatar: 'TP',
    completedDate: '03/2026',
    description: 'Hành trình khám phá thủ phủ miền Tây Nam Bộ. Nghe tiếng rao chèo trên chợ nổi Cái Răng từ bình minh, đi dạo bến Ninh Kiều mát mẻ khi hoàng hôn buông xuống.',
    stops: [
      { name: 'Chợ nổi Cái Răng', city: 'Cần Thơ', image: 'https://statics.vinpearl.com/cho-noi-cai-rang-2_1624262882.jpg', category: 'countryside', rating: 4.8, description: 'Nét văn hóa giao thương độc đáo trên sông nước', coordinates: { lat: 10.00504, lng: 105.74598 } },
      { name: 'Bến Ninh Kiều', city: 'Cần Thơ', image: 'https://statics.vinpearl.com/ben-ninh-kieu-3_1624326845.jpg', category: 'city', rating: 4.7, description: 'Công viên và bến tàu thơ mộng bên bờ sông Hậu', coordinates: { lat: 10.03235, lng: 105.7882 } },
      { name: 'Nhà cổ Bình Thủy', city: 'Cần Thơ', image: 'https://booking.muongthanh.com/images/news/2025/06/original/nha-co-binh-thuy_1750637395.jpg', category: 'heritage', rating: 4.7, description: 'Ngôi nhà cổ có kiến trúc giao thoa Pháp - Việt độc đáo', coordinates: { lat: 10.06708, lng: 105.74955 } },
      { name: 'Chùa Ông', city: 'Cần Thơ', image: 'https://dulichviet.com.vn/images/bandidau/du-lich-chua-ong-can-tho.jpg', category: 'heritage', rating: 4.6, description: 'Ngôi chùa cổ rực rỡ sắc màu văn hóa Trung Hoa', coordinates: { lat: 10.0337, lng: 105.7889 } }
    ],
    reviews: [
      { name: 'Lê Minh', avatar: 'LM', date: '04/2026', rating: 5, text: 'Ngồi thuyền ăn tô hủ tiếu nóng hổi ngay trên sông lúc sáng sớm là trải nghiệm nhất định phải thử!', helpful: 31 },
      { name: 'Bích Ngọc', avatar: 'BN', date: '03/2026', rating: 4, text: 'Nhà cổ Bình Thủy rất đẹp, có nhiều góc chụp ảnh đậm nét xưa. Hướng dẫn viên tại điểm chia sẻ câu chuyện rất hay.', helpful: 16 }
    ]
  },
  {
    id: 'ct-14',
    title: '3 Ngày Mũi Né — Sa Mạc Cát & Biển Xanh',
    coverImage: 'https://res.klook.com/image/upload/q_85/c_fill,w_750/v1719573843/tc6hzqdx4f8rnzreme8u.jpg',
    duration: '3 ngày 2 đêm',
    days: 3,
    category: 'Biển',
    categoryIcon: '🏖️',
    region: 'Nam Trung Bộ',
    priceRange: 'mid-range',
    priceLabel: '2.900.000 ₫',
    rating: 4.7,
    reviewCount: 220,
    viewCount: 7900,
    tags: ['Đồi cát trượt', 'Suối nước đỏ', 'Bàu sen sa mạc', 'Làng chài truyền thống'],
    highlights: ['Trượt cát tại Đồi cát bay', 'Lội nước mát lạnh tại Suối Tiên', 'Đi xe jeep vượt cát tại Bàu Trắng', 'Khám phá đời sống Làng chài Mũi Né'],
    badge: '🏜️ Độc đáo',
    badgeColor: 'bg-amber-500',
    author: 'Quỳnh Hương',
    authorAvatar: 'QH',
    completedDate: '02/2026',
    description: 'Hành trình khám phá thiên đường nghỉ dưỡng Mũi Né Phan Thiết. Kết hợp độc đáo giữa những đồi cát trắng như sa mạc, dòng suối tiên mát lành và bãi biển lộng gió.',
    stops: [
      { name: 'Đồi cát bay Mũi Né', city: 'Phan Thiết', image: 'https://ik.imagekit.io/tvlk/blog/2023/10/doi-cat-mui-ne-12.jpg?tr=q-70,c-at_max,w-1000,h-600', category: 'nature', rating: 4.6, description: 'Đồi cát màu đỏ hồng liên tục thay đổi hình dạng', coordinates: { lat: 10.95, lng: 108.2833 } },
      { name: 'Suối Tiên', city: 'Mũi Né', image: 'https://ik.imagekit.io/tvlk/blog/2022/12/suoi-tien-mui-ne-6.jpg', category: 'nature', rating: 4.7, description: 'Khe nước nhỏ chảy giữa những vách đá cát cam đỏ', coordinates: { lat: 10.9486, lng: 108.2722 } },
      { name: 'Bàu Trắng', city: 'Mũi Né', image: 'https://www.bambooairways.com/documents/20122/1165110/du-lich-bau-trang-mui-ne-1.jpg/a21ac313-0fa4-96cf-a756-3def95655f25?t=1695008349658', category: 'nature', rating: 4.8, description: 'Hồ nước ngọt khổng lồ giữa lòng cồn cát trắng', coordinates: { lat: 11.2186, lng: 108.4006 } },
      { name: 'Làng chài Mũi Né', city: 'Mũi Né', image: 'https://ik.imagekit.io/tvlk/blog/2023/10/lang-chai-mui-ne-14.png?tr=q-70,c-at_max,w-1000,h-600', category: 'city', rating: 4.5, description: 'Cảnh buôn bán hải sản nhộn nhịp từ thuyền thúng', coordinates: { lat: 10.94101, lng: 108.27913 } }
    ],
    reviews: [
      { name: 'Quốc Bảo', avatar: 'QB', date: '04/2026', rating: 5, text: 'Thuê xe jeep chạy trên cát Bàu Trắng cực kỳ phấn khích! Khung cảnh đồi cát cát trắng tương phản hồ sen quá ảo diệu.', helpful: 44 },
      { name: 'Thanh Mai', avatar: 'TM', date: '03/2026', rating: 4, text: 'Suối Tiên đi bộ mát chân và dễ chịu, cảnh quan hai bên độc lạ. Đồ ăn đặc sản dông nướng rất ngon.', helpful: 23 }
    ]
  },
  {
    id: 'ct-15',
    title: '3 Ngày Tâm Linh & Côn Đảo Hoang Sơ',
    coverImage: 'https://phetravel.com/uploads/khu-du-lich-thuy-thuan-2.jpg.webp',
    duration: '3 ngày 2 đêm',
    days: 3,
    category: 'Biển',
    categoryIcon: '🏖️',
    region: 'Đông Nam Bộ',
    priceRange: 'luxury',
    priceLabel: '6.800.000 ₫',
    rating: 4.9,
    reviewCount: 178,
    viewCount: 5200,
    tags: ['Tâm linh', 'Nhà tù lịch sử', 'Bãi tắm hoang sơ', 'Nghĩa trang Hàng Dương'],
    highlights: ['Thắp hương viếng mộ chị Võ Thị Sáu', 'Tìm hiểu lịch sử tại Nhà tù Côn Đảo', 'Tắm biển bãi Đầm Trầu hoang sơ', 'Lên Chùa Núi Một ngắm toàn cảnh đảo'],
    badge: '🕊️ Thiêng liêng',
    badgeColor: 'bg-indigo-600',
    author: 'Khánh Huyền',
    authorAvatar: 'KH',
    completedDate: '04/2026',
    description: 'Hành trình vừa mang tính chất lịch sử tâm linh thiêng liêng vừa là chuyến nghỉ dưỡng tuyệt hảo giữa các bãi biển hoang sơ, làn nước trong vắt của hòn đảo ngọc Côn Đảo.',
    stops: [
      { name: 'Nhà tù Côn Đảo', city: 'Côn Đảo', image: 'https://dsvh.gov.vn/ckfinder/userfiles/images/Thong%20tin%20ds/DTQGDB_Trai%20Phu%20Son.jpg', category: 'heritage', rating: 4.9, description: 'Di tích quốc gia đặc biệt ghi dấu lịch sử đấu tranh', coordinates: { lat: 8.6917, lng: 106.6086 } },
      { name: 'Nghĩa trang Hàng Dương', city: 'Côn Đảo', image: 'https://condao.com.vn/uploads/news/2024_02/508b5e850cc9e597bcd8.jpg', category: 'heritage', rating: 4.9, description: 'Nơi yên nghỉ của hàng vạn chiến sĩ cách mạng', coordinates: { lat: 8.6989, lng: 106.6111 } },
      { name: 'Bãi Đầm Trầu', city: 'Côn Đảo', image: 'https://ik.imagekit.io/tvlk/blog/2023/09/bai-dam-trau-1.jpeg?tr=q-70,c-at_max,w-1000,h-600', category: 'beach', rating: 4.8, description: 'Bãi tắm hoang sơ cạnh sân bay Cỏ Ống nước trong vắt', coordinates: { lat: 8.7269, lng: 106.6336 } },
      { name: 'Chùa Núi Một', city: 'Côn Đảo', image: 'https://condao.com.vn/uploads/store/chua-nui-mot-con-dao.jpg', category: 'heritage', rating: 4.7, description: 'Ngôi chùa có phong thủy tựa lưng vào núi mặt hướng biển xanh', coordinates: { lat: 8.6889, lng: 106.6147 } }
    ],
    reviews: [
      { name: 'Hoàng Phong', avatar: 'HP', date: '04/2026', rating: 5, text: 'Trải nghiệm đi viếng nghĩa trang lúc đêm muộn cực kỳ thiêng liêng và xúc động. Côn Đảo có bãi biển cực sạch và hoang sơ.', helpful: 52 },
      { name: 'Minh Thư', avatar: 'MT', date: '03/2026', rating: 5, text: 'Không khí Côn Đảo rất trong lành, yên bình. Bãi Đầm Trầu có thể ngắm máy bay hạ cánh cực sát rất thú vị.', helpful: 33 }
    ]
  },
  {
    id: 'ct-16',
    title: '3 Ngày Quảng Bình — Vương Quốc Hang Động',
    coverImage: 'https://nld.mediacdn.vn/thumb_w/640/291774122806476800/2024/11/18/dong-phong-nha-ke-bang-dep-den-choang-ngop-17319168370561406931222.jpg',
    duration: '3 ngày 2 đêm',
    days: 3,
    category: 'Núi',
    categoryIcon: '🏔️',
    region: 'Miền Trung',
    priceRange: 'mid-range',
    priceLabel: '4.200.000 ₫',
    rating: 4.9,
    reviewCount: 167,
    viewCount: 4890,
    tags: ['Hang động thạch nhũ', 'Trekking', 'Suối mát lạnh', 'Đu dây Zipline'],
    highlights: ['Du thuyền khám phá Động Phong Nha', 'Chiêm ngưỡng Động Thiên Đường tráng lệ', 'Tắm suối nước Moọc ngọc bích', 'Đu zipline thám hiểm Sông Chày Hang Tối'],
    badge: '🧗 Khám phá',
    badgeColor: 'bg-emerald-600',
    author: 'Tuấn Đạt',
    authorAvatar: 'TĐ',
    completedDate: '03/2026',
    description: 'Khám phá trái tim của di sản thiên nhiên thế giới Phong Nha - Kẻ Bàng. Chiêm ngưỡng những hang động thạch nhũ kỳ vĩ hàng triệu năm tuổi và chèo thuyền kayak trên làn nước suối trong xanh như ngọc.',
    stops: [
      { name: 'Động Phong Nha', city: 'Quảng Bình', image: 'https://vietskytourism.com.vn/wp-content/uploads/2018/03/Dong-Phong-Nha-Ke-Bang-dep-den-choang-ngop.jpg', category: 'heritage', rating: 4.9, description: 'Hang động tiêu biểu có hệ thống sông ngầm dài nhất thế giới', coordinates: { lat: 17.58168, lng: 106.28346 } },
      { name: 'Động Thiên Đường', city: 'Quảng Bình', image: 'https://vj-prod-website-cms.s3.ap-southeast-1.amazonaws.com/depositphotos88801884xl-1734917577484.jpg', category: 'mountain', rating: 4.9, description: 'Hoàng cung trong lòng đất với thạch nhũ lung linh kỳ vĩ', coordinates: { lat: 17.51945, lng: 106.22328 } },
      { name: 'Suối nước Moọc', city: 'Quảng Bình', image: 'https://statics.vinpearl.com/suoi-nuoc-mooc--_1629695174.jpg', category: 'nature', rating: 4.8, description: 'Khu sinh thái suối nước trong xanh màu ngọc bích ẩn dưới tán rừng', coordinates: { lat: 17.55666, lng: 106.23811 } },
      { name: 'Sông Chày - Hang Tối', city: 'Quảng Bình', image: 'https://cms.junglebosstours.com/assets/33c9d47c-64cd-4d22-9e33-6cf5d85a5577?width=1900&height=1266', category: 'nature', rating: 4.7, description: 'Hành trình mạo hiểm chèo kayak, tắm bùn tự nhiên trong hang tối', coordinates: { lat: 17.57417, lng: 106.25424 } }
    ],
    reviews: [
      { name: 'Văn Huy', avatar: 'VH', date: '04/2026', rating: 5, text: 'Động Thiên Đường đẹp đến ngỡ ngàng, quy mô khổng lồ. Suối nước Moọc nước mát lịm, chèo thuyền kayak rất vui.', helpful: 39 },
      { name: 'Thu Thảo', avatar: 'TT', date: '03/2026', rating: 5, text: 'Chuyến đi mạo hiểm tuyệt hảo. Trải nghiệm tắm bùn tự nhiên bên trong Hang Tối siêu thú vị.', helpful: 26 }
    ]
  },
  {
    id: 'ct-17',
    title: '3 Ngày Quy Nhơn — Eo Gió Kỳ Co Đẹp Như Tranh',
    coverImage: 'https://owa.bestprice.vn/images/articles/uploads/tong-hop-cac-diem-du-lich-o-quy-nhon-dep-nhat-du-khach-khong-nen-bo-lo-5ea596e357d4f.jpg',
    duration: '3 ngày 2 đêm',
    days: 3,
    category: 'Biển',
    categoryIcon: '🏖️',
    region: 'Miền Trung',
    priceRange: 'mid-range',
    priceLabel: '3.600.000 ₫',
    rating: 4.8,
    reviewCount: 198,
    viewCount: 6540,
    tags: ['Eo biển lộng gió', 'Lặn ngắm san hô Kỳ Co', 'Tháp Chăm cổ', 'Mộ nhà thơ Hàn Mặc Tử'],
    highlights: ['Tắm biển lặn ngắm san hô Kỳ Co', 'Ngắm hoàng hôn tuyệt đẹp tại Eo Gió', 'Khám phá kiến trúc Tháp Đôi cổ', 'Viếng mộ thi sĩ Hàn Mặc Tử tại Ghềnh Ráng'],
    badge: '🌊 Thơ mộng',
    badgeColor: 'bg-cyan-500',
    author: 'Mai Trang',
    authorAvatar: 'MT',
    completedDate: '04/2026',
    description: 'Hành trình 3 ngày tận hưởng vẻ đẹp của biển cả Quy Nhơn. Nơi có eo biển Eo Gió nổi tiếng lộng gió quanh năm và bãi tắm Kỳ Co với bờ cát trắng phau mịn màng.',
    stops: [
      { name: 'Bãi biển Kỳ Co', city: 'Quy Nhơn', image: 'https://statics.vinpearl.com/ky-co-quy-nhon-1_1706683553.jpeg', category: 'beach', rating: 4.9, description: 'Thiên đường biển đảo nước trong vắt màu ngọc bích', coordinates: { lat: 13.8499, lng: 109.2918 } },
      { name: 'Eo Gió', city: 'Quy Nhơn', image: 'https://quynhontrip.com/wp-content/uploads/2020/10/eo-gio-1024x768.jpg', category: 'nature', rating: 4.8, description: 'Rặng núi đá cao uốn cong ôm trọn eo biển lộng gió', coordinates: { lat: 13.8862, lng: 109.29089 } },
      { name: 'Tháp Đôi', city: 'Quy Nhơn', image: 'https://tropicaltrip.vn/wp-content/uploads/2025/11/thap-doi-quy-nhon-2.jpg', category: 'heritage', rating: 4.6, description: 'Cặp tháp Chăm cổ kính đặc trưng phong cách nghệ thuật cổ', coordinates: { lat: 13.78617, lng: 109.21104 } },
      { name: 'Ghềnh Ráng Tiên Sa', city: 'Quy Nhơn', image: 'https://quynhontourist.com/wp-content/uploads/2020/10/bai-tam-hoang-hau-bai-da-trung-ghenh-rang-tien-sa-quy-nhon-quynhontourist.jpg', category: 'nature', rating: 4.6, description: 'Bãi đá trứng độc đáo và lăng mộ thi sĩ tài hoa Hàn Mặc Tử', coordinates: { lat: 13.7461, lng: 109.2156 } }
    ],
    reviews: [
      { name: 'Anh Thư', avatar: 'AT', date: '04/2026', rating: 5, text: 'Quy Nhơn hoang sơ và cực kỳ xinh đẹp. Bãi Kỳ Co nước xanh đến không tin được. Đồ ăn đặc sản bánh xèo tôm nhảy rất ngon.', helpful: 45 },
      { name: 'Đức Huy', avatar: 'DH', date: '03/2026', rating: 4, text: 'Eo Gió ngắm hoàng hôn chụp ảnh siêu thơ. Giá cả dịch vụ ăn uống ở Quy Nhơn rất bình dân.', helpful: 22 }
    ]
  },
  {
    id: 'ct-18',
    title: '2 Ngày Tây Ninh — Chinh Phục Núi Bà Đen & Thánh Thất',
    coverImage: 'https://ik.imagekit.io/tvlk/blog/2022/02/dia-diem-du-lich-tay-ninh-cover.jpeg',
    duration: '2 ngày 1 đêm',
    days: 2,
    category: 'Núi',
    categoryIcon: '🏔️',
    region: 'Đông Nam Bộ',
    priceRange: 'budget',
    priceLabel: '1.500.000 ₫',
    rating: 4.7,
    reviewCount: 234,
    viewCount: 8200,
    tags: ['Nóc nhà Nam Bộ', 'Cáp treo hiện đại', 'Tôn giáo Cao Đài', 'Hồ nước ngọt khổng lồ'],
    highlights: ['Chinh phục Núi Bà Đen bằng cáp treo', 'Chiêm bái kiến trúc Tòa Thánh Tây Ninh', 'Ngắm hoàng hôn bình yên bên Hồ Dầu Tiếng', 'Trekking thung lũng Ma Thiên Lãnh hoang sơ'],
    badge: '🗻 Nóc nhà',
    badgeColor: 'bg-teal-600',
    author: 'Hữu Phước',
    authorAvatar: 'HP',
    completedDate: '04/2026',
    description: 'Chuyến hành trình ngắn ngày leo núi Bà Đen linh thiêng chiêm bái tượng Phật Bà Tây Bổ Đà Sơn cao nhất Đông Nam Á và tìm hiểu nét văn hóa đặc thù của đạo Cao Đài.',
    stops: [
      { name: 'Núi Bà Đen', city: 'Tây Ninh', image: 'https://buulong.com.vn/wp-content/uploads/2026/03/dia-chi-nui-ba-den-tay-ninh.jpg', category: 'mountain', rating: 4.9, description: 'Nóc nhà Nam Bộ cao 986m linh thiêng quanh năm mây phủ', coordinates: { lat: 11.36344, lng: 106.17409 } },
      { name: 'Tòa Thánh Tây Ninh', city: 'Tây Ninh', image: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/T%C3%B2a_Th%C3%A1nh_T%C3%A2y_Ninh_042013.JPG', category: 'heritage', rating: 4.7, description: 'Thánh địa vĩ đại có kiến trúc độc đáo của đạo Cao Đài', coordinates: { lat: 11.3017, lng: 106.1283 } },
      { name: 'Hồ Dầu Tiếng', city: 'Tây Ninh', image: 'https://static.vinwonders.com/production/2025/07/vi-tri-ho-dau-tieng.jpg', category: 'nature', rating: 4.6, description: 'Hồ nước nhân tạo khổng lồ, điểm cắm trại bình yên', coordinates: { lat: 11.43, lng: 106.36 } },
      { name: 'Ma Thiên Lãnh', city: 'Tây Ninh', image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/M%E1%BB%99t_h%E1%BB%93_n%C6%B0%E1%BB%9Bc_t%E1%BA%A1i_Ma_Thi%C3%AAn_L%C3%A3nh.jpg', category: 'nature', rating: 4.5, description: 'Thung lũng hoang sơ giữa 3 ngọn núi kỳ vĩ ở Tây Ninh', coordinates: { lat: 11.355, lng: 106.1556 } }
    ],
    reviews: [
      { name: 'Thanh Nhã', avatar: 'TN', date: '04/2026', rating: 5, text: 'Tượng Phật Bà trên đỉnh núi Bà Đen cực kỳ tráng lệ, hệ thống cáp treo hiện đại đi xuyên qua làn mây.', helpful: 48 },
      { name: 'Khắc Tiệp', avatar: 'KT', date: '03/2026', rating: 4, text: 'Tòa Thánh Tây Ninh rất trang nghiêm và lộng lẫy, đi đúng giờ cúng ngọ để nghe tụng niệm rất đặc sắc.', helpful: 21 }
    ]
  },
  {
    id: 'ct-19',
    title: '3 Ngày Phú Yên — Hoa Vàng Trên Cỏ Xanh',
    coverImage: 'https://dulichviet.com.vn/images/bandidau/diem-danh-top-20-dia-diem-du-lich-phu-yen-nhat-dinh-phai-den-mot-lan.jpg',
    duration: '3 ngày 2 đêm',
    days: 3,
    category: 'Biển',
    categoryIcon: '🏖️',
    region: 'Miền Trung',
    priceRange: 'mid-range',
    priceLabel: '3.200.000 ₫',
    rating: 4.8,
    reviewCount: 154,
    viewCount: 4670,
    tags: ['Biển xanh', 'Ghềnh đá', 'Hải đăng cực Đông', 'Đầm hải sản'],
    highlights: ['Khám phá danh thắng Gành Đá Đĩa', 'Đón bình minh sớm nhất tại Mũi Điện', 'Check-in Tháp Nghinh Phong biểu tượng', 'Thưởng thức hải sản Đầm Ô Loan'],
    badge: '🌊 Yên bình',
    badgeColor: 'bg-cyan-600',
    author: 'Duy Khánh',
    authorAvatar: 'DK',
    completedDate: '04/2026',
    description: 'Hành trình 3 ngày trải nghiệm Phú Yên hoang sơ thanh bình. Khám phá những ghềnh đá đen xếp chồng kỳ vĩ, đón những tia nắng đầu tiên của Việt Nam tại ngọn hải đăng Đại Lãnh.',
    stops: [
      { name: 'Gành Đá Đĩa', city: 'Phú Yên', image: 'https://statics.vinpearl.com/ganh-da-dia-phu-yen_1751078702.jpg', category: 'nature', rating: 4.9, description: 'Di tích quốc gia đặc biệt với các khối đá lục giác xếp chồng', coordinates: { lat: 13.34953, lng: 109.29076 } },
      { name: 'Mũi Điện (Hải đăng Đại Lãnh)', city: 'Phú Yên', image: 'https://statics.vinpearl.com/con-duong-di-len-hai-dang-dai-lanh_1751085835.jpg', category: 'beach', rating: 4.8, description: 'Nơi đón ánh bình minh đầu tiên trên đất liền Việt Nam', coordinates: { lat: 12.89583, lng: 109.45673 } },
      { name: 'Tháp Nghinh Phong', city: 'Tuy Hòa', image: 'https://statics.vinpearl.com/thap-nghinh-phong-phu-yen_1751707559.jpg', category: 'city', rating: 4.7, description: 'Kiệt tác kiến trúc hiện đại lấy cảm hứng từ truyền thuyết Lạc Long Quân', coordinates: { lat: 13.0853, lng: 109.3239 } },
      { name: 'Đầm Ô Loan', city: 'Phú Yên', image: 'https://tinviettravel.com/uploads/cam-nang-du-lich/2025_06/phu-yen-dam-o-loan.jpg', category: 'nature', rating: 4.6, description: 'Đầm nước lợ nổi tiếng với món sò huyết và hải sản tươi ngon', coordinates: { lat: 13.2858, lng: 109.2858 } }
    ],
    reviews: [
      { name: 'Khánh An', avatar: 'KA', date: '04/2026', rating: 5, text: 'Phú Yên đẹp hoang sơ chưa bị thương mại hóa nhiều. Đón bình minh ở Mũi Điện là trải nghiệm nhớ đời.', helpful: 26 },
      { name: 'Gia Bảo', avatar: 'GB', date: '03/2026', rating: 4, text: 'Gành Đá Đĩa rất độc đáo, chụp ảnh cực kỳ hút mắt. Hải sản Đầm Ô Loan rẻ và rất ngon.', helpful: 14 }
    ]
  },
  {
    id: 'ct-20',
    title: '2 Ngày Sài Gòn — Năng Động & Hiện Đại',
    coverImage: 'https://image.vietgoing.com/article/large/vietgoing_jxk2404125869.webp',
    duration: '2 ngày 1 đêm',
    days: 2,
    category: 'Thành phố',
    categoryIcon: '🏙️',
    region: 'Đông Nam Bộ',
    priceRange: 'mid-range',
    priceLabel: '1.800.000 ₫',
    rating: 4.7,
    reviewCount: 289,
    viewCount: 10500,
    tags: ['Thành phố không ngủ', 'Kiến trúc Pháp cổ', 'Chợ truyền thống', 'Di tích lịch sử'],
    highlights: ['Chiêm ngưỡng kiến trúc Bưu điện Trung tâm', 'Check-in Nhà thờ Đức Bà cổ kính', 'Mua sắm và ăn uống tại Chợ Bến Thành', 'Khám phá lịch sử tại Dinh Độc Lập'],
    badge: '⚡ Sầm uất',
    badgeColor: 'bg-rose-500',
    author: 'Quốc Anh',
    authorAvatar: 'QA',
    completedDate: '04/2026',
    description: 'Khám phá nhịp sống sôi động của thành phố mang tên Bác. Tìm hiểu nét giao thoa văn hóa giữa những công trình kiến trúc Pháp cổ kính và sự hiện đại sầm uất.',
    stops: [
      { name: 'Bưu điện Trung tâm Sài Gòn', city: 'TP. HCM', image: 'https://statics.vinpearl.com/buu-dien-trung-tam-sai-gon-1_1629888305.jpg', category: 'heritage', rating: 4.7, description: 'Bưu điện cổ kính mang kiến trúc Gothic và Phục hưng Pháp', coordinates: { lat: 10.77985, lng: 106.69984 } },
      { name: 'Nhà thờ Đức Bà Sài Gòn', city: 'TP. HCM', image: 'https://buulong.com.vn/wp-content/uploads/2026/03/nha-tho-duc-ba-sai-gon-5.jpg', category: 'heritage', rating: 4.8, description: 'Vương cung thánh đường biểu tượng của thành phố', coordinates: { lat: 10.77979, lng: 106.69902 } },
      { name: 'Chợ Bến Thành', city: 'TP. HCM', image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Ben_Thanh_market_2.jpg', category: 'city', rating: 4.5, description: 'Chợ truyền thống sầm uất bậc nhất Sài Thành', coordinates: { lat: 10.77252, lng: 106.69802 } },
      { name: 'Dinh Độc Lập', city: 'TP. HCM', image: 'https://tapchidulich.net.vn/FileManager/anh_web_2020/thang4/2131/dinh%20doc%20lap.jpg', category: 'heritage', rating: 4.7, description: 'Di tích lịch sử lưu dấu khoảnh khắc thống nhất đất nước', coordinates: { lat: 10.77699, lng: 106.69531 } }
    ],
    reviews: [
      { name: 'Hương Giang', avatar: 'HG', date: '04/2026', rating: 5, text: 'Thành phố náo nhiệt, cà phê bệt cạnh Nhà thờ Đức Bà rất vui. Đồ ăn vặt Sài Gòn phong phú vô cùng.', helpful: 38 },
      { name: 'Hoàng Lâm', avatar: 'HL', date: '03/2026', rating: 4, text: 'Bưu điện Trung tâm kiến trúc rất đẹp và hoài cổ. Buổi tối dạo phố đi bộ Nguyễn Huệ cực vui.', helpful: 21 }
    ]
  },
  {
    id: 'ct-21',
    title: '3 Ngày Mù Cang Chải — Mùa Vàng Ruộng Bậc Thang',
    coverImage: 'https://images.vietnamtourism.gov.vn/vn/images/2021/Thang_5/mu_cang_chai_resize.jpg',
    duration: '3 ngày 2 đêm',
    days: 3,
    category: 'Núi',
    categoryIcon: '🏔️',
    region: 'Tây Bắc',
    priceRange: 'mid-range',
    priceLabel: '2.800.000 ₫',
    rating: 4.9,
    reviewCount: 198,
    viewCount: 6100,
    tags: ['Mùa vàng bậc thang', 'Đèo mây phủ', 'Bản làng dân tộc', 'Dù lượn trên đèo'],
    highlights: ['Chiêm ngưỡng thung lũng lúa La Pán Tẩn', 'Chinh phục đèo Khau Phạ mây phủ', 'Khám phá Bản Lìm Mông thanh bình', 'Chụp ảnh thung lũng Cao Phạ'],
    badge: '🌾 Mùa lúa chín',
    badgeColor: 'bg-yellow-600',
    author: 'Thuỳ Dương',
    authorAvatar: 'TD',
    completedDate: '04/2026',
    description: 'Hành trình 3 ngày đắm chìm trong sắc vàng óng ả của những thửa ruộng bậc thang đẹp nhất Việt Nam. Khám phá các bản làng người Mông hoang sơ, vượt con đèo huyền thoại Khau Phạ.',
    stops: [
      { name: 'Ruộng bậc thang La Pán Tẩn', city: 'Yên Bái', image: 'https://booking.muongthanh.com/images/news/2025/04/original/kham-pha-la-pan-tan_1743581304.jpg', category: 'nature', rating: 4.9, description: 'Danh thắng quốc gia ruộng bậc thang hình mâm xôi nổi tiếng', coordinates: { lat: 21.8, lng: 104.0333 } },
      { name: 'Đèo Khau Phạ', city: 'Yên Bái', image: 'https://images.vietnamtourism.gov.vn/vn/images/2021/Thang_6/deo_khau_pha.jpg', category: 'mountain', rating: 4.8, description: 'Một trong tứ đại đỉnh đèo quanh năm sương mù mây phủ', coordinates: { lat: 21.7833, lng: 104.1 } },
      { name: 'Bản Lìm Mông', city: 'Yên Bái', image: 'https://travelhanoi.com.vn/UserFiles/images/m%C3%B9%20cang%20ch%E1%BA%A3i/lim-mong-2.jpg', category: 'countryside', rating: 4.7, description: 'Bản người Mông bình yên nằm ẩn mình dưới chân đèo Khau Phạ', coordinates: { lat: 21.8167, lng: 104.05 } },
      { name: 'Thung lũng Cao Phạ', city: 'Yên Bái', image: 'https://images.vietnamtourism.gov.vn/vn/images/2024/thang_9/1909.cong_troi_cao_pha1.jpg', category: 'nature', rating: 4.7, description: 'Thung lũng lúa bao la, địa điểm bay dù lượn hàng năm', coordinates: { lat: 21.7556, lng: 104.1333 } }
    ],
    reviews: [
      { name: 'Quốc Khánh', avatar: 'QK', date: '04/2026', rating: 5, text: 'Ruộng bậc thang màu lúa chín vàng óng cực kỳ hùng vĩ. Đèo Khau Phạ chạy xe qua ngắm mây rất phê.', helpful: 34 },
      { name: 'Diễm Hương', avatar: 'DH', date: '03/2026', rating: 5, text: 'Người dân thân thiện hiếu khách, ẩm thực xôi nếp tú lệ ăn kèm thịt lợn bản nướng cực ngon.', helpful: 19 }
    ]
  },
  {
    id: 'ct-22',
    title: '2 Ngày Khám Phá An Giang Sông Nước Linh Thiêng',
    coverImage: 'https://cdn3.ivivu.com/2025/12/du-lich-an-giang-ivivu-1.png',
    duration: '2 ngày 1 đêm',
    days: 2,
    category: 'Di sản',
    categoryIcon: '🏛️',
    region: 'Tây Nam Bộ',
    priceRange: 'budget',
    priceLabel: '1.500.000 ₫',
    rating: 4.8,
    reviewCount: 162,
    viewCount: 3900,
    tags: ['Rừng ngập nước', 'Miếu bà tâm linh', 'Kiến trúc chùa độc lạ', 'Hồ trên núi'],
    highlights: ['Đi xuồng máy xuyên Rừng tràm Trà Sư', 'Chiêm bái Miếu Bà Chúa Xứ Núi Sam', 'Khám phá Chùa Lầu kiến trúc Nhật Bản', 'Check-in Hồ Tà Pạ tuyệt tình cốc'],
    badge: '🪷 Tâm linh',
    badgeColor: 'bg-violet-500',
    author: 'Minh Đức',
    authorAvatar: 'MD',
    completedDate: '04/2026',
    description: 'Hành trình 2 ngày xuôi về An Giang sông nước. Trải nghiệm xuồng ba lá lướt trên thảm bèo xanh ngắt rừng tràm, viếng miếu Bà Chúa Xứ linh thiêng và chụp ảnh tuyệt đẹp tại hồ đá Tà Pạ.',
    stops: [
      { name: 'Rừng tràm Trà Sư', city: 'An Giang', image: 'https://vcdn1-dulich.vnecdn.net/2023/10/18/TS11-8180-1697622340.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=G8McufUbNSdLbhbsANpdEg', category: 'nature', rating: 4.9, description: 'Hệ sinh thái rừng ngập nước ngập tràn bèo cám xanh mát', coordinates: { lat: 10.58505, lng: 105.05793 } },
      { name: 'Miếu Bà Chúa Xứ Núi Sam', city: 'An Giang', image: 'https://static.vinwonders.com/production/2025/09/mieu-ba-chua-xu-nui-sam-topbanner.jpg', category: 'heritage', rating: 4.9, description: 'Điểm du lịch tâm linh linh thiêng bậc nhất Tây Nam Bộ', coordinates: { lat: 10.68214, lng: 105.0802 } },
      { name: 'Chùa Lầu (Phước Lâm Tự)', city: 'An Giang', image: 'https://thamhiemmekong.com/wp-content/uploads/2019/11/chua-lau-01.jpg', category: 'heritage', rating: 4.7, description: 'Ngôi chùa cổ kính xây chồng tầng mang phong cách Nhật Bản độc lạ', coordinates: { lat: 10.6014, lng: 104.9533 } },
      { name: 'Hồ Tà Pạ', city: 'An Giang', image: 'https://mia.vn/media/uploads/blog-du-lich/kham-pha-ho-da-doi-ta-pa-tuyet-tinh-coc-giua-long-an-giang-4-1660655185.jpg', category: 'nature', rating: 4.7, description: 'Hồ nước trong veo màu ngọc bích nằm lọt thỏm giữa vách đá', coordinates: { lat: 10.41525, lng: 104.99335 } }
    ],
    reviews: [
      { name: 'Thanh Nhàn', avatar: 'TN', date: '04/2026', rating: 5, text: 'Rừng tràm Trà Sư tuyệt đẹp! Đi xuồng máy lướt nhẹ trên bèo cảm giác cực kỳ thư giãn. Miếu Bà Chúa Xứ rất linh thiêng.', helpful: 27 },
      { name: 'Văn Nam', avatar: 'VN', date: '03/2026', rating: 4, text: 'Chùa Lầu chụp ảnh cực ảo. Lẩu mắm và bún cá Châu Đốc ăn siêu ngon.', helpful: 16 }
    ]
  },
  {
    "id": "ct-23",
    "title": "2 Ngày Hà Nội — Thủ Đô Ngàn Năm Văn Hiến",
    "coverImage": "https://static.vinwonders.com/production/ho-hoan-kiem-2.jpg",
    "duration": "2 ngày 1 đêm",
    "days": 2,
    "category": "Thành phố",
    "categoryIcon": "🏙️",
    "region": "Miền Bắc",
    "priceRange": "budget",
    "priceLabel": "1.700.000 ₫",
    "rating": 4.7,
    "reviewCount": 305,
    "viewCount": 11800,
    "tags": [
      "Phố cổ 36 phố phường",
      "Kiến trúc Pháp",
      "Văn hóa lịch sử",
      "Ẩm thực đường phố"
    ],
    "highlights": [
      "Dạo quanh Hồ Hoàn Kiếm & Đền Ngọc Sơn",
      "Tham quan Văn Miếu Quốc Tử Giám",
      "Viếng Lăng Chủ tịch Hồ Chí Minh",
      "Thưởng thức ẩm thực Phố cổ về đêm"
    ],
    "badge": "🏙️ Cổ kính",
    "badgeColor": "bg-rose-500",
    "author": "Thu Phương",
    "authorAvatar": "TP",
    "completedDate": "04/2026",
    "description": "Hành trình 2 ngày khám phá trái tim của cả nước. Hà Nội với những con phố cổ rêu phong, hồ Gươm thơ mộng, kiến trúc Pháp cổ kính và thiên đường ẩm thực đường phố làm say lòng du khách.",
    "stops": [
      {
        "name": "Hồ Hoàn Kiếm",
        "city": "Hà Nội",
        "image": "https://banqldtdthanoi.vn/wp-content/uploads/2021/12/ho-hoa-kiem.jpg",
        "category": "city",
        "rating": 4.8,
        "description": "Trái tim của thủ đô với Tháp Rùa và Đền Ngọc Sơn cổ kính",
        "coordinates": {
          "lat": 21.0287,
          "lng": 105.8524
        }
      },
      {
        "name": "Văn Miếu — Quốc Tử Giám",
        "city": "Hà Nội",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/39/Hanoi_Temple_of_Literature_%28cropped%29.jpg",
        "category": "heritage",
        "rating": 4.7,
        "description": "Trường đại học đầu tiên của Việt Nam, biểu tượng hiếu học",
        "coordinates": {
          "lat": 21.0294,
          "lng": 105.8355
        }
      },
      {
        "name": "Lăng Chủ tịch Hồ Chí Minh",
        "city": "Hà Nội",
        "image": "https://hanoiairporthotels.vn/media/1579/lang-chu-tich-ho-chi-minh-lang-bac.png?width=932&height=496",
        "category": "heritage",
        "rating": 4.8,
        "description": "Nơi an nghỉ của Bác Hồ trên quảng trường Ba Đình lịch sử",
        "coordinates": {
          "lat": 21.0368,
          "lng": 105.8344
        }
      },
      {
        "name": "Phố cổ Hà Nội",
        "city": "Hà Nội",
        "image": "https://booking.muongthanh.com/upload_images/images/H%60/36-pho-phuong-ha-noi.jpg",
        "category": "city",
        "rating": 4.6,
        "description": "Khu 36 phố phường sầm uất, thiên đường ẩm thực đường phố",
        "coordinates": {
          "lat": 21.034,
          "lng": 105.85
        }
      }
    ],
    "reviews": [
      {
        "name": "Gia Hân",
        "avatar": "GH",
        "date": "04/2026",
        "rating": 5,
        "text": "Phố cổ về đêm cực kỳ nhộn nhịp, ăn bún chả, phở, cà phê trứng ngon mê ly. Hồ Gươm sáng sớm yên bình lắm.",
        "helpful": 47
      },
      {
        "name": "Tiến Đạt",
        "avatar": "TĐ",
        "date": "03/2026",
        "rating": 4,
        "text": "Văn Miếu rất đẹp và ý nghĩa, nên thuê hướng dẫn viên để hiểu hết lịch sử. Giao thông hơi đông nhưng đáng trải nghiệm.",
        "helpful": 23
      }
    ]
  },
  {
    "id": "ct-24",
    "title": "3 Ngày Cát Bà — Vịnh Lan Hạ Hoang Sơ",
    "coverImage": "https://media.anhp.vn/files/2023/05IMG_8209.jpg",
    "duration": "3 ngày 2 đêm",
    "days": 3,
    "category": "Biển",
    "categoryIcon": "🏖️",
    "region": "Miền Bắc",
    "priceRange": "mid-range",
    "priceLabel": "4.300.000 ₫",
    "rating": 4.8,
    "reviewCount": 214,
    "viewCount": 7300,
    "tags": [
      "Vịnh biển hoang sơ",
      "Chèo kayak",
      "Vườn quốc gia",
      "Hải sản tươi"
    ],
    "highlights": [
      "Du thuyền khám phá Vịnh Lan Hạ",
      "Chèo kayak qua các hòn đảo đá vôi",
      "Trekking Vườn quốc gia Cát Bà",
      "Tắm biển bãi Cát Cò trong xanh"
    ],
    "badge": "🌊 Hoang sơ",
    "badgeColor": "bg-cyan-500",
    "author": "Hải Đăng",
    "authorAvatar": "HĐ",
    "completedDate": "04/2026",
    "description": "Hành trình 3 ngày khám phá hòn đảo lớn nhất vịnh Bắc Bộ. Vịnh Lan Hạ được ví như Hạ Long thu nhỏ nhưng hoang sơ hơn, nước trong xanh và ít tàu thuyền, lý tưởng cho chèo kayak và tắm biển.",
    "stops": [
      {
        "name": "Vịnh Lan Hạ",
        "city": "Cát Bà",
        "image": "http://cafefcdn.com/2020/1/30/photo-1-15803789206371731421208.jpg",
        "category": "nature",
        "rating": 4.9,
        "description": "Vịnh biển hoang sơ với hàng trăm hòn đảo đá vôi kỳ vĩ",
        "coordinates": {
          "lat": 20.7167,
          "lng": 107.0833
        }
      },
      {
        "name": "Đảo Cát Bà",
        "city": "Hải Phòng",
        "image": "https://media.anhp.vn/files/2023/11IMG_8463.jpg",
        "category": "island",
        "rating": 4.6,
        "description": "Hòn đảo lớn nhất quần đảo Cát Bà nhộn nhịp về đêm",
        "coordinates": {
          "lat": 20.7283,
          "lng": 107.0489
        }
      },
      {
        "name": "Vườn quốc gia Cát Bà",
        "city": "Cát Bà",
        "image": "https://vuonquocgiacatba.com.vn/wp-content/uploads/2025/07/default_image.jpg",
        "category": "nature",
        "rating": 4.7,
        "description": "Khu dự trữ sinh quyển thế giới với loài voọc Cát Bà quý hiếm",
        "coordinates": {
          "lat": 20.795,
          "lng": 106.9986
        }
      },
      {
        "name": "Bãi tắm Cát Cò",
        "city": "Cát Bà",
        "image": "https://statics.vinpearl.com/bai-tam-cat-co-4_1634185329.jpg",
        "category": "beach",
        "rating": 4.6,
        "description": "Bãi tắm nước trong vắt nép mình dưới chân vách núi",
        "coordinates": {
          "lat": 20.7197,
          "lng": 107.0506
        }
      }
    ],
    "reviews": [
      {
        "name": "Phương Anh",
        "avatar": "PA",
        "date": "04/2026",
        "rating": 5,
        "text": "Vịnh Lan Hạ đẹp không kém Hạ Long mà vắng hơn nhiều. Chèo kayak luồn lách qua các đảo đá cực thích. Hải sản tươi và rẻ!",
        "helpful": 35
      },
      {
        "name": "Minh Quân",
        "avatar": "MQ",
        "date": "03/2026",
        "rating": 4,
        "text": "Bãi Cát Cò nước xanh ngắt. Trekking vườn quốc gia hơi mệt nhưng view trên cao toàn đảo rất đáng.",
        "helpful": 18
      }
    ]
  },
  {
    "id": "ct-25",
    "title": "3 Ngày Cao Bằng — Thác Bản Giốc Hùng Vĩ",
    "coverImage": "https://file-dangcongsan.nhandan.vn/data/0/images/2022/10/04/phuongthanhsk/anh-cao-bang-123.jpg",
    "duration": "3 ngày 2 đêm",
    "days": 3,
    "category": "Núi",
    "categoryIcon": "🏔️",
    "region": "Đông Bắc",
    "priceRange": "mid-range",
    "priceLabel": "3.900.000 ₫",
    "rating": 4.9,
    "reviewCount": 176,
    "viewCount": 5600,
    "tags": [
      "Thác nước hùng vĩ",
      "Hang động kỳ bí",
      "Di tích cách mạng",
      "Hồ trên núi"
    ],
    "highlights": [
      "Chiêm ngưỡng Thác Bản Giốc hùng vĩ",
      "Khám phá Động Ngườm Ngao thạch nhũ",
      "Về nguồn tại Khu di tích Pác Bó",
      "Ngắm Hồ Thang Hen xanh biếc"
    ],
    "badge": "💧 Thác đẹp nhất",
    "badgeColor": "bg-teal-600",
    "author": "Đức Trung",
    "authorAvatar": "ĐT",
    "completedDate": "03/2026",
    "description": "Hành trình 3 ngày chinh phục vùng non nước Cao Bằng. Đứng trước thác Bản Giốc — thác nước tự nhiên lớn nhất Đông Nam Á, len lỏi trong động Ngườm Ngao kỳ ảo và về nguồn nơi Bác Hồ từng sống.",
    "stops": [
      {
        "name": "Thác Bản Giốc",
        "city": "Cao Bằng",
        "image": "https://ik.imagekit.io/tvlk/blog/2023/08/thac-ban-gioc-cao-bang.jpg",
        "category": "nature",
        "rating": 5,
        "description": "Thác nước tự nhiên lớn nhất Đông Nam Á nơi biên giới Việt-Trung",
        "coordinates": {
          "lat": 22.8533,
          "lng": 106.7236
        }
      },
      {
        "name": "Động Ngườm Ngao",
        "city": "Cao Bằng",
        "image": "https://images2.thanhnien.vn/528068263637045248/2023/5/2/dong-nguom-ngao-1-16829902009791799997902.jpg",
        "category": "nature",
        "rating": 4.8,
        "description": "Hang động thạch nhũ kỳ ảo dài hàng cây số",
        "coordinates": {
          "lat": 22.8417,
          "lng": 106.7053
        }
      },
      {
        "name": "Khu di tích Pác Bó",
        "city": "Cao Bằng",
        "image": "https://baotanghochiminh.vn/pic/Service/images/Pac%20Bo%20-%20Cao%20Bang%20HT%20(Large).jpg",
        "category": "heritage",
        "rating": 4.7,
        "description": "Nơi Bác Hồ trở về sau 30 năm bôn ba với suối Lê Nin, núi Các Mác",
        "coordinates": {
          "lat": 22.9744,
          "lng": 105.9986
        }
      },
      {
        "name": "Hồ Thang Hen",
        "city": "Cao Bằng",
        "image": "https://ik.imagekit.io/tvlk/blog/2023/04/ho-thang-hen-6.jpg?tr=q-70,c-at_max,w-1000,h-600",
        "category": "nature",
        "rating": 4.6,
        "description": "Hồ nước ngọt xanh biếc giữa thung lũng núi đá tai mèo",
        "coordinates": {
          "lat": 22.7117,
          "lng": 106.1747
        }
      }
    ],
    "reviews": [
      {
        "name": "Hoàng Nam",
        "avatar": "HN",
        "date": "03/2026",
        "rating": 5,
        "text": "Bản Giốc hùng vĩ ngoài sức tưởng tượng, tiếng nước đổ ầm ầm. Đi bè tre tới sát chân thác cực đã. Cảnh đẹp nhất Đông Bắc!",
        "helpful": 41
      },
      {
        "name": "Lan Phương",
        "avatar": "LP",
        "date": "02/2026",
        "rating": 5,
        "text": "Động Ngườm Ngao thạch nhũ lung linh, mát lạnh. Người Tày ở đây hiền hậu, ăn vịt quay 7 vị Cao Bằng siêu ngon.",
        "helpful": 24
      }
    ]
  },
  {
    "id": "ct-26",
    "title": "2 Ngày Mộc Châu — Cao Nguyên Xanh Tây Bắc",
    "coverImage": "https://owa.bestprice.vn/images/destinations/uploads/nong-truong-che-moc-chau-600a9fff49a89.jpg",
    "duration": "2 ngày 1 đêm",
    "days": 2,
    "category": "Núi",
    "categoryIcon": "🏔️",
    "region": "Tây Bắc",
    "priceRange": "budget",
    "priceLabel": "1.600.000 ₫",
    "rating": 4.7,
    "reviewCount": 201,
    "viewCount": 6900,
    "tags": [
      "Đồi chè xanh mướt",
      "Thác nước",
      "Mùa hoa mận hoa cải",
      "Bản làng dân tộc"
    ],
    "highlights": [
      "Check-in Đồi chè trái tim biểu tượng",
      "Tắm mát tại Thác Dải Yếm",
      "Cắm trại tại Rừng thông bản Áng",
      "Ngắm thung lũng mận Nà Ka mùa hoa"
    ],
    "badge": "🍃 Mát lành",
    "badgeColor": "bg-green-600",
    "author": "Bảo Ngọc",
    "authorAvatar": "BN",
    "completedDate": "02/2026",
    "description": "Hành trình 2 ngày trốn nóng tại cao nguyên Mộc Châu xanh mát. Lạc giữa những đồi chè trải dài bất tận, tắm dưới dòng thác Dải Yếm trắng xóa và ngắm sắc trắng hoa mận phủ kín thung lũng.",
    "stops": [
      {
        "name": "Đồi chè trái tim",
        "city": "Mộc Châu",
        "image": "https://booking.muongthanh.com/upload_images/images/H%60/doi-che-trai-tim-moc-chau(1).jpg",
        "category": "countryside",
        "rating": 4.8,
        "description": "Đồi chè hình trái tim biểu tượng check-in của Mộc Châu",
        "coordinates": {
          "lat": 20.8369,
          "lng": 104.6692
        }
      },
      {
        "name": "Thác Dải Yếm",
        "city": "Mộc Châu",
        "image": "https://owa.bestprice.vn/images/destinations/uploads/thac-dai-yem-6006600f5da59.jpg",
        "category": "nature",
        "rating": 4.7,
        "description": "Thác nước trắng xóa đổ xuống từ độ cao 100m",
        "coordinates": {
          "lat": 20.8197,
          "lng": 104.6256
        }
      },
      {
        "name": "Rừng thông bản Áng",
        "city": "Mộc Châu",
        "image": "https://booking.muongthanh.com/upload_images/images/H%60/rung-thong-ban-ang-moc-chau.jpg",
        "category": "countryside",
        "rating": 4.6,
        "description": "Rừng thông bên hồ nước thơ mộng, điểm cắm trại lý tưởng",
        "coordinates": {
          "lat": 20.85,
          "lng": 104.6892
        }
      },
      {
        "name": "Thung lũng mận Nà Ka",
        "city": "Mộc Châu",
        "image": "https://booking.muongthanh.com/upload_images/images/H%60/thung-lung-man-na-ka-moc-chau(1).jpg",
        "category": "countryside",
        "rating": 4.7,
        "description": "Thung lũng mận bạt ngàn nở trắng vào mùa xuân",
        "coordinates": {
          "lat": 20.8742,
          "lng": 104.6606
        }
      }
    ],
    "reviews": [
      {
        "name": "Khánh Vy",
        "avatar": "KV",
        "date": "02/2026",
        "rating": 5,
        "text": "Đồi chè xanh mướt mắt, không khí trong lành mát rượi. Sữa chua, bê chao Mộc Châu ăn là ghiền. Rất hợp đi cuối tuần!",
        "helpful": 38
      },
      {
        "name": "Trọng Nghĩa",
        "avatar": "TN",
        "date": "01/2026",
        "rating": 4,
        "text": "Thác Dải Yếm mùa nước đẹp lắm. Cắm trại rừng thông bản Áng buổi tối se lạnh rất chill.",
        "helpful": 17
      }
    ]
  },
  {
    "id": "ct-27",
    "title": "2 Ngày Hồ Ba Bể — Viên Ngọc Xanh Bắc Kạn",
    "coverImage": "https://booking.pystravel.vn/uploads/posts/avatar/1692006444.jpg",
    "duration": "2 ngày 1 đêm",
    "days": 2,
    "category": "Núi",
    "categoryIcon": "🏔️",
    "region": "Đông Bắc",
    "priceRange": "budget",
    "priceLabel": "1.500.000 ₫",
    "rating": 4.7,
    "reviewCount": 132,
    "viewCount": 4100,
    "tags": [
      "Hồ nước ngọt tự nhiên",
      "Đi thuyền độc mộc",
      "Hang động",
      "Vườn quốc gia"
    ],
    "highlights": [
      "Du thuyền trên Hồ Ba Bể yên ả",
      "Khám phá Động Puông kỳ bí",
      "Ngắm Thác Đầu Đẳng nhiều tầng",
      "Ghé Ao Tiên huyền thoại"
    ],
    "badge": "💎 Yên bình",
    "badgeColor": "bg-emerald-600",
    "author": "Thanh Tùng",
    "authorAvatar": "TT",
    "completedDate": "03/2026",
    "description": "Hành trình 2 ngày thư thái giữa lòng hồ nước ngọt tự nhiên lớn nhất Việt Nam. Lênh đênh trên thuyền độc mộc giữa Hồ Ba Bể phẳng lặng, len qua Động Puông rộng lớn và nghỉ tại homestay người Tày.",
    "stops": [
      {
        "name": "Hồ Ba Bể",
        "city": "Bắc Kạn",
        "image": "https://ik.imagekit.io/tvlk/blog/2022/10/kinh-nghiem-du-lich-ho-ba-be-1.jpg?tr=q-70,c-at_max,w-1000,h-600",
        "category": "nature",
        "rating": 4.9,
        "description": "Hồ nước ngọt tự nhiên trên núi lớn nhất Việt Nam",
        "coordinates": {
          "lat": 22.4019,
          "lng": 105.6178
        }
      },
      {
        "name": "Động Puông",
        "city": "Bắc Kạn",
        "image": "https://www.kynghidongduong.vn/storage/posts/2_dong-puong-ho-ba-be-bac-kan-viet-nam-kynghidongduong-vn-02-nguon-dinh-manh-ha.jpg",
        "category": "nature",
        "rating": 4.7,
        "description": "Hang động lớn nơi sông Năng chảy xuyên qua lòng núi",
        "coordinates": {
          "lat": 22.45,
          "lng": 105.6167
        }
      },
      {
        "name": "Thác Đầu Đẳng",
        "city": "Bắc Kạn",
        "image": "https://ik.imagekit.io/tvlk/blog/2022/10/thac-dau-dang-1.jpg?tr=q-70,c-at_max,w-1000,h-600",
        "category": "nature",
        "rating": 4.6,
        "description": "Thác nước nhiều tầng đổ qua những tảng đá lớn giữa rừng",
        "coordinates": {
          "lat": 22.3667,
          "lng": 105.6333
        }
      },
      {
        "name": "Ao Tiên",
        "city": "Bắc Kạn",
        "image": "https://dulichnahang.com/files/assets/ao_tien_vuon_quoc_gia_ba_be_02.jpg",
        "category": "nature",
        "rating": 4.5,
        "description": "Hồ nước nhỏ trong vắt gắn với truyền thuyết tiên giáng trần",
        "coordinates": {
          "lat": 22.405,
          "lng": 105.62
        }
      }
    ],
    "reviews": [
      {
        "name": "Quỳnh Anh",
        "avatar": "QA",
        "date": "03/2026",
        "rating": 5,
        "text": "Hồ Ba Bể yên bình đến lạ, ngồi thuyền độc mộc giữa hồ cảm giác thư giãn vô cùng. Homestay người Tày ấm cúng, đồ ăn ngon.",
        "helpful": 29
      },
      {
        "name": "Đăng Khoa",
        "avatar": "ĐK",
        "date": "02/2026",
        "rating": 4,
        "text": "Động Puông đi thuyền xuyên qua rất thích, nhiều dơi. Đường lên hơi xa nhưng cảnh quan bù đắp xứng đáng.",
        "helpful": 13
      }
    ]
  },
  {
    "id": "ct-28",
    "title": "2 Ngày Tam Đảo — Thị Trấn Trong Mây",
    "coverImage": "https://media-cdn-v2.laodong.vn/storage/newsportal/2022/2/6/1001553/Tam-Dao-Thi-Tran-Mo-.jpeg",
    "duration": "2 ngày 1 đêm",
    "days": 2,
    "category": "Núi",
    "categoryIcon": "🏔️",
    "region": "Miền Bắc",
    "priceRange": "budget",
    "priceLabel": "1.400.000 ₫",
    "rating": 4.6,
    "reviewCount": 256,
    "viewCount": 9100,
    "tags": [
      "Thị trấn trong mây",
      "Khí hậu mát mẻ",
      "Nhà thờ đá",
      "Săn mây"
    ],
    "highlights": [
      "Săn mây tại thị trấn Tam Đảo",
      "Check-in Nhà thờ đá cổ kính",
      "Khám phá Thác Bạc mát lạnh",
      "Ngắm toàn cảnh từ Tháp truyền hình"
    ],
    "badge": "☁️ Săn mây",
    "badgeColor": "bg-slate-500",
    "author": "Mỹ Linh",
    "authorAvatar": "ML",
    "completedDate": "04/2026",
    "description": "Hành trình 2 ngày đổi gió tại thị trấn nghỉ mát trong mây Tam Đảo. Chỉ cách Hà Nội hơn 80km, nơi đây quanh năm mát mẻ với màn sương mờ ảo, nhà thờ đá Pháp cổ và những quán cà phê view núi tuyệt đẹp.",
    "stops": [
      {
        "name": "Thị trấn Tam Đảo",
        "city": "Vĩnh Phúc",
        "image": "https://images.vietnamtourism.gov.vn/vn//images/2021/thang_12/0112.tamdao1.jpg",
        "category": "city",
        "rating": 4.7,
        "description": "Thị trấn nghỉ dưỡng trên núi quanh năm mây mù bao phủ",
        "coordinates": {
          "lat": 21.4561,
          "lng": 105.6447
        }
      },
      {
        "name": "Nhà thờ đá Tam Đảo",
        "city": "Tam Đảo",
        "image": "https://cdn3.ivivu.com/2022/12/nh%C3%A0-th%E1%BB%9D-%C4%91%C3%A1-Tam-%C4%90%E1%BA%A3o-ivivu-2.jpg",
        "category": "heritage",
        "rating": 4.7,
        "description": "Nhà thờ Pháp cổ bằng đá, biểu tượng check-in của Tam Đảo",
        "coordinates": {
          "lat": 21.4567,
          "lng": 105.645
        }
      },
      {
        "name": "Thác Bạc",
        "city": "Tam Đảo",
        "image": "https://cdn.xanhsm.com/2025/02/338e9e65-thac-bac-tam-dao-1.jpg",
        "category": "nature",
        "rating": 4.4,
        "description": "Dòng thác trắng xóa len qua khe núi giữa rừng cây",
        "coordinates": {
          "lat": 21.4592,
          "lng": 105.6442
        }
      },
      {
        "name": "Tháp truyền hình Tam Đảo",
        "city": "Tam Đảo",
        "image": "https://cdn.justfly.vn/1152x1548/media/202310/24/1698138040-justfly-thap-truyen-hinh-tam-dao-vinh-phuc3.jpg",
        "category": "mountain",
        "rating": 4.5,
        "description": "Đỉnh cao nhất Tam Đảo với hơn 1.300 bậc thang săn mây",
        "coordinates": {
          "lat": 21.4486,
          "lng": 105.6494
        }
      }
    ],
    "reviews": [
      {
        "name": "Hồng Nhung",
        "avatar": "HN",
        "date": "04/2026",
        "rating": 5,
        "text": "Trốn nóng Hà Nội lên Tam Đảo quá hợp lý. Sáng sớm mây phủ kín đường đẹp như tiên cảnh. Nhà thờ đá chụp ảnh siêu nghệ.",
        "helpful": 44
      },
      {
        "name": "Văn Hậu",
        "avatar": "VH",
        "date": "03/2026",
        "rating": 4,
        "text": "Leo tháp truyền hình hơi mệt nhưng săn mây trên đỉnh đáng giá. Đồ nướng và ngọn su su Tam Đảo ăn ngon.",
        "helpful": 19
      }
    ]
  },
  {
    "id": "ct-29",
    "title": "2 Ngày Bắc Ninh — Miền Quan Họ Kinh Bắc",
    "coverImage": "https://bizweb.dktcdn.net/100/006/093/files/den-do-7.jpg?v=1705715565914",
    "duration": "2 ngày 1 đêm",
    "days": 2,
    "category": "Di sản",
    "categoryIcon": "🏛️",
    "region": "Miền Bắc",
    "priceRange": "budget",
    "priceLabel": "1.300.000 ₫",
    "rating": 4.6,
    "reviewCount": 118,
    "viewCount": 3500,
    "tags": [
      "Dân ca Quan họ",
      "Chùa cổ",
      "Làng tranh dân gian",
      "Văn hóa Kinh Bắc"
    ],
    "highlights": [
      "Viếng Đền Đô thờ 8 vị vua Lý",
      "Chiêm bái Chùa Bút Tháp cổ kính",
      "Tham quan Chùa Dâu ngôi chùa cổ nhất",
      "Khám phá Làng tranh Đông Hồ"
    ],
    "badge": "🎎 Văn hóa",
    "badgeColor": "bg-amber-600",
    "author": "Quốc Huy",
    "authorAvatar": "QH",
    "completedDate": "03/2026",
    "description": "Hành trình 2 ngày về miền Kinh Bắc — cái nôi của dân ca Quan họ. Lắng nghe những làn điệu giao duyên ngọt ngào, chiêm bái các ngôi chùa cổ nghìn năm tuổi và tìm hiểu nghề tranh dân gian Đông Hồ.",
    "stops": [
      {
        "name": "Đền Đô",
        "city": "Bắc Ninh",
        "image": "https://bizweb.dktcdn.net/100/405/413/articles/den-do.jpg?v=1730306705947",
        "category": "heritage",
        "rating": 4.7,
        "description": "Đền thờ 8 vị vua nhà Lý với kiến trúc bề thế cổ kính",
        "coordinates": {
          "lat": 21.1306,
          "lng": 105.9569
        }
      },
      {
        "name": "Chùa Bút Tháp",
        "city": "Bắc Ninh",
        "image": "https://ik.imagekit.io/tvlk/blog/2023/06/chua-but-thap-4.jpg",
        "category": "heritage",
        "rating": 4.8,
        "description": "Ngôi chùa cổ lưu giữ tượng Phật Quan Âm nghìn mắt nghìn tay",
        "coordinates": {
          "lat": 21.0606,
          "lng": 106.0667
        }
      },
      {
        "name": "Chùa Dâu",
        "city": "Bắc Ninh",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Dau_pagoda.jpg",
        "category": "heritage",
        "rating": 4.6,
        "description": "Ngôi chùa Phật giáo cổ nhất Việt Nam gần 2.000 năm tuổi",
        "coordinates": {
          "lat": 21.05,
          "lng": 106.0333
        }
      },
      {
        "name": "Làng tranh Đông Hồ",
        "city": "Bắc Ninh",
        "image": "https://statics.vinpearl.com/lang-tranh-dong-ho-2_1678375779.jpg",
        "category": "countryside",
        "rating": 4.5,
        "description": "Làng nghề làm tranh dân gian truyền thống nổi tiếng",
        "coordinates": {
          "lat": 21.0497,
          "lng": 106.0703
        }
      }
    ],
    "reviews": [
      {
        "name": "Diệu Linh",
        "avatar": "DL",
        "date": "03/2026",
        "rating": 5,
        "text": "Được nghe các liền anh liền chị hát Quan họ rất xúc động. Chùa Bút Tháp kiến trúc tinh xảo, tượng nghìn tay nghìn mắt quá ấn tượng.",
        "helpful": 22
      },
      {
        "name": "Bá Lộc",
        "avatar": "BL",
        "date": "02/2026",
        "rating": 4,
        "text": "Tour văn hóa nhẹ nhàng, hợp cho người thích lịch sử. Mua tranh Đông Hồ về làm quà rất ý nghĩa. Bánh phu thê Bắc Ninh ngon.",
        "helpful": 11
      }
    ]
  },
  {
    "id": "ct-30",
    "title": "3 Ngày Buôn Ma Thuột — Thủ Phủ Cà Phê",
    "coverImage": "https://cdn.xanhsm.com/2024/12/056ebcc3-thac-dray-nu-1.jpg",
    "duration": "3 ngày 2 đêm",
    "days": 3,
    "category": "Núi",
    "categoryIcon": "🏔️",
    "region": "Tây Nguyên",
    "priceRange": "mid-range",
    "priceLabel": "3.400.000 ₫",
    "rating": 4.7,
    "reviewCount": 163,
    "viewCount": 4800,
    "tags": [
      "Cà phê Tây Nguyên",
      "Thác nước hùng vĩ",
      "Văn hóa cồng chiêng",
      "Cưỡi voi"
    ],
    "highlights": [
      "Chiêm ngưỡng Thác Dray Nur hùng vĩ",
      "Tham quan Bảo tàng Thế giới Cà phê",
      "Trải nghiệm Buôn Đôn cưỡi voi",
      "Du thuyền ngắm hoàng hôn Hồ Lắk"
    ],
    "badge": "☕ Đậm đà",
    "badgeColor": "bg-amber-700",
    "author": "Hữu Tài",
    "authorAvatar": "HT",
    "completedDate": "03/2026",
    "description": "Hành trình 3 ngày khám phá thủ phủ cà phê Việt Nam giữa đại ngàn Tây Nguyên. Đắm mình trong hương cà phê nồng nàn, đứng trước thác Dray Nur tung bọt trắng xóa và nghe tiếng cồng chiêng vang vọng bên Hồ Lắk.",
    "stops": [
      {
        "name": "Thác Dray Nur",
        "city": "Đắk Lắk",
        "image": "https://cdn.xanhsm.com/2024/12/056ebcc3-thac-dray-nu-1.jpg",
        "category": "nature",
        "rating": 4.8,
        "description": "Thác nước hùng vĩ rộng lớn được mệnh danh đệ nhất Tây Nguyên",
        "coordinates": {
          "lat": 12.5347,
          "lng": 107.9986
        }
      },
      {
        "name": "Bảo tàng Thế giới Cà phê",
        "city": "Buôn Ma Thuột",
        "image": "https://baotangthegioicaphe.com/Data/Sites/1/media/home-ft-image.jpeg",
        "category": "city",
        "rating": 4.7,
        "description": "Không gian trưng bày văn hóa cà phê độc đáo bậc nhất",
        "coordinates": {
          "lat": 12.685,
          "lng": 108.0289
        }
      },
      {
        "name": "Buôn Đôn",
        "city": "Đắk Lắk",
        "image": "http://zoomtravel.vn/upload/news/cau-treo-buon-don31020.jpeg",
        "category": "countryside",
        "rating": 4.5,
        "description": "Buôn làng nổi tiếng với nghề săn voi và cầu treo bắc qua sông",
        "coordinates": {
          "lat": 12.8983,
          "lng": 107.7686
        }
      },
      {
        "name": "Hồ Lắk",
        "city": "Đắk Lắk",
        "image": "https://www.vietnambooking.com/wp-content/uploads/2024/01/ho-lak-4.jpg",
        "category": "nature",
        "rating": 4.6,
        "description": "Hồ nước ngọt tự nhiên lớn bên buôn làng người M'Nông",
        "coordinates": {
          "lat": 12.4197,
          "lng": 108.1817
        }
      }
    ],
    "reviews": [
      {
        "name": "Thành Long",
        "avatar": "TL",
        "date": "03/2026",
        "rating": 5,
        "text": "Thác Dray Nur quá hùng vĩ, đứng gần cảm nhận hơi nước mát lạnh. Cà phê Buôn Ma Thuột uống tại gốc đậm đà khác hẳn.",
        "helpful": 31
      },
      {
        "name": "Ái Vân",
        "avatar": "AV",
        "date": "02/2026",
        "rating": 4,
        "text": "Bảo tàng cà phê thiết kế rất đẹp và lạ. Hoàng hôn trên Hồ Lắk yên bình, được nghe cồng chiêng rất đặc sắc.",
        "helpful": 16
      }
    ]
  },
  {
    "id": "ct-31",
    "title": "3 Ngày Pleiku — Phố Núi Gia Lai Mộng Mơ",
    "coverImage": "https://images.vietnamtourism.gov.vn/vn/images/2021/Thang_6/ho_t%27nung__gia_lai_1572000946_resize.jpeg",
    "duration": "3 ngày 2 đêm",
    "days": 3,
    "category": "Núi",
    "categoryIcon": "🏔️",
    "region": "Tây Nguyên",
    "priceRange": "budget",
    "priceLabel": "2.700.000 ₫",
    "rating": 4.7,
    "reviewCount": 141,
    "viewCount": 4300,
    "tags": [
      "Hồ nước trên núi",
      "Núi lửa",
      "Chùa kiến trúc độc đáo",
      "Thác nước"
    ],
    "highlights": [
      "Ngắm Biển Hồ — đôi mắt Pleiku",
      "Chiêm bái Chùa Minh Thành nguy nga",
      "Leo núi lửa Chư Đăng Ya",
      "Khám phá Thác Phú Cường"
    ],
    "badge": "🌋 Phố núi",
    "badgeColor": "bg-orange-600",
    "author": "Nhật Minh",
    "authorAvatar": "NM",
    "completedDate": "04/2026",
    "description": "Hành trình 3 ngày khám phá phố núi Pleiku mộng mơ. Ngắm Biển Hồ trong xanh được ví như đôi mắt Pleiku, chiêm bái ngôi chùa Minh Thành mang kiến trúc Nhật Bản và chinh phục ngọn núi lửa đã ngủ yên Chư Đăng Ya.",
    "stops": [
      {
        "name": "Biển Hồ (Hồ T'Nưng)",
        "city": "Gia Lai",
        "image": "https://images.vietnamtourism.gov.vn/vn/images/2021/Thang_6/ho_t%27nung__gia_lai_1572000946_resize.jpeg",
        "category": "nature",
        "rating": 4.8,
        "description": "Hồ nước ngọt trên núi xanh biếc được ví như đôi mắt Pleiku",
        "coordinates": {
          "lat": 14.0586,
          "lng": 108.0006
        }
      },
      {
        "name": "Chùa Minh Thành",
        "city": "Pleiku",
        "image": "https://datviettour.com.vn/uploads/images/tin-tuc-SEO/tay-nguyen/danh-thang/chua-minh-thanh-pleiku.jpg",
        "category": "heritage",
        "rating": 4.8,
        "description": "Ngôi chùa nguy nga mang đậm kiến trúc Phật giáo Nhật Bản",
        "coordinates": {
          "lat": 13.9656,
          "lng": 107.9986
        }
      },
      {
        "name": "Núi lửa Chư Đăng Ya",
        "city": "Gia Lai",
        "image": "https://images.vietnamtourism.gov.vn/vn/images/2021/Thang_6/nui_lua_chu_dang_ya__gia_lai_1572025654_resize.jpeg",
        "category": "mountain",
        "rating": 4.7,
        "description": "Núi lửa đã tắt phủ kín hoa dã quỳ vàng rực mùa khô",
        "coordinates": {
          "lat": 14.1561,
          "lng": 108.0747
        }
      },
      {
        "name": "Thác Phú Cường",
        "city": "Gia Lai",
        "image": "https://lalago.vn/wp-content/uploads/2025/06/Thac-Phu-Cuong-14.jpg",
        "category": "nature",
        "rating": 4.6,
        "description": "Dòng thác đổ xuống nền nham thạch núi lửa độc đáo",
        "coordinates": {
          "lat": 13.7406,
          "lng": 108.1186
        }
      }
    ],
    "reviews": [
      {
        "name": "Tường Vy",
        "avatar": "TV",
        "date": "04/2026",
        "rating": 5,
        "text": "Biển Hồ buổi sáng trong xanh phẳng lặng, hàng thông hai bên đường đẹp như phim. Chùa Minh Thành kiến trúc cực hoành tráng.",
        "helpful": 27
      },
      {
        "name": "Gia Khang",
        "avatar": "GK",
        "date": "03/2026",
        "rating": 4,
        "text": "Núi lửa Chư Đăng Ya mùa dã quỳ vàng rực rất đáng đi. Phở khô Gia Lai (phở hai tô) ăn lạ miệng và ngon.",
        "helpful": 14
      }
    ]
  },
  {
    "id": "ct-32",
    "title": "3 Ngày Lý Sơn — Đảo Tiền Tiêu Quảng Ngãi",
    "coverImage": "https://statics.vinpearl.com/cong-to-vo-ly-son_1747494704.jpg",
    "duration": "3 ngày 2 đêm",
    "days": 3,
    "category": "Biển",
    "categoryIcon": "🏖️",
    "region": "Miền Trung",
    "priceRange": "mid-range",
    "priceLabel": "3.300.000 ₫",
    "rating": 4.8,
    "reviewCount": 172,
    "viewCount": 5400,
    "tags": [
      "Đảo núi lửa",
      "Cánh đồng tỏi",
      "Lặn ngắm san hô",
      "Biển xanh hoang sơ"
    ],
    "highlights": [
      "Săn ảnh bình minh tại Cổng Tò Vò",
      "Leo đỉnh Thới Lới ngắm toàn đảo",
      "Tắm biển hoang sơ tại Hang Câu",
      "Khám phá vương quốc tỏi Lý Sơn"
    ],
    "badge": "🧄 Đảo tỏi",
    "badgeColor": "bg-cyan-600",
    "author": "Hải Yến",
    "authorAvatar": "HY",
    "completedDate": "04/2026",
    "description": "Hành trình 3 ngày khám phá đảo tiền tiêu Lý Sơn — hòn đảo núi lửa giữa biển khơi. Đón bình minh nơi Cổng Tò Vò huyền thoại, đứng trên miệng núi lửa Thới Lới ngắm biển trời và đắm mình trong làn nước xanh ngọc bích.",
    "stops": [
      {
        "name": "Cổng Tò Vò",
        "city": "Lý Sơn",
        "image": "https://statics.vinpearl.com/cong-to-vo-ly-son_1747494704.jpg",
        "category": "nature",
        "rating": 4.9,
        "description": "Vòm đá núi lửa tự nhiên, điểm săn bình minh đẹp nhất đảo",
        "coordinates": {
          "lat": 15.3853,
          "lng": 109.1064
        }
      },
      {
        "name": "Đỉnh Thới Lới",
        "city": "Lý Sơn",
        "image": "https://zoomtravel.vn/upload/images/thoi-loi-3-min.jpg",
        "category": "mountain",
        "rating": 4.8,
        "description": "Miệng núi lửa đã tắt cao nhất đảo nhìn toàn cảnh Lý Sơn",
        "coordinates": {
          "lat": 15.3839,
          "lng": 109.1267
        }
      },
      {
        "name": "Hang Câu",
        "city": "Lý Sơn",
        "image": "https://cdn3.ivivu.com/2023/04/hang-c%C3%A2u-l%C3%BD-s%C6%A1n-ivivu.jpg",
        "category": "beach",
        "rating": 4.7,
        "description": "Bãi tắm hoang sơ dưới chân vách đá nham thạch nước trong vắt",
        "coordinates": {
          "lat": 15.3892,
          "lng": 109.1219
        }
      },
      {
        "name": "Đảo Lý Sơn",
        "city": "Quảng Ngãi",
        "image": "https://mia.vn/media/uploads/blog-du-lich/canh-dong-toi-ly-son-1-1758181474.jpg",
        "category": "island",
        "rating": 4.6,
        "description": "Vương quốc tỏi với những cánh đồng tỏi xanh mướt bên biển",
        "coordinates": {
          "lat": 15.3833,
          "lng": 109.1167
        }
      }
    ],
    "reviews": [
      {
        "name": "Phương Thảo",
        "avatar": "PT",
        "date": "04/2026",
        "rating": 5,
        "text": "Bình minh ở Cổng Tò Vò đẹp xuất sắc, nước biển xanh màu ngọc bích. Hải sản tươi rói, gỏi tỏi Lý Sơn ăn rất lạ và ngon.",
        "helpful": 33
      },
      {
        "name": "Đình Phúc",
        "avatar": "ĐP",
        "date": "03/2026",
        "rating": 4,
        "text": "Leo đỉnh Thới Lới hơi nắng nhưng view 360 độ toàn đảo quá đỉnh. Hang Câu tắm cực mát. Nên thuê xe máy chạy quanh đảo.",
        "helpful": 18
      }
    ]
  },
  {
    "id": "ct-33",
    "title": "3 Ngày Ninh Thuận — Vịnh Vĩnh Hy Hoang Sơ",
    "coverImage": "https://mia.vn/media/uploads/blog-du-lich/kham-pha-vinh-vinh-hy-dep-me-hon-khien-bao-nguoi-say-dam-1658250774.jpg",
    "duration": "3 ngày 2 đêm",
    "days": 3,
    "category": "Biển",
    "categoryIcon": "🏖️",
    "region": "Nam Trung Bộ",
    "priceRange": "mid-range",
    "priceLabel": "3.500.000 ₫",
    "rating": 4.8,
    "reviewCount": 158,
    "viewCount": 5100,
    "tags": [
      "Vịnh biển đẹp",
      "Cánh đồng cừu",
      "Tháp Chăm cổ",
      "San hô rạn biển"
    ],
    "highlights": [
      "Ngắm Vịnh Vĩnh Hy một trong tứ đại danh thắng",
      "Check-in Hang Rái với rạn san hô cổ",
      "Chụp ảnh Cánh đồng cừu An Hòa",
      "Tham quan Tháp Po Klong Garai cổ kính"
    ],
    "badge": "🐑 Độc lạ",
    "badgeColor": "bg-amber-500",
    "author": "Vĩnh Khang",
    "authorAvatar": "VK",
    "completedDate": "03/2026",
    "description": "Hành trình 3 ngày khám phá vùng đất nắng gió Ninh Thuận. Vịnh Vĩnh Hy xanh biếc được xếp vào tứ đại danh thắng biển, Hang Rái với rạn san hô hóa thạch độc đáo và những đàn cừu thong dong trên đồng cỏ như trời Âu.",
    "stops": [
      {
        "name": "Vịnh Vĩnh Hy",
        "city": "Ninh Thuận",
        "image": "https://static.vinwonders.com/production/vinh-vinh-hy-1.jpg",
        "category": "nature",
        "rating": 4.9,
        "description": "Một trong tứ đại danh thắng vịnh biển đẹp nhất Việt Nam",
        "coordinates": {
          "lat": 11.7106,
          "lng": 109.2017
        }
      },
      {
        "name": "Hang Rái",
        "city": "Ninh Thuận",
        "image": "https://bizweb.dktcdn.net/100/514/927/files/hang-rai-ninh-thuan-3.webp?v=1774506497530",
        "category": "nature",
        "rating": 4.8,
        "description": "Ghềnh đá san hô cổ độc đáo nơi sóng tạo thác nước ngược",
        "coordinates": {
          "lat": 11.685,
          "lng": 109.1817
        }
      },
      {
        "name": "Cánh đồng cừu An Hòa",
        "city": "Ninh Thuận",
        "image": "https://statics.vinpearl.com/dong-cuu-an-hoa_1764521038.jpg",
        "category": "countryside",
        "rating": 4.6,
        "description": "Đồng cỏ với những đàn cừu thong dong như khung cảnh trời Âu",
        "coordinates": {
          "lat": 11.6483,
          "lng": 109.1333
        }
      },
      {
        "name": "Tháp Po Klong Garai",
        "city": "Phan Rang",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Po_Klong_Garai.jpg",
        "category": "heritage",
        "rating": 4.7,
        "description": "Cụm tháp Chăm cổ kính còn nguyên vẹn nhất Việt Nam",
        "coordinates": {
          "lat": 11.5814,
          "lng": 108.9667
        }
      }
    ],
    "reviews": [
      {
        "name": "Cẩm Tú",
        "avatar": "CT",
        "date": "03/2026",
        "rating": 5,
        "text": "Vịnh Vĩnh Hy nước xanh trong, đi tàu đáy kính ngắm san hô rất đẹp. Cánh đồng cừu chụp ảnh dễ thương như trời Âu vậy.",
        "helpful": 28
      },
      {
        "name": "Hoàng Sơn",
        "avatar": "HS",
        "date": "02/2026",
        "rating": 4,
        "text": "Hang Rái lúc thủy triều tạo thác nước ngược độc đáo lắm. Nho và táo Ninh Thuận tươi ngon, mua về làm quà rất hợp.",
        "helpful": 15
      }
    ]
  },
  {
    "id": "ct-34",
    "title": "2 Ngày Hà Tiên — Phố Biển Mộng Mơ Kiên Giang",
    "coverImage": "https://ik.imagekit.io/tvlk/blog/2022/12/khu-du-lich-mui-nai-9.jpg",
    "duration": "2 ngày 1 đêm",
    "days": 2,
    "category": "Biển",
    "categoryIcon": "🏖️",
    "region": "Tây Nam Bộ",
    "priceRange": "mid-range",
    "priceLabel": "2.200.000 ₫",
    "rating": 4.7,
    "reviewCount": 149,
    "viewCount": 4600,
    "tags": [
      "Phố biển",
      "Hang động ven biển",
      "Hòn Phụ Tử",
      "Đầm nước lợ"
    ],
    "highlights": [
      "Tắm biển ngắm hoàng hôn Mũi Nai",
      "Khám phá Thạch Động trời sinh",
      "Chiêm bái Chùa Hang & Hòn Phụ Tử",
      "Dạo thuyền trên Đầm Đông Hồ"
    ],
    "badge": "🌅 Thơ mộng",
    "badgeColor": "bg-rose-500",
    "author": "Thúy Quỳnh",
    "authorAvatar": "TQ",
    "completedDate": "04/2026",
    "description": "Hành trình 2 ngày dạo bước phố biển Hà Tiên thơ mộng nơi cực Tây Nam Tổ quốc. Vùng đất Hà Tiên thập cảnh nổi tiếng với những hang động kỳ thú, biển Mũi Nai hoàng hôn rực rỡ và biểu tượng Hòn Phụ Tử giữa biển khơi.",
    "stops": [
      {
        "name": "Bãi biển Mũi Nai",
        "city": "Hà Tiên",
        "image": "https://thamhiemmekong.com/wp-content/uploads/2020/06/bienmuinai-3.jpg",
        "category": "beach",
        "rating": 4.6,
        "description": "Bãi biển cát nâu với hoàng hôn rực rỡ nơi cực Tây",
        "coordinates": {
          "lat": 10.3506,
          "lng": 104.4533
        }
      },
      {
        "name": "Thạch Động",
        "city": "Hà Tiên",
        "image": "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/10/huyen-bi-thach-dong-ha-tien-noi-thach-sanh-giet-dai-bang-trong-co-tich-xua-e1508151058973.jpg",
        "category": "nature",
        "rating": 4.6,
        "description": "Khối núi đá vôi rỗng giữa đồng bằng gắn với truyện Thạch Sanh",
        "coordinates": {
          "lat": 10.4083,
          "lng": 104.4694
        }
      },
      {
        "name": "Hòn Phụ Tử & Chùa Hang",
        "city": "Kiên Lương",
        "image": "https://www.homepaylater.vn/static/bac1dddfb3ae7dbd1db4382618c35d1b/9d72c/2_chua_hang_la_mot_thang_canh_dep_cua_kien_giang_1604659612.jpg",
        "category": "heritage",
        "rating": 4.7,
        "description": "Biểu tượng cha con bằng đá giữa biển và ngôi chùa trong hang núi",
        "coordinates": {
          "lat": 10.2167,
          "lng": 104.65
        }
      },
      {
        "name": "Đầm Đông Hồ",
        "city": "Hà Tiên",
        "image": "https://dulichhatien.com.vn/datafiles/96/2024-08/14708076-z5064439628430_498b015712e438f1a0c2493aa7426b01.jpg",
        "category": "nature",
        "rating": 4.5,
        "description": "Đầm nước lợ thơ mộng được mệnh danh hồ trăng của Hà Tiên",
        "coordinates": {
          "lat": 10.3878,
          "lng": 104.4831
        }
      }
    ],
    "reviews": [
      {
        "name": "Ngọc Trâm",
        "avatar": "NT",
        "date": "04/2026",
        "rating": 5,
        "text": "Hà Tiên yên bình và lãng mạn, hoàng hôn Mũi Nai đẹp não nề. Hải sản rẻ, ghẹ và sò huyết tươi ngon. Rất đáng đi.",
        "helpful": 26
      },
      {
        "name": "Anh Kiệt",
        "avatar": "AK",
        "date": "03/2026",
        "rating": 4,
        "text": "Thạch Động và Hòn Phụ Tử khá độc đáo. Có thể kết hợp đi tiếp Phú Quốc hoặc qua cửa khẩu Campuchia tiện đường.",
        "helpful": 12
      }
    ]
  },
  {
    "id": "ct-35",
    "title": "2 Ngày Đồng Tháp — Sen Hồng Tháp Mười",
    "coverImage": "https://ik.imagekit.io/tvlk/blog/2022/03/khu-du-lich-sinh-thai-dong-sen-thap-muoi-1.jpg?tr=q-70,c-at_max,w-1000,h-600",
    "duration": "2 ngày 1 đêm",
    "days": 2,
    "category": "Di sản",
    "categoryIcon": "🪷",
    "region": "Tây Nam Bộ",
    "priceRange": "budget",
    "priceLabel": "1.400.000 ₫",
    "rating": 4.7,
    "reviewCount": 134,
    "viewCount": 3800,
    "tags": [
      "Đồng sen bát ngát",
      "Rừng tràm",
      "Sân chim",
      "Làng hoa"
    ],
    "highlights": [
      "Chèo xuồng giữa Đồng sen Tháp Mười",
      "Ngắm chim trời tại Vườn quốc gia Tràm Chim",
      "Dạo Làng hoa Sa Đéc rực rỡ",
      "Về nguồn tại Khu di tích Gò Tháp"
    ],
    "badge": "🪷 Thuần khiết",
    "badgeColor": "bg-pink-500",
    "author": "Mỹ Duyên",
    "authorAvatar": "MD",
    "completedDate": "03/2026",
    "description": "Hành trình 2 ngày về vùng đất Sen hồng Đồng Tháp Mười. Chèo xuồng len giữa đầm sen bát ngát thơm ngát, ngắm đàn sếu đầu đỏ quý hiếm tại Tràm Chim và lạc bước giữa làng hoa Sa Đéc trăm sắc ngàn hương.",
    "stops": [
      {
        "name": "Vườn quốc gia Tràm Chim",
        "city": "Đồng Tháp",
        "image": "https://hitour.vn/storage/images/upload/tour-du-lich-dong-thap-25-750x460-type-manager-upload.webp",
        "category": "nature",
        "rating": 4.8,
        "description": "Khu Ramsar với hệ sinh thái đất ngập nước và sếu đầu đỏ quý hiếm",
        "coordinates": {
          "lat": 10.7186,
          "lng": 105.5631
        }
      },
      {
        "name": "Làng hoa Sa Đéc",
        "city": "Đồng Tháp",
        "image": "https://mediadulich.dongthap.gov.vn/resources/portal/Images/DTP/dtblieu/lang_hoa/48bf9d85d2d3118d48c2_826106342.jpeg",
        "category": "countryside",
        "rating": 4.7,
        "description": "Làng hoa lớn nhất miền Tây rực rỡ trăm loài khoe sắc",
        "coordinates": {
          "lat": 10.2939,
          "lng": 105.7456
        }
      },
      {
        "name": "Khu di tích Gò Tháp",
        "city": "Đồng Tháp",
        "image": "https://thamhiemmekong.com/wp-content/uploads/2020/01/khu-di-tich-go-thap.jpg",
        "category": "heritage",
        "rating": 4.6,
        "description": "Di tích quốc gia đặc biệt với dấu tích văn hóa Óc Eo cổ",
        "coordinates": {
          "lat": 10.7325,
          "lng": 105.7397
        }
      },
      {
        "name": "Đồng sen Tháp Mười",
        "city": "Đồng Tháp",
        "image": "https://ik.imagekit.io/tvlk/blog/2022/03/khu-du-lich-sinh-thai-dong-sen-thap-muoi-1.jpg?tr=q-70,c-at_max,w-1000,h-600",
        "category": "nature",
        "rating": 4.7,
        "description": "Cánh đồng sen hồng bát ngát đặc trưng của vùng Đồng Tháp Mười",
        "coordinates": {
          "lat": 10.565,
          "lng": 105.842
        }
      }
    ],
    "reviews": [
      {
        "name": "Thanh Trúc",
        "avatar": "TT",
        "date": "03/2026",
        "rating": 5,
        "text": "Đồng sen mênh mông thơm ngát, mặc áo bà ba chèo xuồng chụp ảnh cực đẹp. Ăn các món từ sen rất thanh mát và lạ miệng.",
        "helpful": 24
      },
      {
        "name": "Hữu Nghĩa",
        "avatar": "HN",
        "date": "02/2026",
        "rating": 4,
        "text": "Tràm Chim sáng sớm ngắm chim trời rất thư giãn. Làng hoa Sa Đéc nhiều góc sống ảo. Nên đi mùa nước nổi sẽ đẹp hơn.",
        "helpful": 13
      }
    ]
  },
  {
    "id": "ct-36",
    "title": "3 Ngày Cà Mau — Đất Mũi Cực Nam Tổ Quốc",
    "coverImage": "https://ik.imagekit.io/tvlk/blog/2023/03/go-and-share-du-lich-mui-ca-mau-17.jpg",
    "duration": "3 ngày 2 đêm",
    "days": 3,
    "category": "Di sản",
    "categoryIcon": "🏛️",
    "region": "Tây Nam Bộ",
    "priceRange": "mid-range",
    "priceLabel": "2.900.000 ₫",
    "rating": 4.8,
    "reviewCount": 156,
    "viewCount": 4700,
    "tags": [
      "Cực Nam đất nước",
      "Rừng ngập mặn",
      "Đầm nước tự nhiên",
      "Đảo đá ven biển"
    ],
    "highlights": [
      "Check-in cột mốc tọa độ GPS 0001 Đất Mũi",
      "Xuyên rừng Vườn quốc gia U Minh Hạ",
      "Ngắm hoàng hôn trên Đầm Thị Tường",
      "Khám phá Hòn Đá Bạc ven biển"
    ],
    "badge": "📍 Cực Nam",
    "badgeColor": "bg-emerald-700",
    "author": "Trọng Phúc",
    "authorAvatar": "TP",
    "completedDate": "03/2026",
    "description": "Hành trình 3 ngày về với Đất Mũi Cà Mau — điểm cực Nam thiêng liêng của Tổ quốc. Đặt chân tới cột mốc tọa độ quốc gia, ngắm bạt ngàn rừng đước rừng tràm và thưởng thức hải sản trù phú nơi đất chín rồng đổ ra biển.",
    "stops": [
      {
        "name": "Mũi Cà Mau (Đất Mũi)",
        "city": "Cà Mau",
        "image": "https://vcdn1-dulich.vnecdn.net/2019/10/14/Dat-Mui-Ca-Mau-Vnexpress19-1571049720.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=D9WlTouv2nM6umD71or2NQ",
        "category": "heritage",
        "rating": 4.9,
        "description": "Điểm cực Nam Tổ quốc với cột mốc tọa độ và biểu tượng con tàu",
        "coordinates": {
          "lat": 8.6,
          "lng": 104.7167
        }
      },
      {
        "name": "Vườn quốc gia U Minh Hạ",
        "city": "Cà Mau",
        "image": "https://r2.nucuoimekong.com/wp-content/uploads/vuon-quoc-gia-u-minh-ha-3.jpg",
        "category": "nature",
        "rating": 4.6,
        "description": "Rừng tràm ngập nước nguyên sinh với hệ sinh thái phong phú",
        "coordinates": {
          "lat": 9.6,
          "lng": 104.95
        }
      },
      {
        "name": "Đầm Thị Tường",
        "city": "Cà Mau",
        "image": "https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/07_2020/noi-day-duoc-menh-danh-la-bien-ho-giua-dong-bang.jpg",
        "category": "nature",
        "rating": 4.7,
        "description": "Đầm nước tự nhiên lớn nhất miền Tây với hoàng hôn tuyệt đẹp",
        "coordinates": {
          "lat": 9.0833,
          "lng": 104.9833
        }
      },
      {
        "name": "Hòn Đá Bạc",
        "city": "Cà Mau",
        "image": "https://thamhiemmekong.com/wp-content/uploads/2020/05/hondabac-1.jpg",
        "category": "nature",
        "rating": 4.6,
        "description": "Cụm đảo đá nhỏ ven biển với di tích lịch sử và đền thờ",
        "coordinates": {
          "lat": 9.0892,
          "lng": 104.8147
        }
      }
    ],
    "reviews": [
      {
        "name": "Bích Phương",
        "avatar": "BP",
        "date": "03/2026",
        "rating": 5,
        "text": "Đặt chân tới cột mốc Đất Mũi cảm giác rất thiêng liêng và tự hào. Ngồi vỏ lãi xuyên rừng đước rất thú vị. Cua Cà Mau ngon số 1!",
        "helpful": 30
      },
      {
        "name": "Văn Toàn",
        "avatar": "VT",
        "date": "02/2026",
        "rating": 4,
        "text": "Hoàng hôn trên Đầm Thị Tường đẹp mê. Đường đi hơi xa nhưng trải nghiệm về cực Nam đáng giá. Hải sản tươi và rẻ.",
        "helpful": 15
      }
    ]
  },
  {
    "id": "ct-37",
    "title": "2 Ngày Sầm Sơn — Biển Gọi Hè Về Thanh Hóa",
    "coverImage": "https://static.vinwonders.com/production/bai-bien-sam-son-o-dau.jpg",
    "duration": "2 ngày 1 đêm",
    "days": 2,
    "category": "Biển",
    "categoryIcon": "🏖️",
    "region": "Bắc Trung Bộ",
    "priceRange": "budget",
    "priceLabel": "1.500.000 ₫",
    "rating": 4.5,
    "reviewCount": 268,
    "viewCount": 9600,
    "tags": [
      "Biển gần Hà Nội",
      "Hòn Trống Mái",
      "Đền cổ ven biển",
      "Hải sản bình dân"
    ],
    "highlights": [
      "Tắm biển sôi động tại bãi Sầm Sơn",
      "Check-in danh thắng Hòn Trống Mái",
      "Chiêm bái Đền Độc Cước linh thiêng",
      "Ngắm biển từ Đền Cô Tiên"
    ],
    "badge": "🌴 Vui hè",
    "badgeColor": "bg-sky-500",
    "author": "Đức Anh",
    "authorAvatar": "ĐA",
    "completedDate": "05/2026",
    "description": "Hành trình 2 ngày tận hưởng mùa hè sôi động tại bãi biển Sầm Sơn. Một trong những bãi tắm lâu đời và nhộn nhịp nhất miền Bắc với bờ cát thoai thoải, danh thắng Hòn Trống Mái độc đáo và những ngôi đền cổ linh thiêng bên biển.",
    "stops": [
      {
        "name": "Biển Sầm Sơn",
        "city": "Thanh Hóa",
        "image": "https://static.vinwonders.com/production/bai-bien-sam-son-o-dau.jpg",
        "category": "beach",
        "rating": 4.5,
        "description": "Bãi tắm lâu đời sôi động với bờ cát dài thoai thoải",
        "coordinates": {
          "lat": 19.7506,
          "lng": 105.9072
        }
      },
      {
        "name": "Hòn Trống Mái",
        "city": "Sầm Sơn",
        "image": "https://image.plo.vn/Uploaded/2026/meyxqdbexq/2023_03_20/hon-trong-mai-thanh-hoa-sam-son15-5938.jpg",
        "category": "nature",
        "rating": 4.6,
        "description": "Cụm đá tự nhiên hình đôi chim gắn với truyền thuyết tình yêu",
        "coordinates": {
          "lat": 19.7406,
          "lng": 105.9111
        }
      },
      {
        "name": "Đền Độc Cước",
        "city": "Sầm Sơn",
        "image": "https://static.vinwonders.com/production/den-doc-cuoc-topbanner.jpg",
        "category": "heritage",
        "rating": 4.6,
        "description": "Ngôi đền cổ trên núi Trường Lệ thờ vị thần một chân",
        "coordinates": {
          "lat": 19.7472,
          "lng": 105.9097
        }
      },
      {
        "name": "Đền Cô Tiên",
        "city": "Sầm Sơn",
        "image": "https://ticotravel.com.vn/wp-content/uploads/2021/05/den-co-tien-1-1.jpg",
        "category": "heritage",
        "rating": 4.5,
        "description": "Ngôi đền cổ nằm trên đỉnh núi nhìn ra toàn cảnh biển",
        "coordinates": {
          "lat": 19.7383,
          "lng": 105.9136
        }
      }
    ],
    "reviews": [
      {
        "name": "Hà My",
        "avatar": "HM",
        "date": "05/2026",
        "rating": 5,
        "text": "Biển Sầm Sơn sóng to tắm rất đã, bãi rộng. Hải sản chợ Sầm Sơn tươi và bình dân. Đi cùng gia đình đông vui cực hợp.",
        "helpful": 36
      },
      {
        "name": "Tuấn Vũ",
        "avatar": "TV",
        "date": "04/2026",
        "rating": 4,
        "text": "Hòn Trống Mái và đền Độc Cước trên núi Trường Lệ ngắm biển đẹp. Mùa cao điểm hơi đông, nên đặt phòng trước.",
        "helpful": 19
      }
    ]
  }
];

const CATEGORIES = [
  { id: '', label: 'Tất cả', icon: '🌏' },
  { id: 'Biển', label: 'Biển & Đảo', icon: '🏖️' },
  { id: 'Núi', label: 'Núi rừng', icon: '🏔️' },
  { id: 'Di sản', label: 'Di sản', icon: '🏛️' },
  { id: 'Thành phố', label: 'Thành phố', icon: '🏙️' },
];

const SORT_OPTIONS = [
  { id: 'rating', label: '⭐ Đánh giá cao nhất' },
  { id: 'reviews', label: '💬 Nhiều đánh giá' },
  { id: 'views', label: '👁️ Xem nhiều nhất' },
  { id: 'price-asc', label: '💰 Chi phí thấp nhất' },
];

const PRICE_FILTERS = [
  { id: '', label: 'Mọi mức giá' },
  { id: 'budget', label: '💚 Tiết kiệm' },
  { id: 'mid-range', label: '💙 Tầm trung' },
  { id: 'luxury', label: '💜 Cao cấp' },
];

// ── Tour Showcase Hero (banner ảnh full-bleed xoay vòng, giống TravelShowcase trang chủ) ──
function TourShowcase({ tours, onOpen }: { tours: Tour[]; onOpen: (t: Tour) => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const active = tours[activeIndex];

  // Tự động chuyển tour mỗi 5s khi đang bật auto
  useEffect(() => {
    if (!auto || tours.length <= 1) return;
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % tours.length), 5000);
    return () => clearInterval(id);
  }, [auto, tours.length]);

  const select = (i: number) => { setActiveIndex(i); setAuto(false); };
  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 220 : -220, behavior: 'smooth' });
  };

  if (!active) return null;

  return (
    <div className="relative h-[460px] sm:h-[520px] w-full overflow-hidden">
      {/* Ảnh nền của tour đang active */}
      <img
        key={active.coverImage}
        src={active.coverImage}
        alt={active.title}
        className="absolute inset-0 h-full w-full object-cover tour-hero-fade"
      />
      {/* Lớp phủ gradient cho dễ đọc chữ */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

      {/* Counter góc trên phải */}
      <div className="absolute top-5 right-5 z-20 rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur">
        {String(activeIndex + 1).padStart(2, '0')} / {String(tours.length).padStart(2, '0')}
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end justify-between gap-6 px-4 sm:px-6 lg:px-8 pb-10 lg:pb-12">
        {/* Thông tin tour bên trái */}
        <div className="max-w-2xl text-white">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white shadow ${active.badgeColor}`}>
              {active.badge}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <span>📍</span>{active.region}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <span>⏱️</span>{active.duration}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur">
              ⭐ {active.rating.toFixed(1)} <span className="text-white/60">({active.reviewCount})</span>
            </span>
          </div>

          <h2 className="mb-3 text-2xl font-black leading-tight drop-shadow sm:text-4xl lg:text-5xl">
            <span className="mr-1.5">{active.categoryIcon}</span>{active.title}
          </h2>

          <p className="mb-6 max-w-xl text-sm leading-relaxed text-white/85 line-clamp-2 sm:text-base">
            {active.description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpen(active)}
              className="rounded-full bg-white px-6 py-3 font-bold text-gray-900 shadow-lg transition-all hover:scale-105"
            >
              Xem chi tiết →
            </button>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-white/70">Giá từ</span>
              <span className="text-2xl font-black text-amber-300">{active.priceLabel}</span>
            </div>
            <button
              onClick={() => setAuto((v) => !v)}
              title={auto ? 'Tạm dừng tự động lướt' : 'Tự động lướt'}
              className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 text-white transition-all hover:bg-white hover:text-gray-900"
            >
              {auto ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
          </div>

          {/* Dots cho mobile (thumbnail bị ẩn) */}
          <div className="mt-6 flex gap-1.5 lg:hidden">
            {tours.map((_, i) => (
              <button
                key={i}
                onClick={() => select(i)}
                aria-label={`Tour ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail các tour khác bên phải (desktop) */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg transition-all hover:scale-110 hover:bg-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg transition-all hover:scale-110 hover:bg-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          <div ref={scrollRef} className="flex max-w-[46vw] gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {tours.map((t, i) => (
              <button
                key={t.id}
                onClick={() => select(i)}
                className={`group relative h-[180px] w-[150px] flex-shrink-0 overflow-hidden rounded-2xl shadow-xl transition-all ${
                  i === activeIndex ? 'scale-105 ring-4 ring-white' : 'opacity-80 hover:scale-105 hover:opacity-100'
                }`}
              >
                <img src={t.coverImage} alt={t.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">{t.region}</p>
                  <p className="line-clamp-2 text-xs font-bold leading-tight text-white">{t.title}</p>
                  <p className="mt-1 text-[11px] font-black text-amber-300">{t.priceLabel}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tour Card ─────────────────────────────────────────────────────────────────
function TourCard({ tour, onOpen }: { tour: Tour; onOpen: () => void }) {
  const priceConf = PRICE_CONFIG[tour.priceRange];
  const tierText = priceConf.color.split(' ')[0]; // class text-color theo bậc giá
  const saved = useTourSaved(tour.id);
  return (
    <div
      onClick={onOpen}
      className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100 hover:-translate-y-2 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={tour.coverImage}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />

        {/* Badge bậc giá: pill trắng, chữ màu theo bậc */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur text-xs font-bold shadow-sm ${tierText}`}>
          {priceConf.label}
        </div>

        {/* Chip rating */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/95 backdrop-blur text-xs font-bold text-amber-600 shadow-sm">
          ⭐ {tour.rating.toFixed(1)}
        </div>

        {/* Nút lưu tour */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleSavedTour(tour); }}
          title={saved ? 'Bỏ lưu tour' : 'Lưu tour'}
          className={`absolute top-3 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-sm backdrop-blur transition-all opacity-0 group-hover:opacity-100 ${
            saved ? 'bg-red-500 text-white opacity-100' : 'bg-white/95 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <svg className="w-[18px] h-[18px]" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Xem nhanh */}
        <button
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur text-white text-xs font-semibold transition-all"
        >
          👁️ Xem nhanh
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h2 className="font-bold text-gray-900 text-[15px] leading-snug line-clamp-2 mb-2 min-h-[42px]">
          <span className="mr-1">{tour.categoryIcon}</span>{tour.title}
        </h2>

        {/* Vị trí + thời lượng */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1 truncate"><span className="text-sky-500">📍</span>{tour.region}</span>
          <span className="flex items-center gap-1 flex-shrink-0"><span className="text-violet-500">⏱️</span>{tour.duration}</span>
        </div>

        {/* Giá + CTA */}
        <div className="border-t border-gray-100 mt-auto pt-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] text-gray-400 font-medium">Giá từ:</p>
            <p className="text-xl font-black text-orange-600 leading-tight">{tour.priceLabel}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
            className="px-4 py-2.5 bg-gradient-to-b from-blue-500 to-blue-700 text-white rounded-lg font-bold text-sm shadow-md hover:from-blue-600 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MyToursPage() {
  const [activeCategory, setActiveCategory] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [priceFilter, setPriceFilter] = useState('');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  const openTour = (tour: Tour) => {
    setSelectedTour(tour);
    document.body.style.overflow = 'hidden';
  };
  const closeTour = () => {
    setSelectedTour(null);
    document.body.style.overflow = '';
  };

  const filteredTours = useMemo(() => {
    const PRICE_ORDER = { budget: 1, 'mid-range': 2, luxury: 3 };
    let list = COMMUNITY_TOURS
      .filter((t) => !activeCategory || t.category === activeCategory)
      .filter((t) => !priceFilter || t.priceRange === priceFilter);
    list.sort((a, b) => {
      if (sortBy === 'rating')    return b.rating - a.rating;
      if (sortBy === 'reviews')   return b.reviewCount - a.reviewCount;
      if (sortBy === 'views')     return b.viewCount - a.viewCount;
      if (sortBy === 'price-asc') return PRICE_ORDER[a.priceRange] - PRICE_ORDER[b.priceRange];
      return 0;
    });
    return list;
  }, [activeCategory, sortBy, priceFilter]);

  // Tour nổi bật cho banner: 6 tour nhiều lượt xem nhất
  const featuredTours = useMemo(
    () => [...COMMUNITY_TOURS].sort((a, b) => b.viewCount - a.viewCount).slice(0, 6),
    []
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-violet-50/20">
      <Navbar />

      {/* ── Hero ── */}
      <div className="pt-20">
        {/* Header gọn */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 py-8 sm:py-10">
          <div className="mx-auto max-w-7xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-sky-100 rounded-full shadow-sm mb-4">
              <span className="text-lg">🏕️</span>
              <span className="text-sm font-semibold text-sky-600 uppercase tracking-wide">Tours từ cộng đồng du lịch</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              Khám phá Tours{' '}
              <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                được yêu thích nhất
              </span>
            </h1>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mt-3">
              Những hành trình thực tế từ du khách đã trải nghiệm — kèm bản đồ, trạm dừng và đánh giá chân thực. Chọn tour phù hợp và nhờ AI lên kế hoạch cho bạn.
            </p>
          </div>
        </div>

        {/* Banner ảnh xoay vòng các tour nổi bật */}
        <TourShowcase tours={featuredTours} onOpen={openTour} />
      </div>

      {/* ── Sticky Filter Bar ── */}
      <div className="sticky top-20 z-40 bg-white/92 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  activeCategory === cat.id
                    ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Price + Sort */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300 cursor-pointer"
            >
              {PRICE_FILTERS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300 cursor-pointer"
            >
              {SORT_OPTIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Tour Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-sm text-gray-400 font-medium mb-6">
          Hiển thị <span className="text-gray-700 font-bold">{filteredTours.length}</span> tours
          {activeCategory && ` · ${activeCategory}`}
          {priceFilter && ` · ${PRICE_CONFIG[priceFilter as keyof typeof PRICE_CONFIG]?.label}`}
        </p>

        {filteredTours.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-xl text-gray-400 font-medium">Không có tour nào phù hợp với bộ lọc</p>
            <button
              onClick={() => { setActiveCategory(''); setPriceFilter(''); }}
              className="mt-4 px-6 py-2.5 bg-sky-100 text-sky-700 font-semibold rounded-xl hover:bg-sky-200 transition-all"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} onOpen={() => openTour(tour)} />
            ))}
          </div>
        )}


      </div>

      <Footer />

      {/* ── Tour Detail Modal ── */}
      {selectedTour && <TourDetailModal tour={selectedTour} onClose={closeTour} />}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes tourHeroFade { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: scale(1); } }
        .tour-hero-fade { animation: tourHeroFade 0.7s ease; }
      `}</style>
    </div>
  );
}
