import React, { useState, useEffect } from 'react';
import { analyzeSprintRisks } from '../services/api';

const SprintRiskModal = ({ projectId, sprint, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [riskData, setRiskData] = useState(null);

  useEffect(() => {
    if (isOpen && sprint && projectId) {
      loadAnalysis();
    } else {
      setRiskData(null);
      setError(null);
    }
  }, [isOpen, sprint?.id, sprint?._id, projectId]);

  const loadAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const sprintId = sprint.id || sprint._id;
      const data = await analyzeSprintRisks(projectId, sprintId);
      setRiskData(data);
    } catch (err) {
      console.error('Failed to analyze sprint risks:', err);
      setError(err.message || 'Unable to analyze sprint risks at this time.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getSeverityBadge = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-600 border-red-500/30';
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'LOW':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      default:
        return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
    }
  };

  const getOverallRiskBanner = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'from-red-600 to-rose-700 text-white shadow-red-500/20';
      case 'HIGH':
        return 'from-amber-600 to-orange-600 text-white shadow-orange-500/20';
      case 'MEDIUM':
        return 'from-amber-500 to-yellow-600 text-white shadow-amber-500/20';
      default:
        return 'from-emerald-600 to-teal-600 text-white shadow-emerald-500/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Sprint Risk Assistant
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  {sprint?.title || 'Sprint Analysis'}
                </span>
              </h2>
              <p className="text-xs text-slate-500">Automated project bottleneck detection & mitigation advice</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadAnalysis}
              disabled={loading}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Refresh Analysis"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-slate-600">Analyzing sprint indicators & evaluating risks...</p>
              <p className="text-xs text-slate-400">Verifying planned dates, workload distribution, and task bottlenecks</p>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold">Analysis Failed</p>
                <p className="text-xs mt-1 text-red-600">{error}</p>
                <button
                  onClick={loadAnalysis}
                  className="mt-3 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition"
                >
                  Retry Analysis
                </button>
              </div>
            </div>
          )}

          {!loading && !error && riskData && (
            <>
              {/* Overall Risk Banner */}
              <div className={`p-5 rounded-2xl bg-gradient-to-r ${getOverallRiskBanner(riskData.overallRisk)} shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                      Overall Risk: {riskData.overallRisk}
                    </span>
                    {riskData.aiGenerated ? (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/40 backdrop-blur-sm text-indigo-100 font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 011.094 1.666l-1.026 1.026 1.026 1.026a1 1 0 01-1.094 1.666l-1.599-.8L11 11.677V13a1 1 0 01-2 0v-1.323l-3.954-1.582-1.599.8a1 1 0 01-1.094-1.666l1.026-1.026-1.026-1.026a1 1 0 011.094-1.666l1.599.8L9 4.323V3a1 1 0 011-1z" />
                        </svg>
                        AI-Enhanced (Gemini)
                      </span>
                    ) : (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 font-medium">
                        Deterministic Engine
                      </span>
                    )}
                  </div>
                  <p className="text-sm md:text-base font-medium text-white/95 leading-relaxed pt-1">
                    {riskData.summary}
                  </p>
                </div>
                <div className="shrink-0 text-right md:border-l md:border-white/20 md:pl-6">
                  <div className="text-3xl font-extrabold">{riskData.metrics?.completionRate || 0}%</div>
                  <div className="text-xs text-white/80 uppercase tracking-wide">Completion Rate</div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50">
                  <div className="text-xs font-medium text-slate-500">Overdue Tasks</div>
                  <div className={`text-xl font-bold mt-1 ${riskData.metrics?.overdueTasks > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                    {riskData.metrics?.overdueTasks || 0}
                    {riskData.metrics?.highPriorityOverdueTasks > 0 && (
                      <span className="text-xs font-normal text-red-500 ml-1">
                        ({riskData.metrics.highPriorityOverdueTasks} high prio)
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50">
                  <div className="text-xs font-medium text-slate-500">Due Within 48h</div>
                  <div className={`text-xl font-bold mt-1 ${riskData.metrics?.dueSoonTasks > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
                    {riskData.metrics?.dueSoonTasks || 0}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50">
                  <div className="text-xs font-medium text-slate-500">Unassigned Tasks</div>
                  <div className={`text-xl font-bold mt-1 ${riskData.metrics?.unassignedTasks > 0 ? 'text-orange-600' : 'text-slate-700'}`}>
                    {riskData.metrics?.unassignedTasks || 0}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50">
                  <div className="text-xs font-medium text-slate-500">Completed / Total</div>
                  <div className="text-xl font-bold mt-1 text-slate-700">
                    {riskData.metrics?.completedTasks || 0} / {riskData.metrics?.totalTasks || 0}
                  </div>
                </div>
              </div>

              {/* Risk Findings Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    Identified Risk Findings
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {riskData.findings?.length || 0}
                    </span>
                  </h3>
                </div>

                {(!riskData.findings || riskData.findings.length === 0) ? (
                  <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                    <svg className="w-8 h-8 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-semibold text-slate-700">No Active Risks Detected</p>
                    <p className="text-xs text-slate-500 mt-0.5">All sprint tasks are on track and properly allocated.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {riskData.findings.map((finding, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-sm space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getSeverityBadge(finding.severity)}`}>
                              {finding.severity}
                            </span>
                            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {finding.riskType}
                            </span>
                            {finding.taskTitle && (
                              <span className="text-sm font-bold text-slate-800">
                                {finding.taskTitle}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 font-medium">
                          {finding.reason}
                        </p>

                        {/* Evidence bullets */}
                        {finding.evidence && finding.evidence.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {finding.evidence.map((ev, evIdx) => (
                              <span key={evIdx} className="text-xs px-2 py-0.5 rounded bg-slate-50 border border-slate-200/70 text-slate-600">
                                {ev}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Actionable recommendations */}
                        {finding.recommendedActions && finding.recommendedActions.length > 0 && (
                          <div className="pt-2 border-t border-slate-100">
                            <p className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Recommended Mitigation:
                            </p>
                            <ul className="space-y-1">
                              {finding.recommendedActions.map((action, actIdx) => (
                                <li key={actIdx} className="text-xs text-slate-600 flex items-start gap-1.5">
                                  <span className="text-indigo-500 font-bold">•</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-400">
          <div>
            {riskData?.generatedAt && (
              <span>Analyzed on {new Date(riskData.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default SprintRiskModal;
