'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../lib/adminApi';
import FilterBar from '../_components/FilterBar';
import Pagination from '../_components/Pagination';
import Badge from '../_components/Badge';
import EmptyState from '../_components/EmptyState';
import AdminCard from '../_components/AdminCard';
import { toast } from '../_components/Toast';

interface ActivityLog {
  _id: string;
  admin: { _id: string; name: string; email: string };
  action: string;
  targetModel: string;
  targetId?: string;
  targetLabel?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

const actionMeta: Record<string, { color: 'sky' | 'emerald' | 'rose' | 'amber' | 'violet' | 'orange'; label: string; icon: string }> = {
  create: { color: 'emerald', label: 'Tạo mới', icon: '✨' },
  update: { color: 'sky', label: 'Cập nhật', icon: '✏️' },
  delete: { color: 'rose', label: 'Xóa', icon: '🗑' },
  bulk_delete: { color: 'rose', label: 'Xóa hàng loạt', icon: '🗑×N' },
  ban: { color: 'amber', label: 'Khóa', icon: '🔒' },
  unban: { color: 'emerald', label: 'Mở khóa', icon: '🔓' },
  role_change: { color: 'violet', label: 'Đổi vai trò', icon: '👑' },
};

const modelIcons: Record<string, string> = {
  User: '👥',
  Destination: '🏝️',
  Review: '⭐',
  Itinerary: '🗺️',
  ChatHistory: '💬',
};

export default function AdminActivity() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [action, setAction] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await adminApi.getActivity({
      page,
      action: action !== 'all' ? action : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    });
    if (error) toast.error(error);
    if (data) {
      const r = data as { logs: ActivityLog[]; totalPages: number };
      setLogs(r.logs);
      setTotalPages(r.totalPages);
    }
    setLoading(false);
  }, [page, action, dateFrom, dateTo]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Activity log</h2>
        <p className="text-sm text-gray-500 mt-1">Truy vết các hành động quản trị</p>
      </div>

      <FilterBar
        filters={[
          {
            key: 'action',
            label: 'Hành động',
            type: 'select',
            value: action,
            onChange: (v) => { setAction(v); setPage(1); },
            options: [
              { value: 'all', label: 'Tất cả' },
              { value: 'create', label: '✨ Tạo mới' },
              { value: 'update', label: '✏️ Cập nhật' },
              { value: 'delete', label: '🗑 Xóa' },
              { value: 'bulk_delete', label: '🗑×N Xóa hàng loạt' },
              { value: 'ban', label: '🔒 Khóa' },
              { value: 'unban', label: '🔓 Mở khóa' },
              { value: 'role_change', label: '👑 Đổi vai trò' },
            ],
          },
          { key: 'from', label: 'Từ', type: 'date', value: dateFrom, onChange: (v) => { setDateFrom(v); setPage(1); } },
          { key: 'to', label: 'Đến', type: 'date', value: dateTo, onChange: (v) => { setDateTo(v); setPage(1); } },
        ]}
        onReset={() => { setAction('all'); setDateFrom(''); setDateTo(''); setPage(1); }}
      />

      <AdminCard padding="none">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-10 h-10 border-3 border-violet-500 border-t-transparent rounded-full" />
          </div>
        ) : logs.length === 0 ? (
          <EmptyState icon="📜" title="Chưa có hoạt động" description="Khi admin thực hiện thao tác, hoạt động sẽ được ghi lại tại đây." />
        ) : (
          <ol className="relative divide-y divide-gray-50">
            {logs.map((log) => {
              const meta = actionMeta[log.action] || { color: 'gray' as const, label: log.action, icon: '•' };
              const modelIcon = modelIcons[log.targetModel] || '📄';
              const count = (log.meta as { count?: number })?.count;
              return (
                <li key={log._id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-sky-100 flex items-center justify-center text-lg shrink-0">
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">{log.admin?.name || '(deleted admin)'}</span>
                        <Badge color={meta.color} size="sm">{meta.label}</Badge>
                        <span className="text-xs text-gray-500">·</span>
                        <span className="text-xs text-gray-600">
                          {modelIcon} {log.targetModel}
                          {log.targetLabel && <span className="font-semibold text-gray-900"> "{log.targetLabel}"</span>}
                          {count && <span className="font-semibold text-gray-900"> ({count} items)</span>}
                        </span>
                      </div>
                      {log.meta && Object.keys(log.meta).filter((k) => !['ids', 'count'].includes(k)).length > 0 && (
                        <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-x-3">
                          {Object.entries(log.meta).filter(([k]) => !['ids', 'count'].includes(k)).map(([k, v]) => (
                            <span key={k}>
                              <span className="text-gray-400">{k}:</span> <span className="text-gray-700 font-medium">{String(v)}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                      {new Date(log.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </AdminCard>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
