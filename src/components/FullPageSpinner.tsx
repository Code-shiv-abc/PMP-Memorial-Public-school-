import React from 'react';

export const FullPageSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F1115]">
      <div className="w-12 h-12 border-4 border-gray-600 border-t-[#D4AF37] rounded-full animate-spin"></div>
    </div>
  );
};

export default FullPageSpinner;
