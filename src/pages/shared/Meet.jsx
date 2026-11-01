import React, { useState, useEffect } from 'react';
import { scheduleZoomMeeting, fetchZoomInvitees } from '../../services/api';
import { toast } from 'react-toastify';

const Meet = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({
    topic: '',
    startTime: '',
    duration: 30,
    inviteeIds: []
  });
  const [loading, setLoading] = useState(false);
  const [scheduledMeetings, setScheduledMeetings] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    async function loadInvitees() {
      try {
        const data = await fetchZoomInvitees();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading invitees:', err);
        setEmployees([]);
      }
    }
    loadInvitees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleInviteeToggle = (id) => {
    setForm((prev) => {
      const exists = prev.inviteeIds.includes(id);
      return {
        ...prev,
        inviteeIds: exists
          ? prev.inviteeIds.filter((i) => i !== id)
          : [...prev.inviteeIds, id]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.topic || !form.startTime) {
      toast.warn('Please fill in meeting topic and start time');
      return;
    }

    setLoading(true);
    try {
      const result = await scheduleZoomMeeting({
        ...form,
        inviteeIds: form.inviteeIds.filter(Boolean)
      });
      toast.success('🎉 Zoom meeting scheduled successfully!');
      if (result.meeting) {
        setScheduledMeetings([result.meeting, ...scheduledMeetings]);
      }
      setForm({ topic: '', startTime: '', duration: 30, inviteeIds: [] });
      setActiveTab(1);
    } catch (err) {
      toast.error(err.message || 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
          📹 Video Collaboration
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Meetings & Virtual Conference</h1>
        <p className="text-sm text-slate-500">Schedule Zoom meetings and send instant email invitations to teammates</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 pt-4 flex gap-6">
          {['Schedule Meeting', 'Upcoming & Past Meetings'].map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(idx)}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === idx
                  ? 'text-blue-600'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab}
              {activeTab === idx && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 0 ? (
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Meeting Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Weekly Sprint Sync & Retrospective"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Duration (Minutes)
                  </label>
                  <select
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Invitees (Email Notifications Sent)
                </label>
                <div className="max-h-48 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  {employees.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2 text-center">No teammates found.</p>
                  ) : (
                    employees.map((emp) => {
                      const empId = emp.id || emp._id;
                      const isSelected = form.inviteeIds.includes(empId);
                      return (
                        <label
                          key={empId}
                          className={`flex items-center justify-between p-2.5 rounded-lg text-sm cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleInviteeToggle(empId)}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <div className="font-semibold text-slate-800 text-xs">{emp.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{emp.email}</div>
                            </div>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {loading ? 'Scheduling Zoom Call...' : 'Schedule Zoom Meeting'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {scheduledMeetings.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-base font-semibold text-slate-600">No meetings scheduled in this session</p>
                  <p className="text-xs mt-1">Switch to the "Schedule Meeting" tab to create one.</p>
                </div>
              ) : (
                scheduledMeetings.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">{m.topic}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        🕒 {new Date(m.startTime).toLocaleString()} ({m.duration} mins)
                      </p>
                    </div>

                    <a
                      href={m.joinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all text-center"
                    >
                      Join Meeting ➔
                    </a>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Meet;