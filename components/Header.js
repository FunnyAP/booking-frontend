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
  // State quản lý
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

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Phiên đăng nhập đã hết hạn');
      }
      
      const data = await response.json();
      setCurrentUser(data.user || data.User);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin user:', error);
      localStorage.removeItem('token');
      setCurrentUser(null);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    handleCloseUserMenu();
    setSuccess('Đăng xuất thành công');
  };

  const handleOpenUserMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorEl(null);

  const handleGoogleLogin = () => {
    handleCloseLogin();
    window.location.href = 'http://127.0.0.1:8000/api/auth/google/redirect';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }

      setSuccess('Đăng ký thành công! Vui lòng đăng nhập');
      setOpenRegister(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        try {
          localStorage.setItem('token', token);
          window.history.replaceState({}, '', window.location.pathname);
          await fetchUserData(token);
          setSuccess('Đăng nhập thành công!');
          window.location.href = '/';
        } catch (error) {
          setError('Đăng nhập thất bại: ' + error.message);
        }
      }
    };
  
    handleAuthCallback();
  }, []);

  return (
    <>
      <AppBar position="sticky" sx={{ 
        backgroundColor: "#fff", 
        boxShadow: "none",
        borderBottom: "1px solid #eee"
      }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ 
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center",
            height: 64,
            px: 0
          }}>
            {/* Phần 1 - Logo */}
            <Box sx={{ flex: 0 }}>
              <Link href="/" passHref>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#000",
                    fontWeight: 700,
                    cursor: "pointer",
                    '&:hover': { opacity: 0.8 }
                  }}
                >
                  HCinema
                </Typography>
              </Link>
            </Box>

            {/* Phần 2 - Navigation */}
            <Box sx={{ 
              flex: 1,
              display: "flex",
              justifyContent: "center",
              gap: 4,
              maxWidth: '600px'
            }}>
              <Button 
                component={Link}
                href="/movies"
                sx={{
                  color: "#000",
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Phim Chiếu
              </Button>

              <Button 
                component={Link}
                href="/reviews"
                sx={{
                  color: "#000",
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Review Phim
              </Button>

              <Button 
                component={Link}
                href="/blog"
                sx={{
                  color: "#000",
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Blog Phim
              </Button>
            </Box>

            {/* Phần 3 - Auth Section */}
            <Box sx={{ 
              flex: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              ml: 'auto'
            }}>
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : currentUser ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton 
                    onClick={handleOpenUserMenu}
                    sx={{ 
                      p: 0,
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                  >
                    {currentUser.avatar ? (
                      <Avatar 
                        alt={currentUser.name} 
                        src={currentUser.avatar} 
                        sx={{ width: 40, height: 40 }}
                      />
                    ) : (
                      <AccountCircle sx={{ fontSize: 40, color: '#000' }} />
                    )}
                  </IconButton>
                  
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        borderRadius: '8px'
                      }
                    }}
                  >
                    <MenuItem component={Link} 
                        href="/profile"
                        onClick={handleCloseUserMenu}>
                      <ListItemIcon><PersonIcon /></ListItemIcon>
                      Thông tin người dùng
                    </MenuItem>
                    <MenuItem component={Link} href="/ticket-history">
                      <ListItemIcon><HistoryIcon /></ListItemIcon>
                      Lịch sử đặt vé
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon><LogoutIcon /></ListItemIcon>
                      Đăng xuất
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setOpenRegister(true)}
                    sx={{
                      color: "#000",
                      borderColor: "#000",
                      borderRadius: '8px',
                      px: 3,
                      py: 1,
                      minWidth: '100px',
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      '&:hover': { 
                        backgroundColor: '#f5f5f5',
                        borderColor: '#666'
                      }
                    }}
                  >
                    Đăng Ký
                  </Button>
                  
                  <Button 
                    variant="contained" 
                    onClick={() => setOpenLogin(true)}
                    sx={{
                      backgroundColor: "#E91E63",
                      color: "#fff",
                      borderRadius: '8px',
                      px: 3,
                      py: 1,
                      minWidth: '100px',
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      boxShadow: 'none',
                      '&:hover': { 
                        backgroundColor: '#C2185B',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    Đăng Nhập
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Popup Đăng Nhập */}
      <Dialog open={openLogin} onClose={() => setOpenLogin(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>ĐĂNG NHẬP</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Email"
            fullWidth
            variant="outlined"
            name="email"
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            label="Mật khẩu"
            type="password"
            fullWidth
            variant="outlined"
            name="password"
            onChange={handleInputChange}
          />
          <Box sx={{ textAlign: 'right', mt: 1 }}>
            <Button size="small">Quên mật khẩu?</Button>
          </Box>

          <Box sx={{ mt: 3, mb: 2 }}>
            <Button 
              fullWidth
              variant="contained" 
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{ 
                backgroundColor: '#4285F4',
                color: 'white',
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#357ABD'
                }
              }}
            >
              Đăng nhập với Google
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            variant="contained" 
            fullWidth
            size="large"
            sx={{ 
              backgroundColor: "#E91E63",
              '&:hover': {
                backgroundColor: '#C2185B'
              }
            }}
          >
            Đăng Nhập
          </Button>
        </DialogActions>
        <Divider>Hoặc</Divider>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography>
            Chưa có tài khoản? <Button onClick={() => { setOpenLogin(false); setOpenRegister(true); }}>Đăng ký ngay</Button>
          </Typography>
        </Box>
      </Dialog>

      {/* Popup Đăng Ký */}
      <Dialog open={openRegister} onClose={() => setOpenRegister(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: '#E91E63' }}>
          ĐĂNG KÝ TÀI KHOẢN
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Họ và tên"
            fullWidth
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="normal"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="normal"
            label="Mật khẩu"
            type="password"
            fullWidth
            variant="outlined"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            inputProps={{ minLength: 6 }}
          />
          <TextField
            margin="normal"
            label="Nhập lại mật khẩu"
            type="password"
            fullWidth
            variant="outlined"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <Button 
            variant="contained" 
            fullWidth
            size="large"
            onClick={handleRegister}
            disabled={loading}
            sx={{ 
              backgroundColor: "#E91E63",
              color: 'white',
              '&:hover': {
                backgroundColor: '#C2185B'
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng Ký'}
          </Button>
        </DialogActions>
        <Box sx={{ textAlign: 'center', pb: 3 }}>
          <Typography variant="body2">
            Đã có tài khoản? <Button 
              onClick={() => { setOpenRegister(false); setOpenLogin(true); }}
              sx={{ color: '#E91E63', fontWeight: 'bold' }}
            >
              Đăng nhập ngay
            </Button>
          </Typography>
        </Box>
      </Dialog>

      {/* Thông báo */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </>
  );
}