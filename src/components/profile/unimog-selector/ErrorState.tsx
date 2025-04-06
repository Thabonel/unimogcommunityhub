
interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-800">
      <p className="text-sm">Failed to load model data</p>
      <button 
        onClick={onRetry}
        className="mt-2 text-sm text-red-600 underline hover:text-red-800"
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorState;
