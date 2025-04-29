import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  ListItemIcon
} from "@mui/material";
import Link from "next/link";
import { useState, useEffect } from "react";
import GoogleIcon from '@mui/icons-material/Google';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Header() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenUserMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorEl(null);
  const handleGoogleLogin = () => {
    setOpenLogin(false);
    window.location.href = 'http://127.0.0.1:8000/api/auth/google/redirect';
  };
  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    handleCloseUserMenu();
    setSuccess('Đăng xuất thành công');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUserData(token);
  }, []);

  const fetchUserData = async (token) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Phiên đăng nhập đã hết hạn');
      const data = await response.json();
      setCurrentUser(data.user || data.User);
    } catch (error) {
      localStorage.removeItem('token');
      setCurrentUser(null);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) return setError('Mật khẩu không khớp');
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Đăng ký thất bại');
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập');
      setOpenRegister(false);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, '', window.location.pathname);
      fetchUserData(token);
      setSuccess('Đăng nhập thành công!');
      window.location.href = '/';
    }
  }, []);

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#000", color: "#fff", boxShadow: "none", borderBottom: "1px solid #333", zIndex: 1300 }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 100, px: 0 }}>
            <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', mr: 4 }}>
              <Link href="/" passHref>
                <img src="/uploads/logo.png" alt="HCinema Logo" style={{ height: 100, objectFit: "contain", cursor: "pointer" }} />
              </Link>
            </Box>
            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 4 }}>
              <Button component={Link} href="/movies/playing" sx={{ color: "#fff", textTransform: 'none', fontSize: '1rem', '&:hover': { textDecoration: 'underline' } }}>Phim Đang Chiếu</Button>
              <Button component={Link} href="/movies/coming-soon" sx={{ color: "#fff", textTransform: 'none', fontSize: '1rem', '&:hover': { textDecoration: 'underline' } }}>Phim Sắp Chiếu</Button>
              <Button component={Link} href="/gioithieu" sx={{ color: "#fff", textTransform: 'none', fontSize: '1rem', '&:hover': { textDecoration: 'underline' } }}>Giới Thiệu</Button>
              <Button component={Link} href="/blog" sx={{ color: "#fff", textTransform: 'none', fontSize: '1rem', '&:hover': { textDecoration: 'underline' } }}>Review Phim</Button>
            </Box>
            <Box sx={{ flex: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : currentUser ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0, '&:hover': { transform: 'scale(1.05)' } }}>
                    {currentUser.avatar ? (
                      <Avatar alt={currentUser.name} src={currentUser.avatar} sx={{ width: 40, height: 40 }} />
                    ) : (
                      <AccountCircle sx={{ fontSize: 40, color: '#fff' }} />
                    )}
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <MenuItem component={Link} href="/profile" onClick={() => setAnchorEl(null)}>
                      <ListItemIcon><PersonIcon /></ListItemIcon>Thông tin người dùng
                    </MenuItem>
                    <MenuItem component={Link} href="/ticket-history">
                      <ListItemIcon><HistoryIcon /></ListItemIcon>Lịch sử đặt vé
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon><LogoutIcon /></ListItemIcon>Đăng xuất
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" onClick={() => setOpenRegister(true)} sx={{ color: "#fff", borderColor: "#fff", fontWeight: "bold", px: 3, py: 1.2, minWidth: 120, whiteSpace: "nowrap" }}>Đăng Ký</Button>
                  <Button variant="outlined" onClick={() => setOpenLogin(true)} sx={{ color: "#fff", borderColor: "#fff", fontWeight: "bold", px: 3, py: 1.2, minWidth: 120, whiteSpace: "nowrap" }}>Đăng Nhập</Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Dialog open={openLogin} onClose={() => setOpenLogin(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: '#000' }}>ĐĂNG NHẬP</DialogTitle>
        <DialogContent>
          <TextField margin="normal" label="Email" fullWidth variant="outlined" name="email" onChange={handleInputChange} />
          <TextField margin="normal" label="Mật khẩu" type="password" fullWidth variant="outlined" name="password" onChange={handleInputChange} />
          <Box sx={{ textAlign: 'right', mt: 1 }}>
            <Button size="small" sx={{ color: '#555' }}>Quên mật khẩu?</Button>
          </Box>
          <Box sx={{ mt: 3, mb: 2 }}>
            <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={handleGoogleLogin} sx={{ borderColor: '#fff', color: '#000', py: 1.5, '&:hover': { backgroundColor: '#eee' } }}>Đăng nhập với Google</Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button variant="outlined" fullWidth size="large" sx={{ borderColor: "#000", color: '#000', '&:hover': { backgroundColor: '#eee' } }}>Đăng Nhập</Button>
        </DialogActions>
        <Divider sx={{ color: '#000' }}>Hoặc</Divider>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography sx={{ color: '#000' }}>Chưa có tài khoản? <Button onClick={() => { setOpenLogin(false); setOpenRegister(true); }} sx={{ color: '#000', fontWeight: 'bold' }}>Đăng ký ngay</Button></Typography>
        </Box>
      </Dialog>

      <Dialog open={openRegister} onClose={() => setOpenRegister(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: '#000' }}>ĐĂNG KÝ TÀI KHOẢN</DialogTitle>
        <DialogContent>
          <TextField margin="normal" label="Họ và tên" fullWidth variant="outlined" name="name" value={formData.name} onChange={handleInputChange} required />
          <TextField margin="normal" label="Email" type="email" fullWidth variant="outlined" name="email" value={formData.email} onChange={handleInputChange} required />
          <TextField margin="normal" label="Mật khẩu" type="password" fullWidth variant="outlined" name="password" value={formData.password} onChange={handleInputChange} required inputProps={{ minLength: 6 }} />
          <TextField margin="normal" label="Nhập lại mật khẩu" type="password" fullWidth variant="outlined" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <Button variant="outlined" fullWidth size="large" onClick={handleRegister} disabled={loading} sx={{ borderColor: '#000', color: '#000', '&:hover': { backgroundColor: '#eee' } }}>{loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng Ký'}</Button>
        </DialogActions>
        <Box sx={{ textAlign: 'center', pb: 3 }}>
          <Typography variant="body2" sx={{ color: '#000' }}>Đã có tài khoản? <Button onClick={() => { setOpenRegister(false); setOpenLogin(true); }} sx={{ color: '#000', fontWeight: 'bold' }}>Đăng nhập ngay</Button></Typography>
        </Box>
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </>
  );
}