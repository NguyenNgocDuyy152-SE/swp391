# Hướng dẫn sử dụng hệ thống Admin

## Giới thiệu

Hệ thống admin được xây dựng với mã hóa mật khẩu bằng Argon2id - thuật toán bảo mật cao, và xác thực JWT. Hệ thống hỗ trợ phân quyền với hai loại tài khoản:
- `super_admin`: Có quyền cao nhất, có thể quản lý các admin khác
- `admin`: Có quyền quản lý người dùng và nội dung hệ thống

## Cài đặt

1. Đảm bảo đã cài đặt các dependencies cần thiết:
```bash
pip install -r requirements.txt
```

2. Tạo tài khoản root admin đầu tiên:
```bash
python create_admin.py
```

## API Endpoints

### Xác thực

- `POST /api/admin/login`: Đăng nhập admin
  ```json
  {
    "username": "root_admin",
    "password": "your_password"
  }
  ```

- `POST /api/admin/change-password`: Thay đổi mật khẩu (yêu cầu đăng nhập)
  ```json
  {
    "current_password": "old_password",
    "new_password": "new_password"
  }
  ```

### Quản lý Admin (Chỉ Super Admin)

- `GET /api/admin/admins`: Lấy danh sách admin
- `POST /api/admin/admins`: Thêm admin mới
  ```json
  {
    "username": "new_admin",
    "password": "admin_password",
    "role": "admin"
  }
  ```
- `DELETE /api/admin/admins/{admin_id}`: Xóa admin

### Quản lý Người dùng

- `GET /api/admin/users`: Lấy danh sách người dùng
- `GET /api/admin/profile`: Lấy thông tin admin hiện tại

## Xác thực API

Sau khi đăng nhập, bạn sẽ nhận được token JWT. Sử dụng token này trong header của các request tiếp theo:

```
Authorization: Bearer <your_token>
```

## Bảo mật

- Mật khẩu được mã hóa bằng Argon2id
- JWT token hết hạn sau 24 giờ
- Hệ thống phân quyền chặt chẽ giữa admin và super_admin
- Chống brute-force với các tham số bảo mật cao cho Argon2id

## Sử dụng từ dòng lệnh

### Tạo admin

```bash
python create_admin.py
```

Khi chạy, script sẽ:
1. Tạo bảng `admins` nếu chưa tồn tại
2. Yêu cầu nhập username và mật khẩu
3. Mã hóa mật khẩu với Argon2id
4. Tạo tài khoản admin với quyền super_admin

### Ví dụ về gọi API

```bash
# Đăng nhập
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"root_admin","password":"your_password"}'

# Lấy danh sách người dùng (với token)
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer <your_token>"
``` 