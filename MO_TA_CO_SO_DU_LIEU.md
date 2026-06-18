# 3.5.2 Cơ sở dữ liệu

Hệ thống TravelAI sử dụng MongoDB với 7 Collection chính:

## 3.5.2.1 User

### Các trường chính:

- **_id**: Định danh duy nhất (ObjectId), khóa chính của người dùng.
- **name**: Họ tên đầy đủ, dùng hiển thị và nhận diện người dùng trong hệ thống.
- **email**: Địa chỉ email duy nhất, dùng để đăng nhập và xác thực tài khoản.
- **password**: Mật khẩu đã mã hóa bằng bcrypt, không bao giờ trả về phía client.
- **avatar**: Đường dẫn ảnh đại diện, mặc định là chuỗi rỗng nếu chưa cập nhật.
- **role**: Phân quyền người dùng, giá trị là 'user' (người dùng thường) hoặc 'admin' (quản trị viên).
- **preferences**: Object chứa thông tin sở thích du lịch:
  - **travelStyle**: Mảng các phong cách du lịch (phiêu lưu, nghỉ dưỡng, văn hóa...).
  - **budget**: Mức ngân sách ưa thích ('low', 'medium', 'high').
  - **interests**: Mảng các sở thích cá nhân (ẩm thực, lịch sử, thiên nhiên...).
- **savedDestinations**: Mảng tham chiếu ObjectId đến Destination, lưu các điểm đến yêu thích.
- **searchHistory**: Mảng lịch sử tìm kiếm, mỗi phần tử gồm query (chuỗi tìm kiếm) và date (thời gian).
- **createdAt, updatedAt**: Thời gian tạo và cập nhật tài khoản, tự động sinh bởi timestamps.

### Liên kết:

User là trung tâm, liên kết với hầu hết các collection khác như Itinerary, Review, ChatHistory, UserBehavior, Destination (qua savedDestinations).

### Chức năng & vai trò:

- Là trung tâm quản lý thông tin người dùng, bao gồm người dùng thường và quản trị viên.
- Đảm nhận xác thực (đăng ký, đăng nhập, quên mật khẩu), phân quyền (user, admin) và lưu trữ thông tin cá nhân.
- Lưu trữ sở thích du lịch để phục vụ cá nhân hóa gợi ý và tạo lịch trình.
- Quản lý danh sách điểm đến yêu thích và lịch sử tìm kiếm.
- Hỗ trợ cá nhân hóa giao diện, hiển thị thông tin cá nhân, avatar, sở thích.

### Chức năng chính:

- Đăng ký, đăng nhập, xác thực, đổi mật khẩu với mã hóa bcrypt.
- Quản lý hồ sơ cá nhân, cập nhật thông tin, avatar, sở thích du lịch.
- Phân quyền truy cập các chức năng hệ thống (admin có quyền quản lý toàn bộ).
- Lưu và quản lý danh sách điểm đến yêu thích.
- Theo dõi lịch sử tìm kiếm, lịch trình đã tạo, đánh giá đã viết.

---

## 3.5.2.2 Destination

### Các trường:

- **_id**: Định danh duy nhất của điểm đến.
- **name**: Tên điểm đến, bắt buộc.
- **description**: Mô tả chi tiết về điểm đến, không bắt buộc.
- **location**: Object chứa thông tin vị trí:
  - **city**: Thành phố/tỉnh.
  - **country**: Quốc gia.
  - **coordinates**: Object chứa lat (vĩ độ) và lng (kinh độ) để hiển thị trên bản đồ.
- **images**: Mảng các đường dẫn URL hình ảnh của điểm đến.
- **category**: Phân loại điểm đến ('beach', 'mountain', 'city', 'countryside', 'historical', 'hotel', 'restaurant', 'attraction').
- **priceRange**: Mức giá ('budget', 'mid-range', 'luxury').
- **rating**: Điểm đánh giá trung bình, mặc định 0.
- **reviewCount**: Số lượng đánh giá, mặc định 0.
- **amenities**: Mảng các tiện nghi có sẵn (wifi, bãi đỗ xe, hồ bơi...).
- **bestTimeToVisit**: Mảng các tháng/mùa tốt nhất để ghé thăm.
- **activities**: Mảng các hoạt động có thể thực hiện tại điểm đến.
- **cuisine**: Object chứa thông tin ẩm thực:
  - **name**: Tên món ăn đặc trưng.
  - **description**: Mô tả món ăn.
- **createdAt, updatedAt**: Thời gian tạo/cập nhật.

### Liên kết:

Gắn với User (qua savedDestinations), Itinerary (qua destinations), Review, UserBehavior (qua viewedDestinations, savedDestinations).

### Chức năng & vai trò:

- Quản lý toàn bộ thông tin điểm đến du lịch: tên, mô tả, vị trí, hình ảnh, phân loại.
- Lưu trữ thông tin chi tiết về tiện nghi, hoạt động, thời gian tốt nhất để ghé thăm.
- Hỗ trợ tính năng tìm kiếm, lọc theo danh mục, mức giá, vị trí.
- Phục vụ hiển thị danh sách điểm đến, chi tiết từng điểm, đánh giá, xếp hạng.
- Tích hợp với bản đồ thông qua tọa độ địa lý.
- Cung cấp dữ liệu cho AI chatbot để gợi ý và tạo lịch trình.

### Chức năng chính:

- Tạo, chỉnh sửa, xóa điểm đến (quản trị viên).
- Hiển thị danh sách, chi tiết, hình ảnh điểm đến cho người dùng.
- Tìm kiếm và lọc theo danh mục, mức giá, vị trí, đánh giá.
- Hiển thị trên bản đồ tương tác với tọa độ chính xác.
- Tính toán và cập nhật điểm đánh giá trung bình, số lượng đánh giá.
- Gợi ý điểm đến dựa trên sở thích người dùng và hành vi.

---

## 3.5.2.3 Itinerary

### Các trường:

- **_id**: Định danh duy nhất của lịch trình.
- **user**: Tham chiếu ObjectId đến User tạo lịch trình, bắt buộc.
- **title**: Tiêu đề lịch trình, bắt buộc.
- **description**: Mô tả chi tiết về lịch trình.
- **startDate**: Ngày bắt đầu chuyến đi, bắt buộc.
- **endDate**: Ngày kết thúc chuyến đi, bắt buộc.
- **destinations**: Mảng các điểm đến trong lịch trình, mỗi phần tử gồm:
  - **destination**: Tham chiếu ObjectId đến Destination.
  - **order**: Thứ tự ghé thăm.
  - **notes**: Ghi chú cho điểm đến này.
  - **activities**: Mảng các hoạt động dự định tại điểm đến.
- **hotels**: Mảng thông tin khách sạn, mỗi phần tử gồm:
  - **name**: Tên khách sạn.
  - **address**: Địa chỉ.
  - **checkIn**: Ngày nhận phòng.
  - **checkOut**: Ngày trả phòng.
  - **price**: Giá phòng.
- **restaurants**: Mảng thông tin nhà hàng, mỗi phần tử gồm:
  - **name**: Tên nhà hàng.
  - **address**: Địa chỉ.
  - **cuisine**: Loại ẩm thực.
  - **priceRange**: Mức giá.
- **budget**: Object chứa thông tin ngân sách:
  - **estimated**: Ngân sách dự kiến.
  - **actual**: Ngân sách thực tế (cập nhật sau chuyến đi).
- **isPublic**: Lịch trình có công khai hay không, mặc định false.
- **status**: Trạng thái lịch trình ('planning', 'ongoing', 'completed'), mặc định 'planning'.
- **createdAt, updatedAt**: Thời gian tạo/cập nhật.

### Liên kết:

Gắn với User (người tạo), Destination (các điểm đến trong lịch trình).

### Chức năng & vai trò:

- Quản lý lịch trình du lịch của người dùng từ lập kế hoạch đến hoàn thành.
- Lưu trữ thông tin chi tiết về các điểm đến, khách sạn, nhà hàng, hoạt động.
- Theo dõi ngân sách dự kiến và thực tế.
- Hỗ trợ chia sẻ lịch trình công khai với cộng đồng.
- Quản lý trạng thái lịch trình qua các giai đoạn.

### Chức năng chính:

- Tạo lịch trình mới (thủ công hoặc qua AI chatbot).
- Chỉnh sửa, cập nhật, xóa lịch trình.
- Thêm/xóa điểm đến, sắp xếp thứ tự ghé thăm.
- Quản lý thông tin khách sạn, nhà hàng trong lịch trình.
- Theo dõi và cập nhật ngân sách.
- Chia sẻ lịch trình công khai hoặc giữ riêng tư.
- Thay đổi trạng thái lịch trình (đang lên kế hoạch, đang thực hiện, đã hoàn thành).

---

## 3.5.2.4 Review

### Các trường:

- **_id**: Định danh duy nhất của đánh giá.
- **user**: Tham chiếu ObjectId đến User viết đánh giá, bắt buộc.
- **destination**: Tham chiếu ObjectId đến Destination được đánh giá, bắt buộc.
- **rating**: Điểm đánh giá từ 1 đến 5 sao, bắt buộc.
- **title**: Tiêu đề đánh giá.
- **content**: Nội dung chi tiết đánh giá, bắt buộc.
- **images**: Mảng các đường dẫn URL hình ảnh đính kèm.
- **helpful**: Số lượt đánh dấu "hữu ích", mặc định 0.
- **visitDate**: Ngày ghé thăm điểm đến.
- **createdAt, updatedAt**: Thời gian tạo/cập nhật đánh giá.

### Liên kết:

Gắn với User (người viết) và Destination (điểm đến được đánh giá).

### Chức năng & vai trò:

- Lưu trữ đánh giá, nhận xét của người dùng về các điểm đến.
- Cung cấp thông tin phản hồi thực tế từ cộng đồng.
- Hỗ trợ tính toán điểm đánh giá trung bình cho điểm đến.
- Tăng tính tương tác và chia sẻ kinh nghiệm giữa người dùng.

### Chức năng chính:

- Tạo đánh giá mới cho điểm đến đã ghé thăm.
- Chỉnh sửa, xóa đánh giá của chính mình.
- Hiển thị danh sách đánh giá theo điểm đến, sắp xếp theo thời gian hoặc độ hữu ích.
- Đánh dấu đánh giá "hữu ích" để nâng cao chất lượng thông tin.
- Upload hình ảnh đính kèm đánh giá.
- Quản lý, kiểm duyệt, xóa đánh giá vi phạm (quản trị viên).
- Tự động cập nhật rating và reviewCount của Destination.

---

## 3.5.2.5 ChatHistory

### Các trường:

- **_id**: Định danh duy nhất của cuộc trò chuyện.
- **user**: Tham chiếu ObjectId đến User sở hữu cuộc trò chuyện, bắt buộc.
- **title**: Tiêu đề cuộc trò chuyện, mặc định 'Cuộc trò chuyện mới', tự động sinh từ tin nhắn đầu tiên.
- **messages**: Mảng các tin nhắn, mỗi phần tử gồm:
  - **role**: Vai trò ('user' hoặc 'assistant').
  - **content**: Nội dung tin nhắn, bắt buộc.
  - **timestamp**: Thời gian gửi tin nhắn, mặc định thời điểm hiện tại.
- **lastMessage**: Thời gian tin nhắn cuối cùng, mặc định thời điểm hiện tại, tự động cập nhật.
- **createdAt, updatedAt**: Thời gian tạo/cập nhật cuộc trò chuyện.

### Liên kết:

Gắn với User (người sở hữu cuộc trò chuyện).

### Chức năng & vai trò:

- Lưu trữ toàn bộ lịch sử trò chuyện giữa người dùng và AI chatbot.
- Duy trì ngữ cảnh hội thoại để AI có thể trả lời liên tục và chính xác.
- Hỗ trợ người dùng xem lại các cuộc trò chuyện trước đó.
- Tự động sinh tiêu đề từ nội dung tin nhắn đầu tiên để dễ nhận diện.

### Chức năng chính:

- Tạo cuộc trò chuyện mới khi người dùng bắt đầu chat với AI.
- Lưu từng tin nhắn của user và assistant theo thứ tự thời gian.
- Hiển thị danh sách các cuộc trò chuyện, sắp xếp theo thời gian tin nhắn cuối.
- Xem chi tiết toàn bộ lịch sử tin nhắn trong một cuộc trò chuyện.
- Xóa cuộc trò chuyện không cần thiết.
- Tự động cập nhật tiêu đề và thời gian tin nhắn cuối.
- Cung cấp ngữ cảnh cho AI để trả lời liên tục trong cùng một phiên.

---

## 3.5.2.6 UserBehavior

### Các trường:

- **_id**: Định danh duy nhất của bản ghi hành vi.
- **user**: Tham chiếu ObjectId đến User, bắt buộc.
- **searchHistory**: Mảng lịch sử tìm kiếm, mỗi phần tử gồm:
  - **query**: Chuỗi tìm kiếm.
  - **filters**: Object chứa các bộ lọc (category, priceRange, location).
  - **timestamp**: Thời gian tìm kiếm.
- **viewedDestinations**: Mảng điểm đến đã xem, mỗi phần tử gồm:
  - **destination**: Tham chiếu ObjectId đến Destination.
  - **viewCount**: Số lần xem, mặc định 1.
  - **totalTimeSpent**: Tổng thời gian xem (giây), mặc định 0.
  - **lastViewed**: Thời gian xem gần nhất.
- **savedDestinations**: Mảng điểm đến đã lưu, mỗi phần tử gồm:
  - **destination**: Tham chiếu ObjectId đến Destination.
  - **savedAt**: Thời gian lưu.
- **clickHistory**: Mảng lịch sử click, mỗi phần tử gồm:
  - **itemType**: Loại item ('destination', 'hotel', 'restaurant', 'activity').
  - **itemId**: ObjectId của item.
  - **timestamp**: Thời gian click.
- **analyzedPreferences**: Object chứa phân tích sở thích tự động:
  - **topCategories**: Mảng các danh mục ưa thích (category, score).
  - **preferredPriceRange**: Mức giá ưa thích.
  - **preferredLocations**: Mảng các địa điểm ưa thích.
  - **travelStyle**: Mảng phong cách du lịch.
  - **lastUpdated**: Thời gian cập nhật phân tích cuối cùng.
- **createdAt, updatedAt**: Thời gian tạo/cập nhật.

### Liên kết:

Gắn với User và Destination, phục vụ phân tích hành vi và cá nhân hóa.

### Chức năng & vai trò:

- Theo dõi và lưu trữ toàn bộ hành vi người dùng trên hệ thống.
- Ghi nhận lịch sử tìm kiếm, điểm đến đã xem, đã lưu, lịch sử click.
- Phân tích tự động sở thích người dùng dựa trên hành vi.
- Cung cấp dữ liệu cho hệ thống gợi ý thông minh và cá nhân hóa.
- Hỗ trợ cải thiện trải nghiệm người dùng qua machine learning.

### Chức năng chính:

- Tự động ghi nhận mỗi lần tìm kiếm, xem điểm đến, lưu điểm đến, click vào item.
- Tính toán số lần xem, thời gian xem cho từng điểm đến.
- Phân tích và cập nhật sở thích tự động (danh mục ưa thích, mức giá, địa điểm).
- Cung cấp dữ liệu cho recommendation engine.
- Hỗ trợ cá nhân hóa kết quả tìm kiếm và gợi ý.
- Thống kê hành vi người dùng cho quản trị viên.

---

## 3.5.2.7 ProvinceSpecialty

### Các trường:

- **_id**: Định danh duy nhất của đặc sản tỉnh.
- **stt**: Số thứ tự, bắt buộc.
- **province**: Tên tỉnh/thành phố, bắt buộc và duy nhất.
- **region**: Vùng miền ('Miền Bắc', 'Miền Trung', 'Miền Nam', 'Tây Nguyên'), bắt buộc.
- **localDishes**: Mảng các món ăn địa phương, mỗi phần tử gồm:
  - **name**: Tên món ăn.
  - **description**: Mô tả món ăn.
- **souvenirs**: Mảng các đặc sản/quà lưu niệm, mỗi phần tử gồm:
  - **name**: Tên đặc sản.
  - **description**: Mô tả đặc sản.
- **localDishesText**: Chuỗi text chứa tất cả tên món ăn, phục vụ tìm kiếm nhanh.
- **souvenirsText**: Chuỗi text chứa tất cả tên đặc sản, phục vụ tìm kiếm nhanh.
- **createdAt, updatedAt**: Thời gian tạo/cập nhật.

### Liên kết:

Độc lập, có thể liên kết với Destination qua trường location.city.

### Chức năng & vai trò:

- Lưu trữ thông tin đặc sản ẩm thực và quà lưu niệm của từng tỉnh thành Việt Nam.
- Cung cấp dữ liệu cho AI chatbot khi người dùng hỏi về ẩm thực địa phương.
- Hỗ trợ tìm kiếm nhanh món ăn và đặc sản theo tỉnh thành.
- Phân loại theo vùng miền để dễ dàng quản lý và truy vấn.

### Chức năng chính:

- Tạo, chỉnh sửa, xóa thông tin đặc sản tỉnh (quản trị viên).
- Tìm kiếm món ăn, đặc sản theo tên tỉnh hoặc vùng miền.
- Tìm kiếm full-text trong tên món ăn và đặc sản.
- Hiển thị danh sách đặc sản khi người dùng xem thông tin điểm đến.
- Cung cấp dữ liệu cho AI chatbot để trả lời câu hỏi về ẩm thực.
- Hỗ trợ gợi ý món ăn và quà lưu niệm khi lập lịch trình.

---

## Tổng quan mối quan hệ giữa các Collection:

1. **User** là trung tâm, liên kết với tất cả các collection khác.
2. **Destination** là đối tượng chính, được tham chiếu bởi Itinerary, Review, UserBehavior.
3. **Itinerary** kết nối User và Destination, tạo thành lịch trình du lịch.
4. **Review** kết nối User và Destination, cung cấp đánh giá và phản hồi.
5. **ChatHistory** lưu trữ tương tác giữa User và AI chatbot.
6. **UserBehavior** theo dõi hành vi User để cá nhân hóa trải nghiệm.
7. **ProvinceSpecialty** cung cấp dữ liệu về ẩm thực và đặc sản địa phương.

## Đặc điểm kỹ thuật:

- Sử dụng MongoDB với Mongoose ODM.
- Tất cả collection đều có timestamps (createdAt, updatedAt) tự động.
- Sử dụng ObjectId để tham chiếu giữa các collection.
- Mật khẩu được mã hóa bằng bcrypt trước khi lưu.
- Có index để tối ưu hóa truy vấn (text search, user lookup).
- Hỗ trợ tìm kiếm full-text cho ProvinceSpecialty.
