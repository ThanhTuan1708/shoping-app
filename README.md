# Northstar Market

Ứng dụng cửa hàng mẫu viết bằng React, TypeScript, Redux Toolkit và Vite. Sản
phẩm được tải bất đồng bộ từ [Fake Store API](https://fakestoreapi.com/products).

## Chạy ứng dụng

```sh
npm install
npm run dev
```

## Kiểm tra

```sh
npm run lint
npm run build
```

## Tính năng

- Tải danh sách sản phẩm với trạng thái đang tải, lỗi và thử lại.
- Tìm kiếm theo tên/mô tả và lọc theo danh mục.
- Thêm sản phẩm, tăng/giảm số lượng, xóa từng món hoặc làm trống giỏ hàng.
- Khôi phục giỏ hàng từ localStorage và báo lỗi nếu dữ liệu không thể đọc/lưu.
- Áp dụng mã `SUMMER10` (10%) hoặc `SPECIAL20` (20%).
- Chọn phí giao hàng, tính tạm tính, giảm giá, thuế 10% và tổng thanh toán.

Thanh toán chưa kết nối cổng thanh toán; nút thanh toán hiển thị thông báo thay
vì tạo giao dịch thật.
