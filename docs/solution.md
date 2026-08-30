## 1. Thu thập và theo dõi hoạt động đọc báo

### 1.1. Phát hiện bài báo

Chrome Extension sử dụng các Chrome Extension APIs để theo dõi hoạt động của tab và trình duyệt. `Content Script` được sử dụng để tương tác với DOM và kiểm tra URL nhằm xác định trang hiện tại có phải bài báo hay không. Chỉ thực hiện thu thập dữ liệu khi trang được xác định là bài báo.

Hệ thống hiện hỗ trợ `vnexpress.net`, `dantri.com.vn` và `tuoitre.vn`. Danh sách website được quản lý từ Backend/Database nên có thể mở rộng thêm website.

### 1.2. Thu thập thông tin bài báo

Sau khi xác định là bài báo, `Content Script` thu thập URL, domain, title và nội dung bài viết.

Hệ thống sử dụng **Mozilla Readability** để phân tích DOM và lấy nội dung chính, giúp giảm phụ thuộc vào selector cố định khi cấu trúc HTML của website thay đổi.

### 1.3. Xác định thời gian đọc thực tế

Hệ thống sử dụng các event `PAGE_ENTER`, `PAGE_ACTIVE`, `PAGE_INACTIVE` và `PAGE_LEAVE` để theo dõi trạng thái đọc.

Thời gian đọc được tính dựa trên các khoảng thời gian bài báo ở trạng thái active thay vì chỉ lấy thời gian tab được mở.

### 1.4. Quản lý nhiều tab

Mỗi tab được quản lý bằng `tabId`, giúp phân biệt độc lập các bài báo khi người dùng mở nhiều tab hoặc chuyển đổi liên tục giữa các tab.

Mỗi lần truy cập bài báo cũng có id riêng để liên kết các event phát sinh trong quá trình đọc.

### 1.5. ### Quản lý Session

`sessionId` được sử dụng để nhóm các hoạt động phát sinh trong cùng một phiên sử dụng Extension.

Khi Extension khởi động, hệ thống kiểm tra session hiện tại. Nếu chưa có session hợp lệ, một `sessionId` mới được tạo và lưu lại.

Trong quá trình sử dụng, các hoạt động của người dùng được theo dõi. Nếu không phát sinh hoạt động trong một khoảng thời gian timeout được cấu hình, session hiện tại được xem là đã kết thúc. Khi người dùng tiếp tục hoạt động, hệ thống tạo một `sessionId` mới cho phiên tiếp theo.

`sessionId` được kết hợp với `tabId` để xác định event thuộc phiên nào và được phát sinh từ tab nào.

## 2. Thiết kế Event và xử lý dữ liệu

### 2.1. Cấu trúc Event

Mỗi event được tạo khi trạng thái của bài báo thay đổi và chứa các thông tin chính:

```json
{
  "eventType": "PAGE_ENTER",
  "url": "https://...",
  "title": "...",
  "timestamp": "...",
  "sessionId": "...",
  "tabId": "..."
}
```

`sessionId` dùng để xác định phiên truy cập, `tabId` xác định tab phát sinh event và `timestamp` xác định thời điểm event xảy ra.

### 2.2. Các loại Event

Hệ thống sử dụng bốn loại event chính:

- `PAGE_ENTER`: bắt đầu truy cập bài báo.
- `PAGE_ACTIVE`: bài báo đang ở trạng thái active.
- `PAGE_INACTIVE`: bài báo không còn active.
- `PAGE_LEAVE`: kết thúc lần truy cập bài báo.

Các event tạo thành timeline giúp Backend có thể theo dõi toàn bộ quá trình người dùng đọc bài báo.

### 2.3. Lý do sử dụng Event Tracking

Thay vì chỉ lưu một bản ghi tổng hợp khi người dùng kết thúc đọc, hệ thống lưu lại từng event trong quá trình sử dụng.

Cách này giúp:

- Theo dõi được timeline đọc bài báo.
- Tính toán lại thời gian đọc khi cần.
- Phân tích hành vi chuyển đổi giữa các tab.
- Có thể mở rộng thêm các loại thống kê trong tương lai.

### 2.4. Xử lý Duplicate Event

Extension có thể phát sinh cùng một event nhiều lần do các sự kiện của trình duyệt hoặc quá trình gửi dữ liệu.

Hệ thống sử dụng các thông tin định danh và trạng thái của lần truy cập để kiểm tra và hạn chế việc ghi nhận event trùng.

### 2.5. Xử lý mất kết nối

Khi Extension không thể gửi dữ liệu lên Backend do mất kết nối, dữ liệu được giữ lại phía Extension và có thể gửi lại khi kết nối được khôi phục.

Cách này giúp hạn chế mất dữ liệu khi mạng không ổn định.
