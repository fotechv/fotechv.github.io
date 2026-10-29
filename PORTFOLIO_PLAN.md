# Kế hoạch portfolio giới thiệu dự án

Cập nhật: 2026-09-17.

## Phạm vi

Viết bài giới thiệu chức năng và công nghệ từ tài liệu, mã nguồn và cấu hình dự án. Theo yêu cầu của chủ dự án, không chạy ứng dụng, kiểm thử sản phẩm, quay demo hoặc chụp ảnh. Demo không phải điều kiện để viết bài hay xây website.

## Nội dung phiên bản đầu

- [English Platform SaaS](content/projects/english-platform.md): quản lý trung tâm, ứng dụng học tập và dịch vụ lớp trực tuyến.
- [Auto Video Platform](content/projects/auto-video-platform.md): xử lý video, phụ đề, dịch, tổng hợp giọng nói và điều phối tác vụ.
- [TablePro](content/projects/tablepro.md): công cụ cơ sở dữ liệu, SQL, data grid, kiến trúc plugin và UI Kit.

Center Admin và Learning App thuộc cùng English Platform. UI Kit được giới thiệu trong bài TablePro. Oxy Mobile API / Polling Service đang chờ xác định vị trí repository và thông tin nghiệp vụ, chưa suy đoán chức năng để viết bài.

## Nguyên tắc biên soạn

Viết tiếng Việt, trình bày chức năng rồi giải thích vai trò của công nghệ. Không tự thêm giá bán, khách hàng, số liệu hiệu suất hoặc cam kết đã vận hành thực tế. Các bài giới thiệu theo tài liệu và cấu hình, không phải báo cáo kiểm thử. Không đưa thông tin tài khoản hoặc cấu hình nhạy cảm vào bài.

## Các bước tiếp theo

1. Dùng ba bài làm trang chi tiết và nội dung tóm tắt trên trang chủ.
2. Thiết kế trang chủ, danh sách dự án, chi tiết và liên hệ.
3. Xây website tĩnh tương thích GitHub Pages, tách nội dung khỏi giao diện.
4. Bổ sung tên cá nhân/thương hiệu, kênh liên hệ công khai và repository xuất bản.
5. Kiểm tra website và liên kết trước khi xuất bản; không chạy thử các sản phẩm được giới thiệu.

## Website phiên bản đầu

Đã xây dựng trang chủ, bộ lọc dự án, ba trang bài viết, mục lục, phần liên hệ GitHub và trang 404. Nội dung Markdown được build thành HTML tĩnh bằng Node.js; không cần cài dependency. Có cấu hình triển khai GitHub Actions trong `.github/workflows/pages.yml`.

Thương hiệu tạm dùng FOTECHV theo repository hiện có. Có thể bổ sung email và đổi tên trong `site.config.json`. Hướng dẫn chạy và xuất bản nằm trong `README.md`.

Đã kiểm tra build, 5 trang HTML, 81 liên kết/tài nguyên/anchor nội bộ; kiểm tra trình duyệt cho bộ lọc, điều hướng bài viết, mục lục và bố cục mobile. Không chạy thử các sản phẩm được giới thiệu.

## Nguồn nội bộ

- English Platform: `D:/MyProjects/English_Platform/README.md`, `AGENTS.md`, `package.json`.
- Auto Video Platform: `D:/MyProjects/AI_Video_Platform/auto-video-platform/README.md`, `video-dashboard/package.json`, `video-orchestration/go.mod`.
- TablePro: `D:/MyProjects/table_pro/README.md`, `TablePro-Qt/CMakeLists.txt`, `TablePro-Ui-Kit/README.md`.

## Cập nhật 2026-10-29

Trang chủ chuyển sang giới thiệu năng lực theo thương hiệu FOTECHV, không dùng hồ sơ cá nhân. Nội dung gồm giải pháp, sáu nhóm chuyên môn, kinh nghiệm theo lĩnh vực, quy trình hợp tác và dẫn chứng sản phẩm. Chuyên môn được đối chiếu với CV do chủ website cung cấp và tài liệu dự án; không gán khách hàng của đơn vị từng công tác thành khách hàng FOTECHV. Danh sách sản phẩm chuyển sang /projects/, giữ nguyên URL bài chi tiết. Menu con dùng disclosure HTML, hỗ trợ bàn phím và Escape. Email liên hệ được cấu hình từ CV; CV không được sao chép vào website.
