'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Settings {
  _id: string;
  isActive: boolean;
  deadline: string; // ISO
  courseTitle: string;
  regularPrice: number;
  offerPrice: number;
  description: string;
}

export default function ExclusiveOfferAdmin() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Convert UTC deadline to local datetime-local input value (Bangladesh time UTC+6)
  const toLocalDateTimeInput = (utcDateStr: string) => {
    const utc = new Date(utcDateStr);
    const bdTime = new Date(utc.getTime() + 6 * 60 * 60 * 1000);
    return bdTime.toISOString().slice(0, 16);
  };

  // Convert local datetime string to UTC ISO
  const localToUTC = (localDateTime: string) => {
    const localDate = new Date(localDateTime);
    return new Date(localDate.getTime() - 6 * 60 * 60 * 1000).toISOString();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/exclusive-offer/settings');
      setSettings(res.data.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const formData = new FormData(e.currentTarget);
    const localDeadline = formData.get('deadline') as string;
    const utcDeadline = localToUTC(localDeadline);

    try {
      await axios.put('/api/admin/exclusive-offer/settings', {
        isActive: formData.get('isActive') === 'on',
        deadline: utcDeadline,
        courseTitle: formData.get('courseTitle'),
        regularPrice: Number(formData.get('regularPrice')),
        offerPrice: Number(formData.get('offerPrice')),
        description: formData.get('description'),
      });
      setMessage('✅ Settings saved successfully');
      fetchSettings(); // refresh
    } catch (error: any) {
      setMessage(error.response?.data?.message || '❌ Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading settings...</div>;
  if (!settings) return <div className="p-6 text-red-500">Failed to load settings</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🎯 Exclusive Offer Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isActive" defaultChecked={settings.isActive} />
          <span>Active (visible to users & allow registrations)</span>
        </label>

        <div>
          <label className="block font-medium">Offer Deadline (Bangladesh Time)</label>
          <input
            type="datetime-local"
            name="deadline"
            required
            defaultValue={toLocalDateTimeInput(settings.deadline)}
            className="border p-2 w-full rounded"
          />
          <p className="text-sm text-gray-500">Date & time in Asia/Dhaka (UTC+6)</p>
        </div>

        <div>
          <label className="block font-medium">Course Title</label>
          <input
            type="text"
            name="courseTitle"
            defaultValue={settings.courseTitle}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Regular Price (BDT)</label>
          <input
            type="number"
            name="regularPrice"
            defaultValue={settings.regularPrice}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Offer Price (BDT)</label>
          <input
            type="number"
            name="offerPrice"
            defaultValue={settings.offerPrice}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Description (optional)</label>
          <textarea
            name="description"
            defaultValue={settings.description}
            rows={3}
            className="border p-2 w-full rounded"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>

        {message && <p className="text-green-600 mt-2">{message}</p>}
      </form>
    </div>
  );
}