import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ProfilePage() {
  const [userData, setUserData] = useState({ fullName: '', phone: '', email: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState('profile'); // tab control
  const [bookings, setBookings] = useState([]); // lịch sử đặt vé
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setUserData({
          fullName: data.user.name,
          phone: data.user.phone || '',
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

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/bookings/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setBookings(data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

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

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/update-profile', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userData.fullName, phone: userData.phone })
      });
      const result = await response.json();
      if (response.ok) alert("✅ Cập nhật thành công!");
      else alert("❌ Lỗi: " + result.message);
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      alert("❌ Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    if (tab === 'history') fetchBookings();
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

      <div className="max-w-7xl mx-auto px-4 py-10 flex gap-10 pt-[120px]">
        {/* Sidebar */}
        <aside className="w-64 border-r pr-6">
          <h2 className="text-xl font-bold mb-6">Thông tin tài khoản</h2>
          <ul className="space-y-3">
            <li
              className={`cursor-pointer ${selectedTab === 'profile' ? 'font-bold text-black' : ''}`}
              onClick={() => handleTabChange('profile')}
            >Thông tin cá nhân</li>
            <li
              className={`cursor-pointer ${selectedTab === 'history' ? 'font-bold text-black' : ''}`}
              onClick={() => handleTabChange('history')}
            >Lịch sử mua vé</li>
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {selectedTab === 'profile' ? (
            <>
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
                    className="absolute bottom-0 left-24 bg-black hover:bg-gray-800 text-white p-2 rounded-full"
                  >
                    {avatarLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182L7.5 20.213 3 21l.787-4.5L16.862 4.487z" /></svg>}
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                </div>

                <div className="space-y-4">
                  <input type="text" value={userData.fullName} onChange={(e) => setUserData(prev => ({ ...prev, fullName: e.target.value }))} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black" placeholder="Họ tên" />
                  <input type="text" value={userData.phone} onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black" placeholder="Số điện thoại" />
                  <input type="email" value={userData.email} disabled className="w-full px-4 py-2 bg-black border rounded-md text-white" placeholder="Email" />
                  <button onClick={handleSaveProfile} disabled={saving} className="mt-4 w-full bg-black hover:bg-gray-900 text-white font-semibold py-2 rounded-md">
                    {saving ? 'ĐANG LƯU...' : 'LƯU THÔNG TIN'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-6">Lịch sử đặt vé</h1>
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <p>Chưa có vé nào được đặt.</p>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="bg-[#1a1a1a] p-4 rounded-lg shadow-md text-white">
                      <div className="flex justify-between">
                        <div>
                          <h2 className="text-lg font-semibold">{booking.movie_title}</h2>
                          <p>Rạp: {booking.cinema_name}</p>
                          <p>Ngày chiếu: {booking.show_date}</p>
                          <p>Suất chiếu: {booking.show_time}</p>
                          <p>Ghế: {booking.seats.join(', ')}</p>
                        </div>
                        <div className="text-right">
                        <p className="font-semibold">{Math.round(booking.total_price).toLocaleString('vi-VN')} VNĐ</p>
                          <p className={`text-sm font-bold ${
                                booking.status === 'pending' ? 'text-yellow-400' :
                                booking.status === 'completed' ? 'text-green-400' :
                                booking.status === 'cancelled' ? 'text-red-400' : 'text-gray-400'
                              }`}>
                            {booking.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
