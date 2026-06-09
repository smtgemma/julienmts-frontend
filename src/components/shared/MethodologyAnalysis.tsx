"use client"

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Loading from '@/components/Others/Loading';

type MethodologyField = {
  field: string;
  definition: string;
  covered: boolean;
  questions_asked: string[];
  answers_received: string[];
  coverage_notes: string;
};

type MethodologyAnalysisData = {
  meeting_id: string;
  session_id: string;
  methodology: string;
  overall_coverage_score: number;
  fields_analyzed: MethodologyField[];
  generated_at: string;
  cached: boolean;
};

type MethodologyAnalysisProps = {
  meetingId?: string | null;
  sessionId?: string | null;
};

export default function MethodologyAnalysis({ meetingId, sessionId }: MethodologyAnalysisProps) {
  const [methodologyData, setMethodologyData] = useState<MethodologyAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvedMeetingId = meetingId || Cookies.get('meetingId')?.trim() || '';
  const resolvedSessionId = sessionId || Cookies.get('sessionId')?.trim() || '';
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api-julientmts.aiteamtwo.com/api/v1';

  useEffect(() => {
    if (!resolvedMeetingId || !resolvedSessionId) {
      setError('Meeting ID or session ID is missing.');
      return;
    }

    const fetchMethodology = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = Cookies.get('token');
        const response = await fetch(
          `${API_BASE}/conversation/${resolvedMeetingId}/methodology-analysis?session_id=${resolvedSessionId}`,
          {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        const json = await response.json();
        if (!response.ok || !json.success) {
          throw new Error(json?.message || 'Failed to load methodology analysis');
        }

        setMethodologyData(json.data || null);
      } catch (err: any) {
        console.error('Methodology analysis fetch failed:', err);
        setError(err?.message || 'Unable to load methodology analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchMethodology();
  }, [resolvedMeetingId, resolvedSessionId, API_BASE]);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-[#111827]">Methodology Coverage</h3>
          <p className="text-sm text-[#6B7280]">Analysis from the selected meeting session.</p>
        </div>
        {loading ? null : methodologyData ? (
          <div className="text-right">
            <div className="text-xs text-[#6B7280]">Overall coverage</div>
            <div className={`text-2xl font-semibold ${methodologyData.overall_coverage_score >= 50 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {methodologyData.overall_coverage_score}%
            </div>
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="py-6">
          <Loading />
        </div>
      ) : error ? (
        <div className="rounded-lg bg-rose-50 border border-rose-100 p-4 text-sm text-rose-700">{error}</div>
      ) : methodologyData ? (
        <div className="space-y-4">
          {methodologyData.fields_analyzed.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {methodologyData.fields_analyzed.map((field, index) => (
                <div key={`${field.field}-${index}`} className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-[#111827]">{field.field}</h4>
                      <p className="text-xs text-[#6B7280] mt-1">{field.definition}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${field.covered ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {field.covered ? 'Covered' : 'Not covered'}
                    </span>
                  </div>
                  {field.coverage_notes ? <p className="mt-3 text-sm text-[#4B5563]">{field.coverage_notes}</p> : null}
                  {field.questions_asked.length > 0 ? (
                    <div className="mt-3">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-[#374151]">Questions Asked</div>
                      <ul className="list-disc list-inside text-sm text-[#4B5563] mt-2 space-y-1">
                        {field.questions_asked.map((question, qIndex) => (
                          <li key={`q-${qIndex}`}>{question}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {field.answers_received.length > 0 ? (
                    <div className="mt-3">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-[#374151]">Answers Received</div>
                      <ul className="list-disc list-inside text-sm text-[#4B5563] mt-2 space-y-1">
                        {field.answers_received.map((answer, aIndex) => (
                          <li key={`a-${aIndex}`}>{answer}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
              No methodology fields were analyzed for this session.
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
          No methodology analysis is available yet.
        </div>
      )}
    </div>
  );
}
