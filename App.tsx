
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, GraduationCap, 
  ClipboardList, CreditCard, Menu, X, Languages
} from 'lucide-react';

import Dashboard from './views/Dashboard';
import Tutores from './views/Tutores';
import Cursos from './views/Cursos';
import Estudiantes from './views/Estudiantes';
import Matriculas from './views/Matriculas';
import Pagos from './views/Pagos';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Tutores', path: '/tutores', icon: <Users className="w-5 h-5" /> },
    { name: 'Cursos', path: '/cursos', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Estudiantes', path: '/estudiantes', icon: <GraduationCap className="w-5 h-5" /> },
    { name: 'Matrículas', path: '/matriculas', icon: <ClipboardList className="w-5 h-5" /> },
    { name: 'Pagos', path: '/pagos', icon: <CreditCard className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                <Languages className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Linguistika
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tutores" element={<Tutores />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/estudiantes" element={<Estudiantes />} />
            <Route path="/matriculas" element={<Matriculas />} />
            <Route path="/pagos" element={<Pagos />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Linguistika Academy. Todos los derechos reservados.
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
