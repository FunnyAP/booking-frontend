export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Chăm Sóc Khách Hàng */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Chăm Sóc Khách Hàng</h2>
            <p>Địa chỉ: Tầng 3, Vianova Tower, 42 Tôn Thất Tùng, Quận 1, TP.HCM</p>
            <p>Số điện thoại: 1900 123 456</p>
            <p>Email: support@hcinema.vn</p>
          </div>

          {/* Mua Vé và Xem Phim */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Mua Vé và Xem Phim</h2>
            <ul className="space-y-1">
              <li><a href="/movies" className="hover:underline">Lịch Chiếu Phim</a></li>
              <li><a href="/movies" className="hover:underline">Phim Chiếu Rạp</a></li>
              <li><a href="/reviews" className="hover:underline">Review Phim</a></li>
              <li><a href="/blog" className="hover:underline">Blog Phim</a></li>
            </ul>
          </div>

          {/* Kết Nối Với Chúng Tôi */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Kết Nối Với Chúng Tôi</h2>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:underline">YouTube</a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
