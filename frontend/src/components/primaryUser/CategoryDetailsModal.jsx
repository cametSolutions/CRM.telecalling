import React from 'react';
import { X, TrendingUp, TrendingDown, Target, Award, Calendar } from 'lucide-react';

const CategoryDetailsModal = ({ isOpen, onClose, category }) => {
  if (!isOpen || !category) return null;

  const achieved = category?.achieved || 0;
  const target = category?.target || 100;
  const percentage = target > 0 ? Math.min((achieved / target) * 100, 100) : 0;

  // Mock allocation data - replace with actual data from your API
  const allocations = category?.allocations || [
    { name: 'Lead', achieved: 250, target: 500, value: 5 },
    { name: 'Closing', achieved: 180, target: 300, value: 10 },
    { name: 'Coding', achieved: 95, target: 150, value: 20 },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  {category?.categoryName}
                </h2>
                <p className="text-blue-100 text-sm">
                  Detailed Performance Overview
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors rounded-lg p-1 hover:bg-white/10"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50">
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={18} className="text-blue-600" />
                  <span className="text-xs font-semibold text-slate-600 uppercase">
                    Target
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {target.toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Award size={18} className="text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-600 uppercase">
                    Achieved
                  </span>
                </div>
                <p className="text-2xl font-bold text-emerald-600">
                  {achieved.toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={18} className="text-purple-600" />
                  <span className="text-xs font-semibold text-slate-600 uppercase">
                    Progress
                  </span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {percentage.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">
                  Overall Achievement
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {achieved} / {target}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Allocations Breakdown */}
            <div className="px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                Allocation Breakdown
              </h3>

              <div className="space-y-4">
                {allocations.map((allocation, index) => {
                  const allocPercentage = allocation.target > 0 
                    ? Math.min((allocation.achieved / allocation.target) * 100, 100) 
                    : 0;

                  const colors = [
                    { bg: 'bg-emerald-100', progress: 'bg-emerald-500', text: 'text-emerald-700' },
                    { bg: 'bg-blue-100', progress: 'bg-blue-500', text: 'text-blue-700' },
                    { bg: 'bg-purple-100', progress: 'bg-purple-500', text: 'text-purple-700' },
                    { bg: 'bg-amber-100', progress: 'bg-amber-500', text: 'text-amber-700' },
                  ];

                  const colorScheme = colors[index % colors.length];

                  return (
                    <div
                      key={allocation.name}
                      className={`${colorScheme.bg} rounded-xl p-4 border-2 border-transparent hover:border-slate-300 transition-all`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className={`font-semibold ${colorScheme.text} text-base`}>
                            {allocation.name}
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5">
                            ₹{allocation.value} per unit
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${colorScheme.text}`}>
                            {allocation.achieved}
                          </p>
                          <p className="text-xs text-slate-600">
                            of {allocation.target}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
                          <div
                            className={`h-full ${colorScheme.progress} transition-all duration-500 rounded-full`}
                            style={{ width: `${allocPercentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-medium">
                            {allocPercentage.toFixed(1)}% Complete
                          </span>
                          <span className={`font-semibold ${colorScheme.text}`}>
                            ₹{(allocation.achieved * allocation.value).toLocaleString()} earned
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Breakdown (if available) */}
            {category?.monthlyData && (
              <div className="px-6 py-4 bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-blue-600" />
                  Monthly Breakdown
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {category.monthlyData.map((month) => (
                    <div
                      key={month.month}
                      className="bg-white rounded-lg p-3 border border-slate-200"
                    >
                      <p className="text-xs font-semibold text-slate-600 uppercase mb-1">
                        {month.month}
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {month.achieved.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">
                        of {month.target.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-200">
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryDetailsModal;
