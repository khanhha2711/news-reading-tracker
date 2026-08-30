# Tổng quan dự án

## 1. Chức năng đã hoàn thành

### Chrome Extension

* Theo dõi hoạt động trên trình duyệt và các tab.
* Phát hiện và theo dõi bài báo trên các website được cấu hình trong hệ thống.
* Thu thập URL, domain, title và nội dung bài báo.
* Theo dõi trạng thái hoạt động của người dùng.
* Ghi nhận các event trong quá trình đọc.
* Quản lý nhiều tab và session.

### Backend

* Nhận và xử lý event từ Extension.
* Lưu trữ dữ liệu vào PostgreSQL.
* Quản lý session, article, article visit và event.
* Cung cấp API cho Extension và Dashboard.

### Dashboard

* Hiển thị danh sách bài báo đã đọc.
* Hiển thị thông tin và chi tiết bài báo.
* Hiển thị thời gian đọc.
* Hiển thị timeline các event.
* Hiển thị các thống kê và biểu đồ.
* Hỗ trợ phân trang và thay đổi số lượng bản ghi.

---

## 2. Chức năng chưa hoàn thành và hạn chế

* **Realtime Dashboard:** Chưa triển khai WebSocket để cập nhật dữ liệu Dashboard theo thời gian thực. Hiện tại dữ liệu được lấy thông qua API.

* **Quản lý website:** Chưa xây dựng giao diện để thêm hoặc chỉnh sửa website. Danh sách domain hiện được quản lý trong Database, vì vậy vẫn có thể mở rộng website mà không cần thay đổi logic chính của Extension.

* **PAGE_LEAVE:** Trong trường hợp Chrome hoặc Extension bị đóng đột ngột, `PAGE_LEAVE` có thể không được gửi về Server. Hệ thống cần cơ chế bổ sung để xác định và đóng các phiên đọc chưa hoàn tất.

* **Trích xuất nội dung:** Việc hỗ trợ website mới vẫn phụ thuộc vào khả năng trích xuất nội dung của Mozilla Readability và cấu trúc thực tế của website.

---

## Các quyết định kỹ thuật quan trọng

* **Event-based tracking:** Thay vì chỉ lưu kết quả cuối cùng của một lần đọc, hệ thống ghi nhận các trạng thái `PAGE_ENTER`, `PAGE_ACTIVE`, `PAGE_INACTIVE`, `PAGE_LEAVE` kèm timestamp. Cách này cho phép tính toán `readingTime` dựa trên trạng thái thực tế và xây dựng timeline hoạt động.

* **Tách Session và Tab:** `sessionId` đại diện cho một phiên sử dụng, trong khi `tabId` định danh từng tab. Hai định danh được sử dụng kết hợp để xử lý chính xác trường hợp người dùng mở và chuyển đổi giữa nhiều tab.

* **Mozilla Readability:** Sử dụng thuật toán trích xuất nội dung chính thay vì phụ thuộc hoàn toàn vào CSS selector của từng website. Điều này giúp giảm độ phụ thuộc vào cấu trúc HTML cụ thể của website.

* **Server-side aggregation:** Dữ liệu event và article visit được lưu riêng, sau đó Backend tổng hợp thành dữ liệu phục vụ Dashboard. Cách này giữ được dữ liệu gốc và cho phép xây dựng nhiều loại thống kê từ cùng một nguồn dữ liệu.

* **Pagination:** Không trả toàn bộ danh sách bài báo trong mỗi request. Backend thực hiện phân trang với `page` và `limit`, giảm kích thước response và lượng dữ liệu Frontend cần xử lý.

* **Configuration-driven websites:** Danh sách domain được lưu trong database thay vì hard-code hoàn toàn trong Extension. Khi thêm domain mới, Extension có thể lấy cấu hình mới từ Backend thay vì phải thay đổi toàn bộ logic ứng dụng.

* **Dockerized PostgreSQL:** PostgreSQL được chạy bằng Docker để cô lập môi trường database, giúp việc khởi tạo và tái tạo môi trường development nhất quán hơn.
