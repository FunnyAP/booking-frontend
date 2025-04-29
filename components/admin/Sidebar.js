import Link from 'next/link'
import { useRouter } from 'next/router'

const menu = [
  { label: 'Tổng quan', path: '/admin/dashboard' },
  { label: 'Danh sách phim', path: '/admin/movies' },
  { label: 'Rạp', path: '/admin/cinemas' },
  { label: 'Đơn hàng', path: '/admin/bookings' },
  { label: 'Suất chiếu', path: '/admin/showtimes' },
  { label: 'Ghế', path: '/admin/seats' },
  { label: 'Sản phẩm', path: '/admin/products' },
  { label: 'Thể loại', path: '/admin/categories' }
]

export default function Sidebar() {
  const router = useRouter()

  return (
    <aside className="bg-blue-900 text-white w-64 flex flex-col min-h-screen">
      <div className="p-6 text-2xl font-bold border-b border-blue-700">
        ADMIN
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item, idx) => (
          <Link key={idx} href={item.path}>
            <span
              className={`block px-4 py-2 rounded-md cursor-pointer transition ${
                router.pathname === item.path
                  ? 'bg-blue-700 font-semibold'
                  : 'hover:bg-blue-800'
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
