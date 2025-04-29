const Banner = () => {
    return (
        <div className="max-w-6xl mx-auto px-2 sm:px-0 my-6 pt-[120px]"> {/* Thêm margin top & bottom */}
            <div className="relative w-full h-52 md:h-64 lg:h-72 rounded-lg overflow-hidden shadow-md"> {/* Giảm chiều cao banner */}
          {/* Placeholder - Thay bằng hình ảnh thực tế */}
          <img 
            src="/uploads/tim-xac_2_.jpg" // Hoặc URL hình ảnh từ API
            alt="Cinema Banner"
            className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-95"
          />
          
          {/* Có thể thêm overlay/text nếu cần */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <h2 className="text-white text-2xl md:text-3xl font-bold">Khám phá điện ảnh thế giới</h2>
          </div>     */}
        </div>
      </div>
    );
  };
  
  export default Banner;