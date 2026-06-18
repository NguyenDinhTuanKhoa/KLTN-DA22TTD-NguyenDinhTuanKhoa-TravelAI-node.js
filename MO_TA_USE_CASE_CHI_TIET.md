# MÔ TẢ CHI TIẾT CÁC TÁC NHÂN VÀ USE CASE - HỆ THỐNG TRAVELAI

## 3.3.1. Các tác nhân của hệ thống

| Tác nhân | Mô tả |
|----------|-------|
| **Khách (Guest)** | Người dùng mới truy cập hệ thống, có thể đăng ký tài khoản, xem thông tin các điểm đến du lịch, tìm kiếm và lọc điểm đến theo danh mục, xem chi tiết điểm đến bao gồm thông tin thời tiết, ẩm thực địa phương, bản đồ, đánh giá từ người dùng khác, và tương tác với chatbot AI để nhận tư vấn du lịch cơ bản. |
| **User (Người dùng)** | Người dùng cuối đã đăng ký tài khoản tại website, ngoài các chức năng của khách, còn có một số chức năng khác như lưu điểm đến yêu thích, tạo và quản lý lịch trình du lịch cá nhân, thêm điểm đến vào lịch trình, tối ưu hóa lộ trình di chuyển, viết đánh giá và nhận xét về các điểm đến đã đi, chat với AI có lưu lịch sử để nhận gợi ý cá nhân hóa, quản lý thông tin tài khoản và sở thích du lịch cá nhân. |
| **Admin (Quản trị viên)** | Quản trị viên của website, có các quyền quản lý cao nhất như quản lý điểm đến (thêm, sửa, xóa thông tin điểm đến, cập nhật hình ảnh, tọa độ GPS, đặc sản địa phương), quản lý người dùng (xem danh sách, phân quyền, xóa tài khoản vi phạm), kiểm duyệt và xóa các đánh giá không phù hợp, xem thống kê tổng quan về số lượng người dùng, điểm đến, lịch trình, đánh giá, phân tích xu hướng du lịch và hành vi người dùng để đưa ra các quyết định phát triển sản phẩm. |

---

## 3.3.2. Đối với khách (Guest)

Người dùng ở trạng thái khách (Guest) được phép truy cập một số chức năng cơ bản như xem điểm đến, tìm kiếm và lọc điểm đến, đăng ký tài khoản, đăng nhập và sử dụng chatbot AI hỗ trợ. Những chức năng này nhằm thu hút người dùng mới và hỗ trợ họ tiếp cận thông tin du lịch một cách thuận tiện nhất.

### Xem danh sách điểm đến

Chức năng đầu tiên là **xem danh sách điểm đến**. Mục tiêu của chức năng này là cho phép người dùng không cần tài khoản vẫn có thể duyệt qua các điểm đến du lịch đang có trên hệ thống. Đầu vào là yêu cầu truy cập vào trang chủ hoặc trang khám phá điểm đến. Hệ thống sẽ truy xuất cơ sở dữ liệu MongoDB để lấy danh sách điểm đến, bao gồm hình ảnh, tên điểm đến, vị trí (thành phố, tỉnh), giá tham khảo, đánh giá trung bình và số lượt đánh giá, sau đó hiển thị cho người dùng dưới dạng danh sách hoặc lưới ảnh. API endpoint: `GET /api/destinations`.

### Tìm kiếm và lọc điểm đến

Bên cạnh đó, **tìm kiếm và lọc điểm đến** đóng vai trò hỗ trợ điều hướng người dùng đến đúng điểm đến mong muốn. Khi người dùng nhập từ khóa (tên điểm đến, tỉnh thành) hoặc chọn các bộ lọc như danh mục (biển, núi, thành phố, di tích lịch sử), mức giá (budget, mid-range, luxury), hệ thống sẽ thực hiện xây dựng một truy vấn tìm kiếm phù hợp. Quá trình xử lý bao gồm phân tích điều kiện lọc và tìm kiếm trong cơ sở dữ liệu, kết quả đầu ra là danh sách điểm đến tương ứng với tiêu chí đã nhập. API endpoint: `GET /api/destinations?search=...&category=...&priceRange=...`.

### Xem chi tiết điểm đến

Chức năng **xem chi tiết điểm đến** cho phép khách xem thông tin đầy đủ về một điểm đến cụ thể. Đầu vào là ID của điểm đến được chọn. Hệ thống truy xuất thông tin chi tiết bao gồm mô tả, hình ảnh, tọa độ GPS để hiển thị trên bản đồ (sử dụng Leaflet/OpenStreetMap), thông tin thời tiết hiện tại và dự báo 5 ngày (tích hợp OpenWeatherMap API), danh sách món ăn và đặc sản địa phương, các hoạt động nổi bật, thời gian tốt nhất để đi, và danh sách đánh giá từ người dùng khác. Kết quả được hiển thị trên trang chi tiết với đầy đủ thông tin để hỗ trợ quyết định du lịch. API endpoint: `GET /api/destinations/:id`, `GET /api/weather/current?lat=...&lng=...`, `GET /api/reviews/destination/:id`.

### Đăng ký tài khoản

Ngoài ra, chức năng **đăng ký tài khoản mới** giúp người dùng chuyển đổi từ trạng thái khách sang người dùng thực thụ của hệ thống. Người dùng sẽ cung cấp các thông tin như họ tên, địa chỉ email và mật khẩu. Sau khi tiếp nhận, hệ thống tiến hành xác thực các điều kiện định dạng (email hợp lệ, mật khẩu đủ mạnh), kiểm tra email đã tồn tại hay chưa trong cơ sở dữ liệu, sau đó mã hóa mật khẩu bằng bcrypt và ghi nhận vào collection `users` trong MongoDB. Hệ thống tạo JWT token và trả về cho client để tự động đăng nhập. API endpoint: `POST /api/auth/register`.

### Đăng nhập

Chức năng **đăng nhập** cho phép người dùng đã có tài khoản truy cập vào hệ thống. Đầu vào là email và mật khẩu. Hệ thống kiểm tra thông tin đăng nhập, so sánh mật khẩu đã mã hóa, nếu hợp lệ sẽ tạo JWT token và trả về cho client. Token này được lưu trong localStorage và sử dụng cho các request tiếp theo. API endpoint: `POST /api/auth/login`.

### Tương tác với chatbot AI

Một chức năng quan trọng khác dành cho Guest là **tương tác với chatbot thông minh**. Đây là một hệ thống trợ lý ảo được tích hợp sử dụng mô hình AI Cerebras (Llama 3.1-8B) để trả lời các câu hỏi về du lịch Việt Nam như gợi ý điểm đến, tư vấn lịch trình, thông tin về món ăn địa phương, thời tiết, hoặc hỗ trợ tìm kiếm điểm đến phù hợp. Đầu vào là đoạn văn bản người dùng gửi, hệ thống AI sử dụng mô hình xử lý ngôn ngữ tự nhiên để phân tích ý định, tự động phát hiện vùng miền (Miền Bắc, Miền Trung, Miền Nam) từ câu hỏi, lọc danh sách điểm đến và đặc sản địa phương phù hợp, sau đó đưa ra câu trả lời chính xác dựa trên dữ liệu thực tế trong database. Kết quả trả về dưới dạng tin nhắn ngay trong cửa sổ trò chuyện, có thể bao gồm gợi ý điểm đến cụ thể, ước tính ngân sách, và lịch trình chi tiết theo ngày. API endpoint: `POST /api/ai/chat`.

---

## 3.3.3. Đối với người dùng (User)

Khi người dùng đã hoàn tất đăng ký và đăng nhập thành công, họ sẽ chuyển sang vai trò User và được cấp quyền sử dụng các chức năng cao cấp hơn như lưu điểm đến yêu thích, tạo và quản lý lịch trình du lịch, viết đánh giá, chat với AI có lưu lịch sử, và quản lý thông tin tài khoản cá nhân.

### Quản lý thông tin cá nhân

Chức năng **quản lý thông tin cá nhân** giúp người dùng cập nhật thông tin hồ sơ như tên, avatar, và đặc biệt là **sở thích du lịch cá nhân** (preferences). Sở thích bao gồm phong cách du lịch (phiêu lưu, thư giãn, văn hóa, ẩm thực), ngân sách (low, medium, high), và các sở thích cụ thể (biển, núi, thành phố, di tích). Thông tin này được lưu trong collection `users` và sử dụng để cá nhân hóa gợi ý từ AI. Người dùng có thể cập nhật thông tin bất kỳ lúc nào. API endpoint: `GET /api/users/profile`, `PUT /api/users/profile`.

### Lưu điểm đến yêu thích

Chức năng **lưu điểm đến yêu thích** cho phép người dùng đánh dấu các điểm đến quan tâm để dễ dàng truy cập sau này. Khi người dùng click nút "Lưu" trên trang chi tiết điểm đến, hệ thống sẽ thêm ID của điểm đến vào mảng `savedDestinations` trong tài khoản người dùng. Người dùng có thể xem danh sách đã lưu tại trang "Đã lưu" và bỏ lưu bất kỳ lúc nào. Hệ thống cũng sử dụng thông tin này để cải thiện thuật toán gợi ý. API endpoint: `POST /api/saved/:destinationId`, `GET /api/saved`.

### Tạo lịch trình du lịch

Chức năng **tạo lịch trình du lịch** là một trong những tính năng trung tâm của hệ thống. Người dùng có thể tạo kế hoạch du lịch mới bằng cách nhập tiêu đề, mô tả, ngày bắt đầu và ngày kết thúc. Sau khi tạo lịch trình, người dùng có thể thêm các điểm đến vào từng ngày cụ thể, kèm theo ghi chú và danh sách hoạt động dự định. Hệ thống lưu lịch trình vào collection `itineraries` với trạng thái "planning" (đang lên kế hoạch). API endpoint: `POST /api/itineraries`, `POST /api/itineraries/:id/destinations`.

### Quản lý lịch trình

Chức năng **quản lý lịch trình** cho phép người dùng xem danh sách tất cả lịch trình đã tạo, xem chi tiết từng lịch trình, chỉnh sửa thông tin (thêm/xóa điểm đến, thay đổi thứ tự, cập nhật ghi chú), và xóa lịch trình không cần thiết. Người dùng cũng có thể thay đổi trạng thái lịch trình từ "planning" sang "ongoing" (đang diễn ra) hoặc "completed" (đã hoàn thành). API endpoint: `GET /api/itineraries`, `GET /api/itineraries/:id`, `PUT /api/itineraries/:id`, `DELETE /api/itineraries/:id`.

### Tối ưu hóa lộ trình

Một tính năng đặc biệt là **tối ưu hóa lộ trình tự động**. Sau khi người dùng thêm nhiều điểm đến vào lịch trình, hệ thống có thể tự động sắp xếp lại thứ tự các điểm đến theo khoảng cách gần nhất sử dụng thuật toán Nearest Neighbor và công thức Haversine để tính khoảng cách giữa các tọa độ GPS. Điều này giúp tiết kiệm thời gian di chuyển và chi phí. Hệ thống cũng tích hợp với Google Maps để hiển thị đường đi và ước tính thời gian di chuyển. Service: `routingService.js`, `optimizeService.js`.

### Viết đánh giá

Sau khi đi du lịch, người dùng có thể sử dụng chức năng **viết đánh giá** để chia sẻ trải nghiệm. Người dùng chọn điểm đến đã đi, nhập tiêu đề, nội dung đánh giá, chọn số sao (1-5), và ngày đi thực tế. Đánh giá được lưu vào collection `reviews` và hiển thị trên trang chi tiết điểm đến. Hệ thống tự động cập nhật điểm đánh giá trung bình và số lượt đánh giá của điểm đến. API endpoint: `POST /api/reviews`.

### Chat với AI có lưu lịch sử

Khác với Guest chỉ chat cơ bản, User có thể sử dụng chức năng **chat với AI có lưu lịch sử**. Mỗi cuộc trò chuyện được lưu vào collection `chathistories` với tiêu đề tự động tạo từ nội dung chat đầu tiên. Người dùng có thể xem lại các cuộc trò chuyện trước đó, tiếp tục chat trong cùng một thread, hoặc xóa lịch sử chat. AI sẽ sử dụng thông tin sở thích cá nhân của user để đưa ra gợi ý chính xác hơn. Khi AI phát hiện người dùng hỏi về lịch trình, hệ thống có thể tự động tạo lịch trình mới dựa trên gợi ý của AI. API endpoint: `POST /api/ai/chat-with-history`, `GET /api/ai/history`, `DELETE /api/ai/history`.

### Nhận gợi ý cá nhân hóa

Chức năng **nhận gợi ý cá nhân hóa** sử dụng thuật toán recommendation dựa trên sở thích người dùng, lịch sử tìm kiếm, điểm đến đã lưu, và hành vi tương tác (lưu trong collection `userbehaviors`). Hệ thống phân tích dữ liệu và đưa ra danh sách điểm đến phù hợp nhất với từng người dùng. API endpoint: `GET /api/recommendations/personalized`.

---

## 3.3.4. Đối với quản trị viên (Admin)

Trong hệ thống, quản trị viên (Admin) đóng vai trò điều phối và giám sát toàn bộ hoạt động nền tảng. Các chức năng mà Admin được phân quyền bao gồm quản lý điểm đến, quản lý người dùng, kiểm duyệt đánh giá, và xem thống kê hệ thống. Mỗi chức năng này đều được thiết kế nhằm đảm bảo tính toàn vẹn, hiệu quả và bảo mật cho toàn bộ hệ thống.

### Đăng nhập hệ thống quản trị

Trước tiên, chức năng **đăng nhập hệ thống quản trị** là bước khởi đầu bắt buộc. Ở đây, đầu vào bao gồm thông tin đăng nhập của quản trị viên như email và mật khẩu. Sau khi được hệ thống xác thực và kiểm tra role là "admin", phiên làm việc sẽ được thiết lập để cho phép truy cập đến các chức năng quản trị. Quá trình xác thực này nhằm đảm bảo rằng chỉ những cá nhân có quyền mới được phép quản lý hệ thống. Middleware `auth.js` kiểm tra JWT token và role trước khi cho phép truy cập các API admin.

### Quản lý điểm đến

Tiếp theo là chức năng **quản lý điểm đến**, trong đó Admin có thể tạo mới, cập nhật thông tin, hoặc xóa điểm đến. Đầu vào bao gồm các thuộc tính của điểm đến như tên, mô tả, vị trí (thành phố, tỉnh, quốc gia), tọa độ GPS (latitude, longitude), hình ảnh (URL hoặc upload), danh mục (beach, mountain, city, heritage), mức giá (budget, mid-range, luxury), các tiện nghi (amenities), hoạt động nổi bật (activities), thời gian tốt nhất để đi (bestTimeToVisit), và danh sách món ăn địa phương (cuisine). Hệ thống tiếp nhận dữ liệu, thực hiện kiểm tra định dạng, độ dài và tính hợp lệ trước khi ghi vào collection `destinations` trong MongoDB. Kết quả đầu ra là việc điểm đến được thêm mới hoặc cập nhật thành công, đồng thời hiển thị trong danh sách điểm đến cho người dùng. API endpoint: `POST /api/destinations`, `PUT /api/destinations/:id`, `DELETE /api/destinations/:id`.

### Quản lý người dùng

Chức năng **quản lý người dùng** là công cụ để kiểm soát tài khoản người dùng, đặc biệt là khi xảy ra hành vi vi phạm chính sách hoặc spam. Admin có thể xem danh sách tất cả người dùng, tìm kiếm người dùng theo tên hoặc email, xem thông tin chi tiết tài khoản, thay đổi role (từ user sang admin hoặc ngược lại), và xóa tài khoản khi cần thiết. Dữ liệu đầu vào là thông tin định danh người dùng (ID, email), còn đầu ra là việc cập nhật quyền truy cập hoặc xóa tài khoản khỏi hệ thống. API endpoint: `GET /api/admin/users`, `GET /api/users/search/:name`, `PUT /api/admin/users/:id/role`, `DELETE /api/admin/users/:id`.

### Quản lý đánh giá

Chức năng **quản lý đánh giá** đóng vai trò đặc biệt quan trọng trong việc duy trì chất lượng nội dung người dùng đăng tải. Admin có thể xem danh sách tất cả đánh giá trong hệ thống, lọc theo điểm đến hoặc người dùng, và xóa các đánh giá không phù hợp (spam, ngôn từ không phù hợp, nội dung sai lệch). Khi một đánh giá bị xóa, hệ thống tự động cập nhật lại điểm đánh giá trung bình và số lượt đánh giá của điểm đến tương ứng. Điều này giúp loại bỏ các nội dung vi phạm và duy trì độ tin cậy của hệ thống. API endpoint: `GET /api/admin/reviews`, `DELETE /api/admin/reviews/:id`.

### Xem thống kê hệ thống

Cuối cùng, chức năng **xem thống kê hệ thống** (dashboard) đóng vai trò cung cấp cái nhìn toàn cảnh về tình trạng hoạt động của hệ thống. Thông qua các chỉ số như tổng số người dùng, tổng số điểm đến, tổng số lịch trình đã tạo, tổng số đánh giá, số lượng người dùng mới trong tháng, điểm đến được xem nhiều nhất, điểm đến có đánh giá cao nhất, Admin có thể đưa ra các quyết định điều hành chính xác và kịp thời. Quá trình này không yêu cầu đầu vào trực tiếp mà được thực hiện thông qua việc truy vấn và tổng hợp dữ liệu từ các collection trong MongoDB. Kết quả được hiển thị dưới dạng biểu đồ, bảng số liệu trên trang dashboard. API endpoint: `GET /api/admin/stats`.

---

## Tóm tắt phân quyền

| Chức năng | Khách | User | Admin |
|-----------|:-----:|:----:|:-----:|
| Xem điểm đến | ✅ | ✅ | ✅ |
| Tìm kiếm, lọc | ✅ | ✅ | ✅ |
| Xem chi tiết | ✅ | ✅ | ✅ |
| Chat AI cơ bản | ✅ | ✅ | ✅ |
| Đăng ký/Đăng nhập | ✅ | ✅ | ✅ |
| Lưu điểm đến | ❌ | ✅ | ✅ |
| Tạo lịch trình | ❌ | ✅ | ✅ |
| Quản lý lịch trình | ❌ | ✅ | ✅ |
| Viết đánh giá | ❌ | ✅ | ✅ |
| Chat AI có lịch sử | ❌ | ✅ | ✅ |
| Quản lý profile | ❌ | ✅ | ✅ |
| CRUD điểm đến | ❌ | ❌ | ✅ |
| Quản lý người dùng | ❌ | ❌ | ✅ |
| Quản lý đánh giá | ❌ | ❌ | ✅ |
| Xem thống kê | ❌ | ❌ | ✅ |

---

*Tài liệu được tạo cho hệ thống TravelAI - Hệ thống gợi ý du lịch thông minh*
