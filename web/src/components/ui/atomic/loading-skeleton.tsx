export function LoadingSkeleton() {
  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center py-8">
        <div className="animate-pulse flex flex-col items-center justify-center">
          <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2.5"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  );
}
