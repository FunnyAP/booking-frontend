import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { token } = router.query;
    if (token) {
      localStorage.setItem('token', token);
      router.push('/'); // Về trang chủ
    }
  }, [router]);

  return <div>Đang xử lý đăng nhập...</div>;
}