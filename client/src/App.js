// App.js
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './components/layout/Header';
import StudentListPage from './pages/StudentListPage';
import StudentProfilePage from './pages/StudentProfilePage';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<StudentListPage />} />
          <Route path="/student/:id" element={<StudentProfilePage />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;