'use client';
import { useState, useMemo } from 'react';
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-violet-50/20">
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden pt-20 pb-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 -left-20 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />
          <div className="absolute -top-10 right-10 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-80 h-40 bg-amber-100/40 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="text-center mb-10">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 border border-sky-100 rounded-full shadow-sm mb-5">
              <span className="text-lg">🏕️</span>
              <span className="text-sm font-semibold text-sky-600 uppercase tracking-wide">Tours từ cộng đồng du lịch</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-4">
              Khám phá Tours<br />
              <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                được yêu thích nhất
              </span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Những hành trình thực tế từ du khách đã trải nghiệm — kèm bản đồ, trạm dừng và đánh giá chân thực. Chọn tour phù hợp và nhờ AI lên kế hoạch cho bạn.
            </p>
          </div>

        </div>
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
      `}</style>
    </div>
  );
}
