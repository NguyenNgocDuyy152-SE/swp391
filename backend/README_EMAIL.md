# Hướng dẫn cấu hình Email để gửi thông báo tự động

Sau khi thêm tính năng gửi email tự động khi có người đặt lịch tư vấn, bạn cần cấu hình các thông số email trong file `.env` để kích hoạt chức năng này.

## Tạo file .env

Nếu chưa có file `.env` trong thư mục backend, hãy tạo file này với nội dung sau:

```
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=swp391

# JWT Configuration
SECRET_KEY=your-secret-key-replace-this-in-production

# Email Configuration
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=Gender Healthcare <your-email@gmail.com>
```

## Cấu hình cho Gmail

Nếu bạn sử dụng Gmail, bạn cần làm theo các bước sau:

1. **Bật xác thực 2 yếu tố** cho tài khoản Gmail của bạn:
   - Truy cập [Google Account Security](https://myaccount.google.com/security)
   - Bật "2-Step Verification" (Xác thực 2 bước)

2. **Tạo App Password (Mật khẩu ứng dụng)**:
   - Truy cập [App Passwords](https://myaccount.google.com/apppasswords)
   - Chọn "App" là "Mail" và "Device" là "Other" (đặt tên như "Gender Healthcare")
   - Nhấn "Generate" và sao chép mật khẩu được tạo

3. **Cập nhật file .env**:
   - Thay `your-email@gmail.com` bằng địa chỉ Gmail của bạn
   - Thay `your-app-password` bằng mật khẩu ứng dụng đã tạo ở bước 2

## Cài đặt Flask-Mail

Đảm bảo bạn đã cài đặt thư viện Flask-Mail:

```
pip install Flask-Mail==0.9.1
```

hoặc 

```
pip install -r requirements.txt
```

## Kiểm tra

Sau khi cấu hình xong:

1. Khởi động lại server backend:
   ```
   python app.py
   ```

2. Thử tạo một lịch hẹn tư vấn mới từ giao diện frontend
   - Điền đầy đủ thông tin bao gồm địa chỉ email hợp lệ
   - Gửi form đặt lịch
   - Kiểm tra email xem đã nhận được email xác nhận chưa

## Xử lý sự cố

Nếu email không được gửi:

1. Kiểm tra logs của backend xem có lỗi nào liên quan đến việc gửi email không
2. Đảm bảo mật khẩu ứng dụng đã được cấu hình đúng
3. Kiểm tra cài đặt bảo mật của Gmail, có thể bạn cần cho phép "Less secure app access"
4. Thử sử dụng một tài khoản email khác để kiểm tra 