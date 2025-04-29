export default function Footer() {
  return (
    <footer className="bg-gray-50 text-black py-10">
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
              <li><a href="/movies/playing" className="hover:underline">Phim Đang Chiếu</a></li>
              <li><a href="/movies/coming-soon" className="hover:underline">Phim Sắp Chiếu</a></li>
              <li><a href="/blog" className="hover:underline">Blog Phim</a></li>
            </ul>
          </div>

          {/* Các Cụm Rạp */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Các Cụm Rạp</h2>
            <ul className="space-y-1">
              <li>LTPN-Cinema Quốc Thanh - TP.HCM</li>
              <li>LTPN-Cinema Hai Bà Trưng - TP.HCM</li>
              <li>LTPN-Cinema Lotte - Hà Nội</li>
              <li>LTPN-Cinema Nguyễn Trãi - Hà Nội</li>
              <li>LTPN-Cineplex - Hà Nội</li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
