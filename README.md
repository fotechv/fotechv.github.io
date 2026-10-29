# FOTECHV — Giải pháp công nghệ

Website giới thiệu năng lực FOTECHV bằng HTML/CSS/JavaScript. Trang chủ tập trung vào giải pháp, chuyên môn, lĩnh vực và quy trình hợp tác; danh sách sản phẩm nằm tại `/projects/`, truy cập từ menu con Sản phẩm. Các bài giới thiệu dự án được tạo từ Markdown. Build bằng Node.js, không cần cài dependency.

## Xem trên máy

Yêu cầu Node.js 22 trở lên.

```sh
npm run dev
```

Mở http://127.0.0.1:4173. Sau khi sửa nội dung, khởi động lại lệnh để build lại.

```sh
npm run build
npm run check
```

Thư mục `dist/` là website hoàn chỉnh để xuất bản. Chỉ xuất bản thư mục này, không xuất bản tài liệu kế hoạch nội bộ.

## Cập nhật nội dung

- `content/projects/*.md`: nội dung bài viết; hỗ trợ đoạn văn, heading, chữ đậm, inline code và bảng.
- `scripts/build.mjs`: nội dung trang chủ, tóm tắt dự án và template HTML.
- `site.config.json`: thương hiệu, URL, hồ sơ GitHub và email liên hệ. Email trống thì hiển thị liên kết GitHub; điền email thật để nút liên hệ chuyển sang email.
- `assets/style.css`: giao diện responsive, font, màu sắc.

Các hình trong website là minh họa khái niệm bằng CSS, không phải ảnh chụp ứng dụng. Font tải từ Google Fonts, có font dự phòng khi offline.

## GitHub Pages

Repository: https://github.com/fotechv/fotechv.github.io

1. Trong **Settings → Pages → Build and deployment**, chọn **Source: GitHub Actions**.
2. Đẩy thay đổi lên nhánh `main`. Workflow `.github/workflows/pages.yml` build, kiểm tra liên kết và deploy `dist/`.
3. Xem kết quả trong tab **Actions**. Khi deploy thành công, địa chỉ dự kiến là https://fotechv.github.io/.

Workflow cũng hỗ trợ chạy thủ công bằng **Run workflow**. Tài liệu: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

Website này cấu hình cho user site `fotechv.github.io`. Nếu chuyển sang project site có đường dẫn con, cần cập nhật URL canonical và đường dẫn trang 404.
