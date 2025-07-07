import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { WordProvider } from './contexts/WordContext';
import HomePage from './pages/HomePage';
import WordList from './pages/WordList';
import WordDetail from './pages/WordDetail';
import QuizView from './components/QuizView';
import ProgressView from './components/ProgressView';
import { Navbar, Container, Nav, Offcanvas } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <WordProvider>
        <Navbar bg="light" expand="lg">
          <Container fluid>
            <Navbar.Brand as={Link} to="/">日语词汇学习工具</Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar" />
            <Navbar.Offcanvas
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="offcanvasNavbarLabel">导航</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link as={Link} to="/list">词汇列表</Nav.Link>
                  <Nav.Link as={Link} to="/quiz">开始复习</Nav.Link>
                  <Nav.Link as={Link} to="/progress">我的进度</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>

        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/list" element={<WordList />} />
            <Route path="/detail/:word" element={<WordDetail />} />
            <Route path="/quiz" element={<QuizView />} />
            <Route path="/progress" element={<ProgressView />} />
          </Routes>
        </div>
      </WordProvider>
    </Router>
  );
}

export default App;