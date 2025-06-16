import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  CreditCard, 
  Download, 
  CheckCircle,
  Calendar,
  RefreshCw,
  AlertCircle,
  DollarSign,
  Users,
  HardDrive,
  TrendingUp,
  Info,
  FileText,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { supabase, getCachedUser, getCachedSubscription } from '../../lib/supabase';

interface BillingData {
  subscription: {
    id: string;
    status: string;
    plan_name: string;
    price: number;
    interval: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    stripe_customer_id: string;
    stripe_subscription_id: string;
  } | null;
  paymentHistory: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
    invoice_url?: string;
    payment_method: string;
  }>;
  upcomingPayment: {
    amount: number;
    due_date: string;
    payment_method: string;
  } | null;
  usage: {
    seats_used: number;
    seats_total: number;
    storage_used: number;
    storage_total: number;
    api_calls_used: number;
    api_calls_total: number;
  };
}

const BillingSettings: React.FC = () => {
  const { theme } = useTheme();
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Auto-refresh interval (every 5 minutes)
  useEffect(() => {
    fetchBillingData();
    
    const interval = setInterval(() => {
      fetchBillingData(true); // Silent refresh
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchBillingData = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);

      const { data: { user } } = await getCachedUser();
      if (!user) throw new Error('User not found');

      // Fetch subscription data
      const { data: subscription } = await getCachedSubscription(user.id);

      // Mock payment history (in real app, this would come from Stripe)
      const paymentHistory = [
        {
          id: 'inv_001',
          date: '2025-01-01',
          amount: 12.99,
          status: 'paid',
          invoice_url: '#',
          payment_method: '•••• 4242'
        },
        {
          id: 'inv_002',
          date: '2024-12-01',
          amount: 12.99,
          status: 'paid',
          invoice_url: '#',
          payment_method: '•••• 4242'
        },
        {
          id: 'inv_003',
          date: '2024-11-01',
          amount: 12.99,
          status: 'paid',
          invoice_url: '#',
          payment_method: '•••• 4242'
        }
      ];

      // Mock upcoming payment
      const upcomingPayment = subscription ? {
        amount: subscription.plans?.price || 12.99,
        due_date: subscription.current_period_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        payment_method: '•••• 4242'
      } : null;

      // Mock usage data
      const usage = {
        seats_used: 1,
        seats_total: 5,
        storage_used: 2.3,
        storage_total: 10,
        api_calls_used: 1250,
        api_calls_total: 10000
      };

      setBillingData({
        subscription: subscription ? {
          id: subscription.id,
          status: subscription.status,
          plan_name: subscription.plans?.name || 'Pro Plan',
          price: subscription.plans?.price || 12.99,
          interval: subscription.plans?.interval || 'month',
          current_period_end: subscription.current_period_end,
          cancel_at_period_end: subscription.cancel_at_period_end,
          stripe_customer_id: subscription.stripe_customer_id,
          stripe_subscription_id: subscription.stripe_subscription_id
        } : null,
        paymentHistory,
        upcomingPayment,
        usage
      });

    } catch (error) {
      console.error('Error fetching billing data:', error);
      setError('Failed to load billing information. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchBillingData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'paid':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'past_due':
      case 'failed':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'canceled':
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
      default:
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
    }
  };

  const exportBillingHistory = () => {
    if (!billingData?.paymentHistory) return;

    const csvContent = [
      ['Date', 'Amount', 'Status', 'Payment Method'],
      ...billingData.paymentHistory.map(payment => [
        formatDate(payment.date),
        formatCurrency(payment.amount),
        payment.status,
        payment.payment_method
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billing-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const Tooltip: React.FC<{ content: string; children: React.ReactNode; id: string }> = ({ content, children, id }) => (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(id)}
        onMouseLeave={() => setShowTooltip(null)}
        className="cursor-help"
      >
        {children}
      </div>
      {showTooltip === id && (
        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm rounded-lg shadow-lg z-50 w-64 ${
          theme === 'gradient' 
            ? 'bg-gray-800 text-white border border-gray-700' 
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
        }`}>
          {content}
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
            theme === 'gradient' ? 'border-t-gray-800' : 'border-t-white dark:border-t-gray-800'
          }`}></div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className={`ml-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            Loading billing information...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className={`text-lg font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            Error Loading Billing Data
          </h3>
          <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
            {error}
          </p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>Billing Settings</h2>
          <p className={`text-sm mt-1 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Manage your subscription and billing information.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportBillingHistory}
            disabled={!billingData?.paymentHistory?.length}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Current Subscription */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-lg font-medium ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              Current Subscription
            </h3>
            {billingData?.subscription && (
              <div className="mt-2 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className={`text-sm font-medium ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {billingData.subscription.plan_name}
                </span>
                <span className={`ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full ${
                  getStatusColor(billingData.subscription.status)
                }`}>
                  {billingData.subscription.status}
                </span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              {billingData?.subscription ? formatCurrency(billingData.subscription.price) : 'No subscription'}
            </div>
            {billingData?.subscription && (
              <div className={`text-sm ${
                theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                per {billingData.subscription.interval}
              </div>
            )}
          </div>
        </div>

        {billingData?.subscription && (
          <div className={`p-4 rounded-lg ${
            theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Next billing date
                </span>
                <div className={`flex items-center ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(billingData.subscription.current_period_end)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Auto-renewal
                </span>
                <span className={`font-medium ${
                  billingData.subscription.cancel_at_period_end 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {billingData.subscription.cancel_at_period_end ? 'Disabled' : 'Enabled'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Usage Metrics */}
      <Card>
        <h3 className={`text-lg font-medium mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Current Usage
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Seats */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-2" />
                <span className={`text-sm font-medium ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  Team Seats
                </span>
                <Tooltip content="Number of team members with access to your account" id="seats">
                  <Info className="h-4 w-4 ml-1 text-gray-400" />
                </Tooltip>
              </div>
              <span className={`text-sm ${
                theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {billingData?.usage.seats_used}/{billingData?.usage.seats_total}
              </span>
            </div>
            <div className={`w-full h-2 rounded-full ${
              theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-200 dark:bg-gray-700'
            }`}>
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((billingData?.usage.seats_used || 0) / (billingData?.usage.seats_total || 1)) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Storage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <HardDrive className="h-5 w-5 text-green-500 mr-2" />
                <span className={`text-sm font-medium ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  Storage
                </span>
                <Tooltip content="Total storage space used for your projects and files" id="storage">
                  <Info className="h-4 w-4 ml-1 text-gray-400" />
                </Tooltip>
              </div>
              <span className={`text-sm ${
                theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {billingData?.usage.storage_used}GB/{billingData?.usage.storage_total}GB
              </span>
            </div>
            <div className={`w-full h-2 rounded-full ${
              theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-200 dark:bg-gray-700'
            }`}>
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((billingData?.usage.storage_used || 0) / (billingData?.usage.storage_total || 1)) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* API Calls */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
                <span className={`text-sm font-medium ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  API Calls
                </span>
                <Tooltip content="Number of API calls made this billing period" id="api">
                  <Info className="h-4 w-4 ml-1 text-gray-400" />
                </Tooltip>
              </div>
              <span className={`text-sm ${
                theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {billingData?.usage.api_calls_used?.toLocaleString()}/{billingData?.usage.api_calls_total?.toLocaleString()}
              </span>
            </div>
            <div className={`w-full h-2 rounded-full ${
              theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-200 dark:bg-gray-700'
            }`}>
              <div 
                className="h-full bg-purple-500 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((billingData?.usage.api_calls_used || 0) / (billingData?.usage.api_calls_total || 1)) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Upcoming Payment */}
      {billingData?.upcomingPayment && (
        <Card>
          <h3 className={`text-lg font-medium mb-4 ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Upcoming Payment
          </h3>
          
          <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${
            theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-lg font-semibold ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {formatCurrency(billingData.upcomingPayment.amount)}
                </div>
                <div className={`text-sm ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Due {formatDate(billingData.upcomingPayment.due_date)}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Payment method
                </div>
                <div className={`font-medium ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {billingData.upcomingPayment.payment_method}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Payment Method */}
      <Card>
        <h3 className={`text-lg font-medium mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Payment Method
        </h3>
        <div className={`flex items-center justify-between p-4 rounded-lg ${
          theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'
        }`}>
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
            <div>
              <p className={`text-sm font-medium ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                •••• •••• •••• 4242
              </p>
              <p className={`text-xs ${
                theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                Expires 12/25
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </div>
      </Card>

      {/* Billing History */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-medium ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Billing History
          </h3>
          <Button variant="outline" size="sm" onClick={exportBillingHistory}>
            <FileText className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-left border-b ${
                theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'
              }`}>
                <th className={`pb-3 text-sm font-medium ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                }`}>Date</th>
                <th className={`pb-3 text-sm font-medium ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                }`}>Amount</th>
                <th className={`pb-3 text-sm font-medium ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                }`}>Status</th>
                <th className={`pb-3 text-sm font-medium ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                }`}>Payment Method</th>
                <th className={`pb-3 text-sm font-medium ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                }`}>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {billingData?.paymentHistory?.map((payment) => (
                <tr key={payment.id} className={`border-b ${
                  theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'
                }`}>
                  <td className={`py-4 text-sm ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {formatDate(payment.date)}
                  </td>
                  <td className={`py-4 text-sm font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      getStatusColor(payment.status)
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className={`py-4 text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {payment.payment_method}
                  </td>
                  <td className="py-4">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Billing Management */}
      <Card>
        <h3 className={`text-lg font-medium mb-4 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Billing Management
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="justify-start">
            <ExternalLink className="h-4 w-4 mr-2" />
            Manage in Stripe
          </Button>
          
          <Button variant="outline" className="justify-start">
            <RefreshCw className="h-4 w-4 mr-2" />
            Change Plan
          </Button>
          
          <Button variant="outline" className="justify-start">
            <CreditCard className="h-4 w-4 mr-2" />
            Update Payment Method
          </Button>
          
          <Button variant="outline" className="justify-start">
            <Download className="h-4 w-4 mr-2" />
            Download All Invoices
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BillingSettings;