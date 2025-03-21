import { RefreshCw } from "lucide-react";
import React from "react";

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="animate-spin mr-2">
        <RefreshCw className="h-5 w-5 text-gray-400" />
      </div>
      <p className="text-gray-500">Loading data...</p>
    </div>
  );
};

export default LoadingState;
