# MÔ TẢ SƠ ĐỒ PHÂN CẤP CHỨC NĂNG HỆ THỐNG TRAVELAI

## 1. Tổng quan

Sơ đồ phân cấp chức năng của hệ thống TravelAI được tổ chức theo cấu trúc phân cấp ba tầng, bao gồm **hệ thống chính** ở cấp cao nhất, **các module chức năng** ở cấp trung gian, và **các chức năng cụ thể** ở cấp thấp nhất. Sơ đồ được thiết kế theo mô hình phân quyền rõ ràng, phân biệt ba nhóm người dùng chính: Khách (Guest), Người dùng đã đăng ký (User), và Quản trị viên (Admin).

---

## 2. Cấu trúc phân cấp

### **Cấp 1: Hệ thống chính**

Ở cấp cao nhất là **Hệ thống TravelAI** - đây là nền tảng trung tâm điều phối toàn bộ các chức năng của ứng dụng. Hệ thống này đóng vai trò là điểm kết nối giữa người dùng và các module chức năng bên trong. Từ hệ thống chính, luồng xử lý được phân nhánh xuống ba nhóm chức năng chính tương ứng với ba loại tác nhân: chức năng dành cho Khách, chức năng dành cho Người dùng, và chức năng dành cho Quản trị viên.

### **Cấp 2: Các nhóm chức năng theo tác nhân**

#### **2.1. Nhóm chức năng Khách (Guest)**

Nhóm chức năng này được thiết kế dành cho người dùng mới truy cập hệ thống lần đầu hoặc chưa đăng nhập. Mục tiêu chính là thu hút người dùng, giới thiệu các tính năng cơ bản của hệ thống và khuyến khích họ đăng ký tài khoản. Nhóm chức năng Khách bao gồm 11 chức năng cơ bản, được sắp xếp theo trình tự logic từ việc tạo tài khoản đến việc khám phá thông tin du lịch.

Luồng chức năng bắt đầu từ **Đăng ký tài khoản** - đây là bước đầu tiên để người dùng chuyển đổi từ trạng thái khách sang người dùng chính thức. Sau khi đăng ký, người dùng có thể **Đăng nhập** để truy cập các chức năng nâng cao hơn. Ngay cả khi chưa đăng nhập, khách vẫn có thể **Xem danh sách điểm đến** để duyệt qua các địa điểm du lịch có sẵn trong hệ thống.

Để hỗ trợ việc tìm kiếm thông tin hiệu quả, hệ thống cung cấp chức năng **Tìm kiếm điểm đến** cho phép người dùng nhập từ khóa tên địa điểm hoặc tỉnh thành. Bên cạnh đó, chức năng **Lọc theo danh mục** giúp người dùng thu hẹp kết quả tìm kiếm theo các tiêu chí như loại địa điểm (biển, núi, thành phố, di tích), mức giá (budget, mid-range, luxury), hoặc các tiện nghi có sẵn.

Khi đã tìm được điểm đến quan tâm, người dùng có thể **Xem chi tiết điểm đến** để truy cập thông tin đầy đủ. Trang chi tiết này tích hợp nhiều thông tin hữu ích như **Xem thời tiết** hiện tại và dự báo 5 ngày tới của địa điểm, **Xem ẩm thực địa phương** để tìm hiểu về các món ăn đặc sản và nhà hàng nổi tiếng, **Xem bản đồ** hiển thị vị trí chính xác trên bản đồ tương tác (sử dụng Leaflet/OpenStreetMap), và **Xem đánh giá** từ những người dùng khác đã từng đến địa điểm đó.

Cuối cùng, chức năng **Chat với AI cơ bản** cho phép khách tương tác với chatbot thông minh để nhận tư vấn về du lịch, hỏi đáp về điểm đến, hoặc nhận gợi ý lịch trình sơ bộ. Tuy nhiên, ở chế độ khách, lịch sử chat sẽ không được lưu lại.

#### **2.2. Nhóm chức năng Người dùng (User)**

Sau khi đăng nhập thành công, người dùng được nâng cấp lên vai trò User và có quyền truy cập vào 12 chức năng nâng cao. Nhóm chức năng này tập trung vào việc cá nhân hóa trải nghiệm, quản lý thông tin cá nhân, và hỗ trợ lập kế hoạch du lịch chi tiết.

Luồng chức năng bắt đầu từ **Quản lý thông tin cá nhân**, cho phép người dùng cập nhật họ tên, avatar, email, và các thông tin cơ bản khác. Tiếp theo là **Cập nhật sở thích**, đây là chức năng quan trọng giúp hệ thống hiểu rõ hơn về phong cách du lịch của người dùng (phiêu lưu, thư giãn, văn hóa, ẩm thực), ngân sách dự kiến (thấp, trung bình, cao), và các sở thích cụ thể (biển, núi, thành phố, di tích lịch sử). Thông tin này được lưu trữ và sử dụng để cá nhân hóa các gợi ý từ AI.

Chức năng **Lưu điểm đến yêu thích** cho phép người dùng đánh dấu các địa điểm quan tâm để dễ dàng truy cập sau này. Danh sách các điểm đã lưu có thể được xem lại thông qua chức năng **Xem danh sách đã lưu**, giúp người dùng theo dõi và quản lý các địa điểm mình muốn ghé thăm trong tương lai.

Một trong những tính năng cốt lõi của hệ thống là **Tạo lịch trình mới**. Người dùng có thể tạo kế hoạch du lịch chi tiết bằng cách nhập tiêu đề, mô tả, ngày bắt đầu và ngày kết thúc. Sau khi tạo lịch trình, người dùng có thể **Quản lý lịch trình** để xem danh sách tất cả các lịch trình đã tạo, chỉnh sửa thông tin, hoặc xóa lịch trình không còn cần thiết.

Chức năng **Thêm điểm đến vào lịch trình** cho phép người dùng xây dựng lịch trình chi tiết bằng cách thêm các địa điểm vào từng ngày cụ thể, kèm theo ghi chú và danh sách hoạt động dự định. Đặc biệt, hệ thống cung cấp chức năng **Tối ưu hóa lộ trình** sử dụng thuật toán Nearest Neighbor và công thức Haversine để tự động sắp xếp lại thứ tự các điểm đến theo khoảng cách gần nhất, giúp tiết kiệm thời gian di chuyển và chi phí.

Sau khi hoàn thành chuyến đi, người dùng có thể **Viết đánh giá** để chia sẻ trải nghiệm, đánh giá từ 1-5 sao, và đăng tải hình ảnh. Đánh giá này không chỉ giúp cộng đồng mà còn cải thiện độ chính xác của thuật toán gợi ý.

Khác với chế độ khách, người dùng đã đăng nhập có thể sử dụng **Chat AI có lịch sử**, cho phép lưu trữ các cuộc trò chuyện và tiếp tục chat trong cùng một thread. Chức năng **Xem lịch sử chat** giúp người dùng xem lại các cuộc trò chuyện trước đó, và AI sẽ sử dụng thông tin sở thích cá nhân để đưa ra gợi ý chính xác hơn.

Cuối cùng, chức năng **Nhận gợi ý cá nhân hóa** sử dụng thuật toán recommendation dựa trên sở thích người dùng, lịch sử tìm kiếm, điểm đến đã lưu, và hành vi tương tác để đưa ra danh sách điểm đến phù hợp nhất với từng cá nhân.

#### **2.3. Nhóm chức năng Quản trị viên (Admin)**

Quản trị viên có quyền truy cập vào 10 chức năng quản lý hệ thống, được thiết kế để giám sát, điều phối và duy trì chất lượng nội dung trên nền tảng. Nhóm chức năng này yêu cầu quyền truy cập cao nhất và chỉ dành cho những người được phân quyền là "admin".

Luồng chức năng bắt đầu từ **Xem thống kê hệ thống**, cung cấp dashboard tổng quan với các chỉ số quan trọng như tổng số người dùng, tổng số điểm đến, tổng số lịch trình đã tạo, tổng số đánh giá, số lượng người dùng mới trong tháng, điểm đến được xem nhiều nhất, và điểm đến có đánh giá cao nhất. Thông tin này giúp quản trị viên đưa ra các quyết định điều hành chính xác và kịp thời.

Chức năng **Quản lý người dùng** cho phép admin xem danh sách tất cả người dùng, tìm kiếm theo tên hoặc email, và xem thông tin chi tiết tài khoản. Khi cần thiết, admin có thể **Thay đổi role người dùng** để nâng cấp một user thành admin hoặc ngược lại, hoặc **Xóa người dùng** khi phát hiện hành vi vi phạm chính sách hoặc spam.

Một phần quan trọng khác là **Quản lý điểm đến**, cho phép admin kiểm soát toàn bộ nội dung về các địa điểm du lịch. Admin có thể **Thêm điểm đến mới** bằng cách nhập đầy đủ thông tin như tên, mô tả, vị trí, tọa độ GPS, hình ảnh, danh mục, mức giá, tiện nghi, hoạt động nổi bật, thời gian tốt nhất để đi, và danh sách món ăn địa phương. Chức năng **Sửa thông tin điểm đến** cho phép cập nhật thông tin khi có thay đổi, và **Xóa điểm đến** khi địa điểm không còn phù hợp hoặc đã đóng cửa.

Cuối cùng, chức năng **Quản lý đánh giá** giúp admin xem danh sách tất cả đánh giá trong hệ thống, lọc theo điểm đến hoặc người dùng. Khi phát hiện đánh giá không phù hợp (spam, ngôn từ không phù hợp, nội dung sai lệch), admin có thể sử dụng chức năng **Xóa đánh giá vi phạm** để loại bỏ nội dung đó. Hệ thống sẽ tự động cập nhật lại điểm đánh giá trung bình và số lượt đánh giá của điểm đến tương ứng.

---

## 3. Mối quan hệ giữa các cấp

### **3.1. Quan hệ phân cấp dọc**

Sơ đồ được tổ chức theo cấu trúc cây phân cấp, trong đó mỗi cấp thấp hơn là con của cấp cao hơn. Hệ thống TravelAI ở cấp cao nhất phân nhánh xuống ba nhóm chức năng chính (Khách, User, Admin). Mỗi nhóm chức năng lại phân nhánh xuống các chức năng cụ thể, được sắp xếp theo trình tự logic từ trên xuống dưới.

Ví dụ, trong nhóm chức năng Khách, luồng xử lý được thiết kế theo trình tự tự nhiên: Đăng ký → Đăng nhập → Xem danh sách → Tìm kiếm → Lọc → Xem chi tiết → Xem thông tin bổ sung (thời tiết, ẩm thực, bản đồ, đánh giá) → Chat AI. Trình tự này phản ánh hành trình người dùng thực tế khi sử dụng hệ thống.

### **3.2. Quan hệ kế thừa quyền**

Một đặc điểm quan trọng của sơ đồ là mối quan hệ kế thừa quyền giữa các nhóm tác nhân. Người dùng (User) kế thừa tất cả các quyền của Khách (Guest), có nghĩa là User có thể thực hiện tất cả các chức năng mà Guest có thể làm, cộng thêm các chức năng nâng cao dành riêng cho User. Tương tự, Quản trị viên (Admin) kế thừa tất cả các quyền của User, cộng thêm các chức năng quản trị hệ thống.

Mô hình kế thừa này được thể hiện qua công thức:
- **Quyền của Guest** = 11 chức năng cơ bản
- **Quyền của User** = Quyền của Guest + 12 chức năng nâng cao = 23 chức năng
- **Quyền của Admin** = Quyền của User + 10 chức năng quản trị = 33 chức năng

### **3.3. Quan hệ phụ thuộc chức năng**

Một số chức năng có mối quan hệ phụ thuộc lẫn nhau. Ví dụ:
- Chức năng "Xem chi tiết điểm đến" phụ thuộc vào "Xem danh sách điểm đến" hoặc "Tìm kiếm điểm đến"
- Chức năng "Thêm điểm đến vào lịch trình" phụ thuộc vào "Tạo lịch trình mới"
- Chức năng "Tối ưu hóa lộ trình" chỉ có thể thực hiện sau khi đã "Thêm điểm đến vào lịch trình"
- Chức năng "Viết đánh giá" yêu cầu người dùng phải đăng nhập (User)

---

## 4. Luồng xử lý dữ liệu

### **4.1. Luồng dữ liệu từ trên xuống (Top-Down)**

Khi người dùng thực hiện một hành động, yêu cầu được gửi từ giao diện người dùng (Frontend) lên Hệ thống TravelAI (Backend). Hệ thống xác định loại tác nhân (Guest, User, hoặc Admin) thông qua JWT token, sau đó định tuyến yêu cầu đến nhóm chức năng tương ứng. Nhóm chức năng sẽ gọi đến chức năng cụ thể để xử lý logic nghiệp vụ.

Ví dụ: Khi User muốn tạo lịch trình mới:
1. User gửi yêu cầu từ giao diện
2. Hệ thống xác thực JWT token và xác định đây là User
3. Yêu cầu được chuyển đến nhóm chức năng User
4. Chức năng "Tạo lịch trình mới" được gọi
5. Dữ liệu được lưu vào collection `itineraries` trong MongoDB
6. Kết quả được trả về cho người dùng

### **4.2. Luồng dữ liệu từ dưới lên (Bottom-Up)**

Sau khi chức năng cụ thể xử lý xong, kết quả được trả về theo chiều ngược lại: từ chức năng cụ thể → nhóm chức năng → hệ thống → giao diện người dùng. Trong quá trình này, dữ liệu có thể được xử lý, định dạng, hoặc làm giàu thêm thông tin trước khi hiển thị cho người dùng.

---

## 5. Phân màu và ký hiệu

Để dễ dàng phân biệt các nhóm chức năng, sơ đồ sử dụng hệ thống màu sắc nhất quán:

- **Màu vàng nhạt (#FFF4CC)**: Chức năng dành cho Khách (Guest)
- **Màu xanh lá nhạt (#D4EDDA)**: Chức năng dành cho Người dùng (User)
- **Màu hồng nhạt (#F8D7DA)**: Chức năng dành cho Quản trị viên (Admin)
- **Màu xanh dương nhạt (#E3F2FD)**: Hệ thống chính
- **Màu xám (#B0BEC5)**: Các tác nhân (Actors)
- **Màu xám nhạt (#F5F5F5)**: Nhóm chức năng

Các mũi tên trong sơ đồ thể hiện luồng điều hướng và phụ thuộc:
- **Mũi tên liền nét**: Quan hệ trực tiếp, luồng xử lý chính
- **Mũi tên đứt nét**: Quan hệ phụ thuộc, tham chiếu

---

## 6. Ý nghĩa và ứng dụng

### **6.1. Đối với nhà phát triển**

Sơ đồ phân cấp chức năng giúp đội ngũ phát triển:
- Hiểu rõ cấu trúc tổng thể của hệ thống
- Xác định phạm vi và ranh giới của từng module
- Thiết kế API endpoints phù hợp với cấu trúc phân cấp
- Phân chia công việc theo module và chức năng
- Đảm bảo tính nhất quán trong việc phân quyền

### **6.2. Đối với người quản lý dự án**

Sơ đồ giúp người quản lý:
- Đánh giá khối lượng công việc cho từng module
- Lập kế hoạch phát triển theo từng giai đoạn
- Ưu tiên phát triển các chức năng cốt lõi trước
- Theo dõi tiến độ phát triển theo từng nhóm chức năng

### **6.3. Đối với người kiểm thử**

Sơ đồ giúp đội ngũ QA:
- Thiết kế test case theo từng cấp độ chức năng
- Kiểm tra phân quyền giữa các nhóm tác nhân
- Đảm bảo tính toàn vẹn của luồng xử lý
- Phát hiện các chức năng bị thiếu hoặc trùng lặp

### **6.4. Đối với người dùng cuối**

Mặc dù người dùng không trực tiếp xem sơ đồ này, nhưng cấu trúc phân cấp rõ ràng giúp:
- Giao diện người dùng được tổ chức logic và dễ sử dụng
- Người dùng dễ dàng tìm thấy chức năng cần thiết
- Trải nghiệm người dùng mượt mà và nhất quán

---

## 7. Kết luận

Sơ đồ phân cấp chức năng của hệ thống TravelAI được thiết kế theo nguyên tắc phân cấp rõ ràng, phân quyền hợp lý, và tổ chức logic. Với 33 chức năng được phân bổ hợp lý cho 3 nhóm tác nhân, hệ thống đảm bảo cung cấp trải nghiệm phù hợp cho từng đối tượng người dùng, từ khách mới truy cập đến quản trị viên hệ thống.

Cấu trúc phân cấp này không chỉ giúp dễ dàng quản lý và phát triển hệ thống mà còn tạo nền tảng vững chắc cho việc mở rộng và bổ sung các chức năng mới trong tương lai. Mỗi chức năng được đặt đúng vị trí trong cây phân cấp, đảm bảo tính logic, dễ hiểu, và dễ bảo trì.

---

*Tài liệu được tạo cho hệ thống TravelAI - Hệ thống gợi ý du lịch thông minh*
