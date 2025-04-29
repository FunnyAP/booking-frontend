import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

const articles = [
  {
    title: "Top 5 bộ phim không thể bỏ lỡ năm 2025",
    image: "/uploads/blog1.jpg",
    excerpt: "Cùng điểm qua những bộ phim hot nhất đầu năm nay khiến khán giả đứng ngồi không yên.",
    link: "/blog/top-phim-2025"
  },
  {
    title: "Review phim 'Tìm Xác' - Gây cấn đến phút cuối",
    image: "/uploads/blog2.jpg",
    excerpt: "Bộ phim kinh dị Việt đầu tiên của đạo diễn Bùi Văn Hải gây ấn tượng mạnh với khán giả.",
    link: "/blog/review-tim-xac"
  },
  {
    title: "Lý do nên xem phim tại HCinema thay vì ở nhà",
    image: "/uploads/blog3.jpg",
    excerpt: "Không gian, âm thanh, trải nghiệm đặt vé tiện lợi – tất cả tạo nên sự khác biệt tại HCinema.",
    link: "/blog/ly-do-xem-tai-rap"
  }
];

export default function Blog() {
  return (
    <>
      <Head>
        <title>Blog - HCinema</title>
      </Head>

      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12 text-white">
        <h1 className="text-4xl font-bold text-center mb-10 uppercase">BLOG PHIM & REVIEW</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div key={index} className="bg-gray-900 rounded-lg overflow-hidden shadow-md">
              <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="text-gray-400 mb-4">{article.excerpt}</p>
                <a
                  href={article.link}
                  className="inline-block text-sm text-pink-500 hover:underline font-semibold"
                >
                  Đọc thêm &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
