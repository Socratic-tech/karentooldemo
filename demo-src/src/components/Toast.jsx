import { CheckCircle, XCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success' }) => {
  const styles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-500" />,
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
  };

  const style = styles[type] || styles.success;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className={`flex items-center gap-3 px-5 py-3 rounded-lg border shadow-lg ${style.bg}`}>
        {style.icon}
        <span className={`text-sm font-medium ${style.text}`}>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
