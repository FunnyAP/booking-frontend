import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    fullName: '',
    phone: '',
    email: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setUserData({
          fullName: data.user.fullName,
          phone: data.user.phone,
          email: data.user.email,
          avatar: data.user.avatar || '/default-avatar.png'
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleAvatarClick = () => fileInputRef.current.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setAvatarLoading(true);
      const formData = new FormData();
      formData.append('avatar', file);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/auth/upload-avatar', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      setUserData(prev => ({ ...prev, avatar: data.avatarUrl }));
      window.dispatchEvent(new Event('avatar-updated'));
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setAvatarLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center py-10">
          <div className="loader border-4 border-pink-500 border-t-transparent w-10 h-10 rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Thông tin tài khoản</title>
        <meta name="description" content="Trang thông tin cá nhân" />
      </Head>

      <Header />

      <div className="max-w-7xl mx-auto px-4 py-10 flex gap-10">
        {/* Sidebar */}
        <aside className="w-64 border-r pr-6">
          <h2 className="text-xl font-bold mb-6">Thông tin tài khoản</h2>
          <ul className="space-y-3">
            <li className="text-pink-600 font-semibold">Thông tin cá nhân</li>
            <li className="hover:text-pink-500 cursor-pointer">Lịch sử mua vé</li>
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>

          <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
            <div className="flex items-center gap-4 mb-6 relative">
              <img
                src={userData.avatar}
                alt="avatar"
                className="w-28 h-28 rounded-full cursor-pointer object-cover"
                onClick={handleAvatarClick}
              />
              <button
                onClick={handleAvatarClick}
                disabled={avatarLoading}
                className="absolute bottom-0 left-24 bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-full"
              >
                {avatarLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182L7.5 20.213 3 21l.787-4.5L16.862 4.487z" />
                  </svg>
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={userData.fullName}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Họ tên"
              />
              <input
                type="text"
                value={userData.phone}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Số điện thoại"
              />
              <input
                type="email"
                value={userData.email}
                disabled
                className="w-full px-4 py-2 bg-gray-100 border rounded-md"
                placeholder="Email"
              />
              <button className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-md">
                LƯU THÔNG TIN
              </button>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}