import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TicketHistoryPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/bookings/my', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setBookings(data.bookings);
        } else {
          console.error('Error fetching bookings:', data.message);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center py-20">
          <div className="loader border-4 border-pink-500 border-t-transparent w-10 h-10 rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Lịch sử đặt vé</title>
      </Head>

      <Header />

      <div className="max-w-7xl mx-auto px-4 py-20 pt-[120px]">
        <h1 className="text-3xl font-bold mb-8">Lịch sử đặt vé</h1>

        {bookings.length === 0 ? (
          <p>Chưa có vé nào được đặt.</p>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
                <div key={booking.id} className="p-6 bg-white rounded-lg shadow-md text-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">🎬 {booking.movie_title}</h2>
                  <span
                        className={`text-sm px-3 py-1 rounded-full ${
                            booking.status === 'pending' ? 'bg-yellow-500 text-white' :
                            booking.status === 'completed' ? 'bg-green-500 text-white' :
                            booking.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
                        }`}
                        >
                        {booking.status}
                    </span>
                </div>
                <p><strong>Rạp:</strong> {booking.cinema_name}</p>
                <p><strong>Ngày chiếu:</strong> {booking.show_date}</p>
                <p><strong>Suất chiếu:</strong> {booking.show_time}</p>
                <p><strong>Ghế:</strong> {booking.seats.join(', ')}</p>
                <p><strong>Tổng tiền:</strong> {booking.total_price.toLocaleString()} VNĐ</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}