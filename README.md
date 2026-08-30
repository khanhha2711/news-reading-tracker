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

Có thể chạy hệ thống theo thứ tự:

### 1. Database

```bash
cd backend
docker compose up -d
```

### 2. Backend

```bash
cd backend
npm install
npm run start:dev
```

### 3. Frontend

Mở terminal mới:

```bash
cd frontend
npm install
npm run dev
```

### 4. Chrome Extension

Vào:

```text
chrome://extensions/
```

Sau đó:

```text
Developer mode
→ Load unpacked
→ Chọn thư mục extension/
```

## 9. Kiểm tra hoạt động

Sau khi các thành phần được khởi chạy:

1. Mở Chrome.
2. Truy cập một trong các website được hỗ trợ.
3. Mở một bài báo.
4. Extension thu thập thông tin bài báo.
5. Extension ghi nhận các event trong quá trình đọc.
6. Dữ liệu được gửi về Backend.
7. Backend lưu dữ liệu vào PostgreSQL.
8. Truy cập Dashboard để xem dữ liệu.

### Website được hỗ trợ

* VnExpress
* Dân Trí
* Tuổi Trẻ

## 10. Tài liệu

Các tài liệu mô tả chi tiết bài làm nằm trong thư mục `docs/`:

* `solution.md` – Giải pháp cho các câu hỏi của đề bài.
* `architecture.md` – Kiến trúc hệ thống.
* `features.md` – Các chức năng đã hoàn thành.
* `limitations.md` – Các chức năng chưa hoàn thành và hạn chế.
* `technical-decisions.md` – Các quyết định kỹ thuật quan trọng.
* `images/` – Hình ảnh kết quả.


