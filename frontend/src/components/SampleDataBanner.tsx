import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export const SampleDataBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4">
      <div className="flex items-start justify-between max-w-7xl mx-auto">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-200 mb-1">
              Using Local Sample Data
            </h3>
            <p className="text-sm text-yellow-100/80">
              Demo mode is enabled. These illustrative records are not live YouTube observations.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-yellow-200 hover:text-yellow-100 transition-colors"
          aria-label="Close banner"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

