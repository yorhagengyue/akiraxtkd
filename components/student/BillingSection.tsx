'use client';

import React from 'react';
import { CreditCard, DollarSign, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';

interface OutstandingInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: string;
  daysOverdue: number;
  purpose: string; // "Monthly Tuition", "Competition Registration", etc.
  description?: string;
  status: 'pending' | 'overdue' | 'due_soon';
}

interface BillingSectionProps {
  outstandingInvoices: OutstandingInvoice[];
  loading?: boolean;
  onPayInvoice: (invoiceId: string) => void;
  onViewInvoice: (invoiceId: string) => void;
  className?: string;
}

const BillingSection: React.FC<BillingSectionProps> = ({
  outstandingInvoices,
  loading = false,
  onPayInvoice,
  onViewInvoice,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string, daysOverdue: number) => {
    switch (status) {
      case 'overdue':
        return {
          bg: `${designTokens.colors.danger[500]}20`,
          text: designTokens.colors.danger[700],
          label: `${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`,
          icon: AlertTriangle,
          priority: 3
        };
      case 'due_soon':
        return {
          bg: `${designTokens.colors.warning[500]}20`,
          text: designTokens.colors.warning[700],
          label: 'Due soon',
          icon: Calendar,
          priority: 2
        };
      default:
        return {
          bg: `${designTokens.colors.info[500]}20`,
          text: designTokens.colors.info[700],
          label: 'Pending',
          icon: Calendar,
          priority: 1
        };
    }
  };

  const totalAmount = outstandingInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueInvoices = outstandingInvoices.filter(invoice => invoice.status === 'overdue');

  // 按优先级排序
  const sortedInvoices = [...outstandingInvoices].sort((a, b) => {
    const configA = getStatusConfig(a.status, a.daysOverdue);
    const configB = getStatusConfig(b.status, b.daysOverdue);
    return configB.priority - configA.priority;
  });

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Outstanding Invoices</h3>
          <p className="text-sm text-gray-600 mt-1">
            {outstandingInvoices.length === 0 
              ? 'All clear! No outstanding invoices.'
              : `${outstandingInvoices.length} invoice${outstandingInvoices.length !== 1 ? 's' : ''} pending`
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreditCard className="w-6 h-6 text-green-500" />
          {overdueInvoices.length > 0 && (
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: designTokens.colors.danger[500] }}
            >
              !
            </div>
          )}
        </div>
      </div>

      {/* 总金额汇总 */}
      {outstandingInvoices.length > 0 && (
        <div className={`mb-6 p-4 rounded-lg border ${
          overdueInvoices.length > 0 
            ? 'bg-red-50 border-red-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                overdueInvoices.length > 0 ? 'text-red-800' : 'text-blue-800'
              }`}>
                Total Outstanding
              </p>
              <p className={`text-2xl font-bold ${
                overdueInvoices.length > 0 ? 'text-red-900' : 'text-blue-900'
              }`}>
                ${totalAmount.toFixed(2)}
              </p>
            </div>
            {overdueInvoices.length > 0 && (
              <div className="text-right">
                <p className="text-sm font-medium text-red-800">
                  {overdueInvoices.length} overdue
                </p>
                <p className="text-xs text-red-700">
                  Action required
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 发票列表 */}
      {sortedInvoices.length > 0 ? (
        <div className="space-y-3">
          {sortedInvoices.map((invoice) => {
            const statusConfig = getStatusConfig(invoice.status, invoice.daysOverdue);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div
                key={invoice.id}
                className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors"
                style={{ borderRadius: designTokens.borderRadius.button }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {invoice.purpose}
                      </h4>
                      <div
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: statusConfig.bg,
                          color: statusConfig.text,
                        }}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Invoice #{invoice.invoiceNumber}</span>
                        <span className="font-bold text-lg text-gray-900">
                          ${invoice.amount.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Due date:</span> {invoice.dueDate}
                      </div>
                      {invoice.description && (
                        <div className="text-xs text-gray-500">
                          {invoice.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onViewInvoice(invoice.id)}
                      className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      style={{ borderRadius: designTokens.borderRadius.button }}
                    >
                      View
                    </button>
                    
                    <button
                      onClick={() => onPayInvoice(invoice.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                        invoice.status === 'overdue'
                          ? 'text-white bg-red-600 hover:bg-red-700'
                          : 'text-white hover:opacity-90'
                      }`}
                      style={{
                        backgroundColor: invoice.status === 'overdue' 
                          ? designTokens.colors.danger[600] 
                          : designTokens.colors.primary[500],
                        borderRadius: designTokens.borderRadius.button,
                      }}
                    >
                      {invoice.status === 'overdue' ? 'Pay Now' : 'Pay'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h4>
          <p className="text-gray-500 mb-1">No outstanding invoices.</p>
          <p className="text-sm text-gray-400">
            Your account is up to date. New invoices will appear here when issued.
          </p>
        </div>
      )}
    </div>
  );
};

export default BillingSection;
