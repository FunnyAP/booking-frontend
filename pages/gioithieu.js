import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function GioiThieu() {
  return (
    <>
      <Head>
        <title>Giới thiệu - HCinema</title>
      </Head>

      <Header />

      {/* Banner */}
      <div className="relative h-96 w-full pt-[100px]">
        <img
          src="/uploads/lienhe.png"
          alt="Banner Giới Thiệu"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold uppercase text-white text-center">
            Hệ Thống Cụm Rạp Trên Toàn Quốc
          </h1>
        </div>
      </div>

      {/* Giới thiệu */}
      <div className="max-w-4xl mx-auto px-4 py-10 text-center text-white">
        <p className="text-lg leading-relaxed">
          HCinema là hệ thống rạp chiếu phim hiện đại, cung cấp nhiều mô hình giải trí hấp dẫn như chiếu phim, nhà hát, khu vui chơi trẻ em,
          bowling, nhà hàng... Với sứ mệnh phục vụ khán giả Việt bằng những trải nghiệm giải trí chất lượng cao, chúng tôi đang không ngừng phát triển.
        </p>
      </div>

      {/* Sứ mệnh */}
      <div className="bg-gradient-to-b from-black via-gray-900 to-black py-12">
        <h2 className="text-3xl font-bold text-center mb-8 uppercase text-white">Sứ Mệnh</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <h3 className="text-yellow-400 text-2xl font-bold mb-2">01</h3>
            <p>Góp phần tăng trưởng thị phần điện ảnh, văn hóa, giải trí của người Việt Nam</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <h3 className="text-yellow-400 text-2xl font-bold mb-2">02</h3>
            <p>Phát triển dịch vụ xuất sắc với mức giá tối ưu, phù hợp với thu nhập người Việt Nam</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <h3 className="text-yellow-400 text-2xl font-bold mb-2">03</h3>
            <p>Mang nghệ thuật điện ảnh, văn hóa Việt Nam hội nhập quốc tế</p>
          </div>
        </div>
      </div>

      {/* Danh sách chi nhánh */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-white">
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-bold uppercase mb-2">LTPN-Cinema Hà Nội</h3>
          <p className="mb-1">72 Nguyễn Trãi, Hà Nội</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-bold uppercase mb-2">LTPN-Cinema Lotte</h3>
          <p className="mb-1">Tầng 5, Lotte Center, Hà Nội</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-bold uppercase mb-2">LTPN-Cineplex</h3>
          <p className="mb-1">Vincom Phạm Ngọc Thạch, Hà Nội</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-bold uppercase mb-2">LTPN-Cinema Quốc Thanh - TP.HCM</h3>
          <p className="mb-1">Vincom Phạm Ngọc Thạch, Hà Nội</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-bold uppercase mb-2">LTPN-Cinema Hai Bà Trưng - TP.HCM</h3>
          <p className="mb-1">Vincom Phạm Ngọc Thạch, Hà Nội</p>
        </div>
      </div>

      <Footer />
    </>
  );
}
