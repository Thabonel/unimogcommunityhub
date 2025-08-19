
interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <div className="p-4 border border-yellow-200 rounded-md bg-yellow-50 text-yellow-800">
      <p className="text-sm">Using default models. Database connection unavailable.</p>
      <button 
        onClick={onRetry}
        className="mt-2 text-sm text-yellow-600 underline hover:text-yellow-800"
      >
        Try loading from database
      </button>
    </div>
  );
};

export default ErrorState;
