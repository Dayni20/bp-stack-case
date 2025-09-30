/**
 * Report Page Component
 * Allows generation and viewing of customer reports
 */

import React, { useState, useEffect } from 'react';
import { fetchReport } from '../api/reportAdapter';
import { Report } from '../model/reportTypes';
import { useAccounts } from '../../accounts/ui/accountHooks';

const ReportPage = () => {
  const [customerId, setCustomerId] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { accounts, loadAccounts } = useAccounts();
  
  useEffect(() => {
    loadAccounts();
  }, []);
  
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCustomerChange = (e) => {
    setCustomerId(e.target.value);
  };
  
  const generateReport = async () => {
    if (!customerId || !dateRange.startDate || !dateRange.endDate) {
      setError('Por favor, complete todos los campos requeridos');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchReport(customerId, dateRange.startDate, dateRange.endDate);
      
      if (result.success) {
        setReport(new Report({
          id: Date.now().toString(),
          customerId,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          data: result.data
        }));
      } else {
        setError(result.error || 'Error al generar el reporte');
      }
    } catch (err) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="report-page">
      <div className="page-header">
        <h1>📊 Reportes</h1>
        <p>Genera reportes de actividad financiera</p>
      </div>
      
      <div className="report-form-container">
        <div className="form-group">
          <label htmlFor="customer">Cliente:</label>
          <select 
            id="customer"
            value={customerId}
            onChange={handleCustomerChange}
            disabled={loading}
          >
            <option value="">Selecciona un cliente</option>
            {accounts.map(account => (
              <option 
                key={account.id} 
                value={account.customerId}
              >
                {account.customerName} - {account.customerIdentification}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="startDate">Fecha de inicio:</label>
          <input 
            type="date"
            id="startDate"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="endDate">Fecha de fin:</label>
          <input 
            type="date"
            id="endDate"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
            disabled={loading}
          />
        </div>
        
        <button 
          className="btn btn-primary" 
          onClick={generateReport}
          disabled={loading}
        >
          {loading ? 'Generando...' : 'Generar Reporte'}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}
      
      {report && (
        <div className="report-result">
          <h2>Reporte generado</h2>
          <p>
            <strong>Cliente ID:</strong> {report.customerId}<br />
            <strong>Período:</strong> {report.formatData().startDate} - {report.formatData().endDate}
          </p>
          
          <pre className="json-result">
            {JSON.stringify(report.data, null, 2)}
          </pre>
        </div>
      )}
      
      <style jsx="true">{`
        .report-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .page-header {
          margin-bottom: 2rem;
        }
        
        .page-header h1 {
          margin: 0;
          color: #2c3e50;
        }
        
        .page-header p {
          margin: 0.5rem 0 0;
          color: #6c757d;
        }
        
        .report-form-container {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          align-items: end;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-group label {
          font-weight: 500;
          color: #343a40;
        }
        
        .form-group select,
        .form-group input {
          padding: 0.75rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .btn {
          grid-column: span 2;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-primary {
          background: #007bff;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #0069d9;
        }
        
        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .error-message {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 2rem;
        }
        
        .report-result {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 0 15px rgba(0,0,0,0.05);
        }
        
        .report-result h2 {
          margin-top: 0;
          color: #2c3e50;
        }
        
        .json-result {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 4px;
          overflow: auto;
          max-height: 400px;
          white-space: pre-wrap;
          font-family: monospace;
        }
        
        @media (max-width: 768px) {
          .report-form-container {
            grid-template-columns: 1fr;
          }
          
          .btn {
            grid-column: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportPage;