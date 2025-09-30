/**
 * Bank Dashboard - Main Application Layout
 * Simple dashboard that routes to different features
 */

import React, { useState } from 'react';
import CustomersPage from '../features/customers/ui/CustomersPage';
import AccountsPage from '../features/accounts/ui/AccountsPage';
import MovementsPage from '../features/movements/ui/MovementsPage';
import ReportPage from '../features/reports/ui/ReportPage';

const BankDashboard = () => {
  const [activeModule, setActiveModule] = useState('customers');

  const modules = [
    { id: 'customers', name: 'Clientes', icon: '👥' },
    { id: 'accounts', name: 'Cuentas', icon: '💳' },
    { id: 'movements', name: 'Movimientos', icon: '💸' },
    { id: 'reports', name: 'Reportes', icon: '📊' },
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'customers':
        return <CustomersPage />;
      case 'accounts':
        return <AccountsPage />;
      case 'movements':
        return <MovementsPage />;
      case 'reports':
        return <ReportPage />;
      default:
        return <CustomersPage />;
    }
  };

  return (
    <div className="bank-dashboard">
      {/* Navigation Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <h1>🏦 Portal Cliente</h1>
            <span className="subtitle">En confianza</span>
          </div>
          <nav className="nav-modules">
            {modules.map(module => (
              <button
                key={module.id}
                className={`nav-button ${activeModule === module.id ? 'active' : ''}`}
                onClick={() => setActiveModule(module.id)}
              >
                <span className="nav-icon">{module.icon}</span>
                <span className="nav-text">{module.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {renderActiveModule()}
      </main>

      <style>{`
        .bank-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .dashboard-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .logo h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.8rem;
        }

        .subtitle {
          font-size: 0.8rem;
          color: #6c757d;
          font-weight: normal;
        }

        .nav-modules {
          display: flex;
          gap: 0.5rem;
        }

        .nav-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #6c757d;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }

        .nav-button:hover {
          background: rgba(0, 123, 255, 0.1);
          color: #007bff;
          transform: translateY(-2px);
        }

        .nav-button.active {
          background: #007bff;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
        }

        .nav-icon {
          font-size: 1.2rem;
        }

        .dashboard-main {
          min-height: calc(100vh - 80px);
        }

        .module-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          background: white;
          margin: 2rem;
          border-radius: 12px;
          font-size: 1.5rem;
          color: #6c757d;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .dashboard-header {
            padding: 1rem;
          }
          
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }
          
          .nav-modules {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .nav-button {
            flex-direction: column;
            gap: 0.25rem;
            padding: 0.5rem;
            min-width: 80px;
          }
          
          .nav-text {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BankDashboard;