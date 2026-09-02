# News Reading Tracker

Hệ thống theo dõi và phân tích hoạt động đọc tin tức của người dùng trên trình duyệt Chrome.

Hệ thống gồm 3 thành phần chính:

* **Chrome Extension**: phát hiện hoạt động đọc bài báo và thu thập dữ liệu.
* **Backend**: tiếp nhận, xử lý và lưu trữ dữ liệu.
* **Frontend Dashboard**: hiển thị lịch sử đọc báo và các thống kê.

## 1. Công nghệ sử dụng

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Axios

### Backend

* NestJS
* TypeScript
* TypeORM
* REST API

### Database

* PostgreSQL
* Docker

### Chrome Extension

* Chrome Extension Manifest V3
* JavaScript
* Chrome Tabs API
* Chrome WebNavigation API
* Chrome Storage API

## 2. Cấu trúc project

```text
news-reading-tracker/
├── backend/       # NestJS Backend
├── frontend/      # Next.js Dashboard
├── extension/     # Chrome Extension
├── docs/          # Tài liệu mô tả bài làm
└── README.md
```

## 3. Yêu cầu môi trường

Cần cài đặt:

* Node.js >= 20
* npm
* Docker
* Docker Compose
* Google Chrome

Kiểm tra Node.js:

```bash
node -v
```

Kiểm tra Docker:

```bash
docker --version
```

Kiểm tra Docker Compose:

```bash
docker compose version
```

## 4. Khởi chạy Database

Database PostgreSQL được chạy bằng Docker.

Di chuyển vào thư mục chứa file `docker-compose.yml`:

```bash
cd backend
```

Khởi động PostgreSQL:

```bash
docker compose up -d
```

Kiểm tra container:

```bash
docker ps
```

Dừng database:

```bash
docker compose down
```

## 5. Cài đặt và chạy Backend

Di chuyển vào thư mục Backend:

```bash
cd backend
```

Cài đặt dependencies:

```bash
npm install
```

Tạo file `.env` dựa trên cấu hình của project.

Ví dụ:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=news_reading_tracker
```

Sau khi PostgreSQL container đã chạy, khởi động Backend:

```bash
npm run start:dev
```

Backend mặc định chạy tại:

```text
http://localhost:3001
```

API sử dụng prefix:

```text
/api
```

Một số API chính:

```text
GET  /api/articles
GET  /api/sessions
POST /api/events
```

## 6. Cài đặt và chạy Frontend

Mở terminal mới:

```bash
cd frontend
```

Cài đặt dependencies:

```bash
npm install
```

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Khởi động Frontend:

```bash
npm run dev
```

Frontend mặc định chạy tại:

```text
http://localhost:3000
```

## 7. Cài đặt Chrome Extension

Mở Google Chrome:

```text
chrome://extensions/
```

Bật:

```text
Developer mode
```

Chọn:

```text
Load unpacked
```

Sau đó chọn thư mục:

```text
extension/
```

## 8. Chạy toàn bộ hệ thống

Thực hiện lần lượt các bước sau để khởi chạy toàn bộ hệ thống.

### 1. Database

Mở terminal:

```bash
cd backend
docker compose up -d
```

Kiểm tra container PostgreSQL:

```bash
docker ps
```

### 2. Seed dữ liệu ban đầu

Sau khi database đã khởi động, chạy seed để tạo 3 domain mặc định:

```bash
npm run seed
```

Các domain được khởi tạo:

* `vnexpress.net`
* `dantri.com.vn`
* `tuoitre.vn`

Có thể sử dụng **DBeaver** để kiểm tra database và dữ liệu sau khi seed.

### 3. Backend

Mở terminal mới:

```bash
cd backend
npm install
npm run start:dev
```

Backend chạy tại:

```text
http://localhost:3001
```

API prefix:

```text
/api
```

### 4. Frontend

Mở terminal mới:

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại:

```text
http://localhost:3000
```

### 5. Chrome Extension

Mở Chrome và truy cập:

```text
chrome://extensions/
```

Sau đó:

1. Bật **Developer mode**.
2. Chọn **Load unpacked**.
3. Chọn thư mục `extension/`.

### 6. Kiểm tra hệ thống

Sau khi tất cả thành phần đã chạy:

1. Mở Chrome.
2. Truy cập một trong các website được hỗ trợ.
3. Mở một bài báo.
4. Extension bắt đầu thu thập thông tin và tracking event.
5. Dữ liệu được gửi về Backend.
6. Backend lưu dữ liệu vào PostgreSQL.
7. Mở Dashboard tại `http://localhost:3000` để kiểm tra dữ liệu.

### Website được hỗ trợ

* VnExpress
* Dân Trí
* Tuổi Trẻ

## 10. Tài liệu

Các tài liệu mô tả chi tiết bài làm nằm trong thư mục `docs/`:

* `solution.md` – Giải pháp cho các câu hỏi của đề bài.
* `overview.md` – Tổng quan
* `images/` – Hình ảnh kết quả.


