import { useState, useEffect } from 'react';
import alertService from '../../services/alertService';

const AlertBanner = () => {
  const [alerts, setAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load dismissed alerts from session storage
    const dismissed = sessionStorage.getItem('dismissedAlerts');
    if (dismissed) {
      setDismissedAlerts(JSON.parse(dismissed));
    }
    
    // Load alerts on mount
    loadAlerts();
    
    // Auto-refresh alerts every 30 seconds
    const interval = setInterval(loadAlerts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔔 Loading alerts from API...');
      const data = await alertService.getActiveAlerts();
      
      console.log('✅ Alerts loaded:', data);
      console.log('📊 Total alerts:', data.length);
      
      if (data.length === 0) {
        console.warn('⚠️ No active alerts found');
      } else {
        data.forEach(alert => {
          console.log(`  - ${alert.title} (${alert.severity})`);
        });
      }
      
      setAlerts(data);
    } catch (error) {
      console.error('❌ Error loading alerts:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = (alertId) => {
    console.log('🚫 Dismissing alert:', alertId);
    const newDismissed = [...dismissedAlerts, alertId];
    setDismissedAlerts(newDismissed);
    
    // Save to session storage
    sessionStorage.setItem('dismissedAlerts', JSON.stringify(newDismissed));
  };

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-orange-500',
      low: 'bg-yellow-500',
    };
    return colors[severity] || 'bg-blue-500';
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      case 'low':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const visibleAlerts = alerts.filter(
    (alert) => !dismissedAlerts.includes(alert.id)
  );

  // Debug: Show loading state in console
  if (loading && alerts.length === 0) {
    console.log('⏳ Loading alerts...');
  }

  // Don't render anything if no visible alerts
  if (visibleAlerts.length === 0) {
    console.log('👁️ No visible alerts (total: ' + alerts.length + ', dismissed: ' + dismissedAlerts.length + ')');
    return null;
  }

  console.log('📢 Displaying ' + visibleAlerts.length + ' alert(s)');

  return (
    <div className="fixed top-0 left-0 right-0 z-50 space-y-2 p-2 md:p-4">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`${getSeverityColor(
            alert.severity
          )} text-white p-4 rounded-lg shadow-2xl flex items-start justify-between animate-bounce-in`}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{getSeverityIcon(alert.severity)}</span>
              <span className="font-bold text-lg">{alert.title}</span>
              <span className="text-xs bg-white bg-opacity-30 px-2 py-1 rounded-full font-semibold">
                {alert.severity.toUpperCase()}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed">{alert.description}</p>
            <div className="mt-2 flex items-center gap-4 text-xs opacity-90">
              <span>📍 Region: {alert.region}</span>
              {alert.created_at && (
                <span>
                  🕒 {new Date(alert.created_at).toLocaleDateString('en-IN')}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => dismissAlert(alert.id)}
            className="ml-4 text-white hover:text-gray-200 font-bold text-2xl transition-transform hover:scale-110"
            aria-label="Dismiss alert"
            title="Dismiss this alert"
          >
            ×
          </button>
        </div>
      ))}
      
      {/* Debug Info (Remove in production) */}
      {import.meta.env.DEV && (
        <div className="bg-gray-800 text-white text-xs p-2 rounded opacity-50">
          Debug: {alerts.length} total | {visibleAlerts.length} visible | {dismissedAlerts.length} dismissed
        </div>
      )}
    </div>
  );
};

export default AlertBanner;
