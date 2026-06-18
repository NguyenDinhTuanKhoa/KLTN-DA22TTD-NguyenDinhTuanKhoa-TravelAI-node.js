# SƠ ĐỒ CHỨC NĂNG HỆ THỐNG TRAVELAI

## Sơ đồ tổng quan

```mermaid
graph TB
    %% Actors
    Guest[Khách - Guest]
    User[Người dùng - User]
    Admin[Quản trị viên - Admin]
    
    %% Main System
    System[HỆ THỐNG TRAVELAI]
    
    %% Guest Functions
    subgraph GuestFunc["CHỨC NĂNG KHÁCH"]
        G1[Đăng ký tài khoản]
        G2[Đăng nhập]
        G3[Xem danh sách điểm đến]
        G4[Tìm kiếm điểm đến]
        G5[Lọc theo danh mục]
        G6[Xem chi tiết điểm đến]
        G7[Xem thời tiết]
        G8[Xem ẩm thực địa phương]
        G9[Xem bản đồ]
        G10[Xem đánh giá]
        G11[Chat với AI cơ bản]
    end
    
    %% User Functions
    subgraph UserFunc["CHỨC NĂNG NGƯỜI DÙNG"]
        U1[Quản lý thông tin cá nhân]
        U2[Cập nhật sở thích]
        U3[Lưu điểm đến yêu thích]
        U4[Xem danh sách đã lưu]
        U5[Tạo lịch trình mới]
        U6[Quản lý lịch trình]
        U7[Thêm điểm đến vào lịch trình]
        U8[Tối ưu hóa lộ trình]
        U9[Viết đánh giá]
        U10[Chat AI có lịch sử]
        U11[Xem lịch sử chat]
        U12[Nhận gợi ý cá nhân hóa]
        U13[Đăng xuất]
    end
    
    %% Admin Functions
    subgraph AdminFunc["CHỨC NĂNG QUẢN TRỊ"]
        A1[Xem thống kê hệ thống]
        A2[Quản lý người dùng]
        A3[Thay đổi role người dùng]
        A4[Xóa người dùng]
        A5[Quản lý điểm đến]
        A6[Thêm điểm đến mới]
        A7[Sửa thông tin điểm đến]
        A8[Xóa điểm đến]
        A9[Quản lý đánh giá]
        A10[Xóa đánh giá vi phạm]
        A11[Duyệt đánh giá]
    end
    
    %% Connections
    Guest --> System
    User --> System
    Admin --> System
    
    System --> GuestFunc
    System --> UserFunc
    System --> AdminFunc
    
    %% Styling
    classDef guestStyle fill:#FFF4CC,stroke:#FFD700,stroke-width:2px,color:#000
    classDef userStyle fill:#D4EDDA,stroke:#28A745,stroke-width:2px,color:#000
    classDef adminStyle fill:#F8D7DA,stroke:#DC3545,stroke-width:2px,color:#000
    classDef systemStyle fill:#E3F2FD,stroke:#2196F3,stroke-width:3px,color:#000
    classDef actorStyle fill:#B0BEC5,stroke:#455A64,stroke-width:2px,color:#000
    
    class G1,G2,G3,G4,G5,G6,G7,G8,G9,G10,G11 guestStyle
    class U1,U2,U3,U4,U5,U6,U7,U8,U9,U10,U11,U12,U13 userStyle
    class A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11 adminStyle
    class System systemStyle
    class Guest,User,Admin actorStyle
```

---

## Sơ đồ chi tiết theo module

```mermaid
graph LR
    %% Main Modules
    System[HỆ THỐNG TRAVELAI]
    
    %% Authentication Module
    subgraph AuthModule["MODULE XÁC THỰC"]
        Auth1[Đăng ký]
        Auth2[Đăng nhập]
        Auth3[Đăng xuất]
        Auth4[Quản lý phiên làm việc JWT]
    end
    
    %% Destination Module
    subgraph DestModule["MODULE ĐIỂM ĐẾN"]
        Dest1[Xem danh sách]
        Dest2[Tìm kiếm]
        Dest3[Lọc theo danh mục]
        Dest4[Xem chi tiết]
        Dest5[CRUD điểm đến Admin]
    end
    
    %% Itinerary Module
    subgraph ItinModule["MODULE LỊCH TRÌNH"]
        Itin1[Tạo lịch trình]
        Itin2[Xem lịch trình]
        Itin3[Sửa lịch trình]
        Itin4[Xóa lịch trình]
        Itin5[Thêm điểm đến]
        Itin6[Tối ưu hóa lộ trình]
    end
    
    %% AI Module
    subgraph AIModule["MODULE AI"]
        AI1[Chat cơ bản]
        AI2[Chat có lịch sử]
        AI3[Gợi ý lịch trình]
        AI4[Gợi ý điểm đến]
        AI5[Phát hiện vùng miền]
        AI6[Gợi ý cá nhân hóa]
    end
    
    %% Review Module
    subgraph ReviewModule["MODULE ĐÁNH GIÁ"]
        Rev1[Viết đánh giá]
        Rev2[Xem đánh giá]
        Rev3[Quản lý đánh giá Admin]
        Rev4[Xóa đánh giá vi phạm]
    end
    
    %% User Module
    subgraph UserModule["MODULE NGƯỜI DÙNG"]
        User1[Quản lý profile]
        User2[Cập nhật sở thích]
        User3[Lưu điểm đến yêu thích]
        User4[Xem đã lưu]
        User5[Quản lý người dùng Admin]
    end
    
    %% Weather Module
    subgraph WeatherModule["MODULE THỜI TIẾT"]
        Weather1[Xem thời tiết hiện tại]
        Weather2[Dự báo 5 ngày]
    end
    
    %% Admin Module
    subgraph AdminModule["MODULE QUẢN TRỊ"]
        Admin1[Dashboard thống kê]
        Admin2[Quản lý người dùng]
        Admin3[Quản lý điểm đến]
        Admin4[Quản lý đánh giá]
        Admin5[Phân quyền]
    end
    
    %% Connections
    System --> AuthModule
    System --> DestModule
    System --> ItinModule
    System --> AIModule
    System --> ReviewModule
    System --> UserModule
    System --> WeatherModule
    System --> AdminModule
    
    %% Styling
    classDef moduleStyle fill:#E8EAF6,stroke:#3F51B5,stroke-width:2px
    classDef systemStyle fill:#E3F2FD,stroke:#2196F3,stroke-width:3px
    
    class AuthModule,DestModule,ItinModule,AIModule,ReviewModule,UserModule,WeatherModule,AdminModule moduleStyle
    class System systemStyle
```

---

## Sơ đồ phân cấp chức năng

```mermaid
graph TD
    Root[HỆ THỐNG TRAVELAI]
    
    %% Level 1
    Root --> Auth[Xác thực & Phân quyền]
    Root --> Dest[Quản lý Điểm đến]
    Root --> Itin[Quản lý Lịch trình]
    Root --> AI[Trí tuệ nhân tạo]
    Root --> Review[Đánh giá & Nhận xét]
    Root --> Admin[Quản trị hệ thống]
    
    %% Level 2 - Auth
    Auth --> Auth1[Đăng ký]
    Auth --> Auth2[Đăng nhập]
    Auth --> Auth3[JWT Token]
    
    %% Level 2 - Destination
    Dest --> Dest1[Xem & Tìm kiếm]
    Dest --> Dest2[Chi tiết điểm đến]
    Dest --> Dest3[Lưu yêu thích]
    Dest --> Dest4[CRUD Admin]
    
    %% Level 3 - Destination Detail
    Dest2 --> Dest2a[Thông tin cơ bản]
    Dest2 --> Dest2b[Thời tiết]
    Dest2 --> Dest2c[Ẩm thực]
    Dest2 --> Dest2d[Bản đồ]
    Dest2 --> Dest2e[Đánh giá]
    
    %% Level 2 - Itinerary
    Itin --> Itin1[Tạo lịch trình]
    Itin --> Itin2[Quản lý lịch trình]
    Itin --> Itin3[Tối ưu hóa]
    
    %% Level 3 - Itinerary Management
    Itin2 --> Itin2a[Xem danh sách]
    Itin2 --> Itin2b[Chỉnh sửa]
    Itin2 --> Itin2c[Xóa]
    Itin2 --> Itin2d[Thêm điểm đến]
    
    %% Level 2 - AI
    AI --> AI1[Chatbot]
    AI --> AI2[Gợi ý thông minh]
    AI --> AI3[Phân tích vùng miền]
    
    %% Level 3 - AI Chatbot
    AI1 --> AI1a[Chat cơ bản]
    AI1 --> AI1b[Chat có lịch sử]
    AI1 --> AI1c[Lịch sử chat]
    
    %% Level 3 - AI Recommendation
    AI2 --> AI2a[Gợi ý điểm đến]
    AI2 --> AI2b[Gợi ý lịch trình]
    AI2 --> AI2c[Cá nhân hóa]
    
    %% Level 2 - Review
    Review --> Rev1[Viết đánh giá]
    Review --> Rev2[Xem đánh giá]
    Review --> Rev3[Kiểm duyệt Admin]
    
    %% Level 2 - Admin
    Admin --> Admin1[Thống kê]
    Admin --> Admin2[Quản lý User]
    Admin --> Admin3[Quản lý Destination]
    Admin --> Admin4[Quản lý Review]
    
    %% Styling
    classDef level1 fill:#BBDEFB,stroke:#1976D2,stroke-width:3px
    classDef level2 fill:#C8E6C9,stroke:#388E3C,stroke-width:2px
    classDef level3 fill:#FFF9C4,stroke:#F57C00,stroke-width:2px
    classDef root fill:#E1BEE7,stroke:#7B1FA2,stroke-width:4px
    
    class Root root
    class Auth,Dest,Itin,AI,Review,Admin level1
    class Auth1,Auth2,Auth3,Dest1,Dest2,Dest3,Dest4,Itin1,Itin2,Itin3,AI1,AI2,AI3,Rev1,Rev2,Rev3,Admin1,Admin2,Admin3,Admin4 level2
    class Dest2a,Dest2b,Dest2c,Dest2d,Dest2e,Itin2a,Itin2b,Itin2c,Itin2d,AI1a,AI1b,AI1c,AI2a,AI2b,AI2c level3
```

---

## Sơ đồ luồng chức năng chính

```mermaid
graph LR
    %% User Journey
    Start[Người dùng truy cập]
    
    %% Guest Flow
    Start --> Browse[Xem điểm đến]
    Browse --> Search[Tìm kiếm & Lọc]
    Search --> Detail[Xem chi tiết]
    Detail --> Register[Đăng ký tài khoản]
    
    %% User Flow
    Register --> Login[Đăng nhập]
    Login --> Profile[Cập nhật sở thích]
    Profile --> ChatAI[Chat với AI]
    ChatAI --> GetSuggestion[Nhận gợi ý]
    GetSuggestion --> CreateItin[Tạo lịch trình]
    CreateItin --> AddDest[Thêm điểm đến]
    AddDest --> Optimize[Tối ưu hóa lộ trình]
    Optimize --> Travel[Đi du lịch]
    Travel --> WriteReview[Viết đánh giá]
    
    %% Save Flow
    Detail --> Save[Lưu yêu thích]
    Save --> CreateItin
    
    %% Admin Flow
    Login --> AdminCheck{Admin?}
    AdminCheck -->|Yes| Dashboard[Dashboard]
    Dashboard --> ManageDest[Quản lý điểm đến]
    Dashboard --> ManageUser[Quản lý người dùng]
    Dashboard --> ManageReview[Quản lý đánh giá]
    
    %% Styling
    classDef guestFlow fill:#FFF4CC,stroke:#FFD700,stroke-width:2px
    classDef userFlow fill:#D4EDDA,stroke:#28A745,stroke-width:2px
    classDef adminFlow fill:#F8D7DA,stroke:#DC3545,stroke-width:2px
    classDef decision fill:#FFE0B2,stroke:#F57C00,stroke-width:2px
    
    class Start,Browse,Search,Detail,Register guestFlow
    class Login,Profile,ChatAI,GetSuggestion,CreateItin,AddDest,Optimize,Travel,WriteReview,Save userFlow
    class Dashboard,ManageDest,ManageUser,ManageReview adminFlow
    class AdminCheck decision
```

---

## Sơ đồ chức năng theo API Endpoints

```mermaid
graph TB
    API[API ENDPOINTS]
    
    %% Auth APIs
    subgraph AuthAPI["🔐 /api/auth"]
        AuthAPI1[POST /register]
        AuthAPI2[POST /login]
    end
    
    %% User APIs
    subgraph UserAPI["👤 /api/users"]
        UserAPI1[GET /profile]
        UserAPI2[PUT /profile]
        UserAPI3[GET /:id]
    end
    
    %% Destination APIs
    subgraph DestAPI["🏝️ /api/destinations"]
        DestAPI1[GET /]
        DestAPI2[GET /:id]
        DestAPI3[POST /]
        DestAPI4[PUT /:id]
        DestAPI5[DELETE /:id]
    end
    
    %% Itinerary APIs
    subgraph ItinAPI["📅 /api/itineraries"]
        ItinAPI1[GET /]
        ItinAPI2[POST /]
        ItinAPI3[GET /:id]
        ItinAPI4[PUT /:id]
        ItinAPI5[DELETE /:id]
        ItinAPI6[POST /:id/destinations]
    end
    
    %% AI APIs
    subgraph AIAPI["🤖 /api/ai"]
        AIAPI1[POST /chat]
        AIAPI2[POST /chat-with-history]
        AIAPI3[GET /history]
        AIAPI4[DELETE /history]
    end
    
    %% Review APIs
    subgraph ReviewAPI["⭐ /api/reviews"]
        ReviewAPI1[GET /destination/:id]
        ReviewAPI2[POST /]
        ReviewAPI3[GET /my]
    end
    
    %% Saved APIs
    subgraph SavedAPI["❤️ /api/saved"]
        SavedAPI1[GET /]
        SavedAPI2[POST /:id]
        SavedAPI3[GET /check/:id]
    end
    
    %% Weather APIs
    subgraph WeatherAPI["🌤️ /api/weather"]
        WeatherAPI1[GET /current]
        WeatherAPI2[GET /forecast]
    end
    
    %% Recommendation APIs
    subgraph RecAPI["🎯 /api/recommendations"]
        RecAPI1[GET /personalized]
        RecAPI2[GET /trending]
    end
    
    %% Admin APIs
    subgraph AdminAPI["⚙️ /api/admin"]
        AdminAPI1[GET /stats]
        AdminAPI2[GET /users]
        AdminAPI3[PUT /users/:id/role]
        AdminAPI4[DELETE /users/:id]
        AdminAPI5[GET /reviews]
        AdminAPI6[DELETE /reviews/:id]
    end
    
    %% Connections
    API --> AuthAPI
    API --> UserAPI
    API --> DestAPI
    API --> ItinAPI
    API --> AIAPI
    API --> ReviewAPI
    API --> SavedAPI
    API --> WeatherAPI
    API --> RecAPI
    API --> AdminAPI
    
    %% Styling
    classDef apiStyle fill:#E8F5E9,stroke:#4CAF50,stroke-width:2px
    classDef mainStyle fill:#E3F2FD,stroke:#2196F3,stroke-width:3px
    
    class AuthAPI1,AuthAPI2,UserAPI1,UserAPI2,UserAPI3,DestAPI1,DestAPI2,DestAPI3,DestAPI4,DestAPI5,ItinAPI1,ItinAPI2,ItinAPI3,ItinAPI4,ItinAPI5,ItinAPI6,AIAPI1,AIAPI2,AIAPI3,AIAPI4,ReviewAPI1,ReviewAPI2,ReviewAPI3,SavedAPI1,SavedAPI2,SavedAPI3,WeatherAPI1,WeatherAPI2,RecAPI1,RecAPI2,AdminAPI1,AdminAPI2,AdminAPI3,AdminAPI4,AdminAPI5,AdminAPI6 apiStyle
    class API mainStyle
```

---

## Hướng dẫn sử dụng

### Xem trực tiếp:
1. Copy mã Mermaid
2. Vào: https://mermaid.live/
3. Paste và xem kết quả

### Export hình ảnh:
1. Trên Mermaid Live, click **Actions** → **Export PNG/SVG**
2. Lưu hình và chèn vào Word

### Chỉnh sửa:
- Thay đổi màu sắc: Sửa trong phần `classDef`
- Thêm/bớt chức năng: Thêm node mới và kết nối
- Thay đổi layout: Đổi `graph TB` (top-bottom) thành `graph LR` (left-right)

---

*Tài liệu được tạo cho hệ thống TravelAI*
