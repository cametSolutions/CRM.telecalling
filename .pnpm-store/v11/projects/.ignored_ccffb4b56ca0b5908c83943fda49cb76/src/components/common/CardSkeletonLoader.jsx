import React from 'react';

const CardSkeletonLoader = ({ count = 5, showShimmer = false }) => {
  const SkeletonCard = ({ index }) => (
    <div className={`flex items-center gap-3 bg-slate-100 p-3 rounded-md shadow-sm ${showShimmer ? 'shimmer-bg' : 'animate-pulse'}`}>
      {/* Icon Skeleton */}
      <div className="bg-gray-300 rounded-full p-2 md:mr-10 w-12 h-12 flex items-center justify-center">
        <div className="w-5 h-5 bg-gray-400 rounded"></div>
      </div>
      
      {/* Content Card Skeleton */}
      <div className="flex justify-between w-full px-6 py-2 bg-white shadow-xl rounded-md border border-gray-100">
        {/* Label Skeleton */}
        <div className="h-6 bg-gray-300 rounded" style={{ width: `${120 + (index * 20)}px` }}></div>
        
        {/* Value Skeleton */}
        <div className="h-6 bg-gray-200 rounded" style={{ width: `${60 + (index * 10)}px` }}></div>
      </div>
    </div>
  );

  const ShimmerCard = ({ index }) => (
    <div className="flex items-center gap-3 bg-slate-100 p-3 rounded-md shadow-sm">
      {/* Icon Skeleton with shimmer */}
      <div className="shimmer rounded-full p-2 md:mr-10 w-12 h-12 flex items-center justify-center">
        <div className="w-5 h-5 shimmer rounded"></div>
      </div>
      
      {/* Content Card Skeleton with shimmer */}
      <div className="flex justify-between w-full px-6 py-2 bg-white shadow-xl rounded-md border border-gray-100">
        {/* Label Skeleton */}
        <div className="h-6 shimmer rounded" style={{ width: `${120 + (index * 20)}px` }}></div>
        
        {/* Value Skeleton */}
        <div className="h-6 shimmer rounded" style={{ width: `${60 + (index * 10)}px` }}></div>
      </div>
    </div>
  );

  return (
    <>
      {/* Shimmer CSS */}
      {showShimmer && (
        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -468px 0;
            }
            100% {
              background-position: 468px 0;
            }
          }
          .shimmer {
            animation: shimmer 2s infinite linear;
            background: linear-gradient(to right, #f1f5f9 4%, #e2e8f0 25%, #f1f5f9 36%);
            background-size: 1000px 100%;
          }
          .shimmer-bg {
            animation: shimmer 2.5s infinite linear;
            background: linear-gradient(to right, #f1f5f9 4%, #e2e8f0 25%, #f1f5f9 36%);
            background-size: 1000px 100%;
          }
        `}</style>
      )}
      
      <div className="space-y-4">
        {[...Array(count)].map((_, index) => (
          showShimmer ? (
            <ShimmerCard key={index} index={index} />
          ) : (
            <SkeletonCard key={index} index={index} />
          )
        ))}
      </div>
    </>
  );
};

// Enhanced version with more realistic loading states
const EnhancedCardSkeleton = ({ count = 5, variant = 'default' }) => {
  const variants = {
    default: 'animate-pulse',
    wave: 'animate-pulse',
    shimmer: 'shimmer-effect'
  };

  return (
    <>
      {variant === 'shimmer' && (
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          .shimmer-effect {
            background: linear-gradient(90deg, #f8fafc 25%, #e2e8f0 50%, #f8fafc 75%);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
          .pulse-slow {
            animation: pulse-slow 2s infinite;
          }
        `}</style>
      )}
      
      <div className="space-y-4">
        {[...Array(count)].map((_, index) => (
          <div 
            key={index} 
            className={`flex items-center gap-3 bg-slate-100 p-3 rounded-md shadow-sm ${
              variant === 'shimmer' ? 'shimmer-effect' : 'animate-pulse'
            }`}
            style={{
              animationDelay: variant === 'wave' ? `${index * 0.1}s` : '0s'
            }}
          >
            {/* Icon Skeleton */}
            <div className={`bg-blue-200 text-white rounded-full p-2 md:mr-10 w-12 h-12 flex items-center justify-center ${
              variant === 'shimmer' ? '' : 'animate-pulse'
            }`}>
              <div className="w-5 h-5 bg-blue-300 rounded opacity-60"></div>
            </div>
            
            {/* Content Card Skeleton */}
            <div className={`flex justify-between w-full px-6 py-2 bg-white shadow-xl rounded-md border border-gray-100 ${
              variant === 'shimmer' ? '' : 'animate-pulse'
            }`}>
              {/* Label Skeleton with varied widths */}
              <div 
                className={`h-6 bg-gray-300 rounded ${variant === 'shimmer' ? 'shimmer-effect' : ''}`}
                style={{ 
                  width: `${Math.max(100, 120 + (index * 15) + Math.random() * 40)}px`,
                  animationDelay: variant === 'wave' ? `${index * 0.15}s` : '0s'
                }}
              ></div>
              
              {/* Value Skeleton with varied widths */}
              <div 
                className={`h-6 bg-gray-200 rounded ${variant === 'shimmer' ? 'shimmer-effect' : ''}`}
                style={{ 
                  width: `${Math.max(40, 60 + (index * 8) + Math.random() * 30)}px`,
                  animationDelay: variant === 'wave' ? `${index * 0.2}s` : '0s'
                }}
              ></div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        <div className="flex justify-center py-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm font-medium">Loading...</span>
          </div>
        </div>
      </div>
    </>
  );
};

// Demo component showing all variations
const SkeletonDemo = () => {
  const [variant, setVariant] = React.useState('default');
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Card Skeleton Loader Demo</h2>
          
          {/* Variant Selector */}
          <div className="flex space-x-4 mb-6">
            {['default', 'wave', 'shimmer'].map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  variant === v 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Basic Version */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Basic Skeleton</h3>
          <CardSkeletonLoader count={3} showShimmer={variant === 'shimmer'} />
        </div>
        
        {/* Enhanced Version */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Enhanced Skeleton</h3>
          <EnhancedCardSkeleton count={4} variant={variant} />
        </div>
      </div>
    </div>
  );
};

export default SkeletonDemo;
export { CardSkeletonLoader, EnhancedCardSkeleton };