
import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Users, FileText, CheckCircle, Briefcase, Scale, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserRole } from '../../types';

const Dashboard: React.FC = () => {
  const { stats, inquiries, cases, availableLawyers, currentUser } = useStore();

  const dataByType = Object.keys(stats.byType).map(key => ({
    name: key,
    value: stats.byType[key]
  }));

  const casesPerLawyer = cases.reduce((acc, curr) => {
      const id = curr.lawyerId;
      acc[id] = (acc[id] || 0) + 1;
      return acc;
  }, {} as Record<number, number>);

  const lawyerData = Object.keys(casesPerLawyer).map(key => {
      const lawyerName = availableLawyers.find(l => l.id === Number(key))?.name || `ID: ${key}`;
      return {
          name: lawyerName.split(' ')[0], // First name only for chart
          value: casesPerLawyer[Number(key)]
      };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const LAWYER_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  const recentInquiries = inquiries.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Highlight Pending Approvals */}
        <Link to="/admin/cases" className="group">
            <div className={`p-6 rounded-xl shadow-sm border transition-all ${stats.pendingApprovals > 0 ? 'bg-red-50 border-red-200 hover:shadow-md cursor-pointer' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${stats.pendingApprovals > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <p className={`text-sm ${stats.pendingApprovals > 0 ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>รอตรวจสอบยอด</p>
                        <h3 className={`text-2xl font-bold ${stats.pendingApprovals > 0 ? 'text-red-700' : 'text-slate-800'}`}>{stats.pendingApprovals}</h3>
                    </div>
                </div>
            </div>
        </Link>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500">คดีที่รับทำ (Active)</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.activeCases}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg text-green-600">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500">ปิดงานขายแล้ว</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.closedInquiries}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500">จำนวนประเภทคดี</p>
            <h3 className="text-2xl font-bold text-slate-800">{Object.keys(stats.byType).length}</h3>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">สถิติแยกตามประเภทคดี (Inquiries)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataByType}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {dataByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {currentUser?.role === UserRole.CHIEF ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
                <Scale className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-semibold text-slate-800">ภาระงานทนายความ (Cases per Lawyer)</h3>
            </div>
            <div className="h-80 flex items-center justify-center">
                {lawyerData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={lawyerData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {lawyerData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={LAWYER_COLORS[index % LAWYER_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-slate-400 text-sm">ยังไม่มีข้อมูลคดี</div>
                )}
            </div>
            </div>
        ) : (
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
                 <div className="bg-blue-50 p-4 rounded-full mb-4">
                    <Briefcase className="w-10 h-10 text-primary" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800">My Workload</h3>
                 <p className="text-slate-500 mt-2">คุณกำลังดูข้อมูลเฉพาะคดีที่ได้รับมอบหมาย</p>
                 <div className="mt-6 text-center">
                     <p className="text-4xl font-bold text-primary">{stats.activeCases}</p>
                     <p className="text-sm text-slate-400">Active Cases</p>
                 </div>
             </div>
        )}
      </div>

      {/* Recent Inquiries Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-6 text-slate-800">รายการติดต่อล่าสุด</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-slate-100 text-left text-xs font-semibold text-slate-500 uppercase">
                            <th className="pb-3 pl-2">ชื่อผู้ติดต่อ</th>
                            <th className="pb-3">ประเภท</th>
                            <th className="pb-3">สถานะ</th>
                            <th className="pb-3 text-right">วันที่</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {recentInquiries.map(item => (
                            <tr key={item.id}>
                                <td className="py-3 pl-2 text-sm text-slate-700">{item.name}</td>
                                <td className="py-3 text-sm text-slate-600">
                                    <span className="px-2 py-1 bg-slate-100 rounded text-xs">{item.type}</span>
                                </td>
                                <td className="py-3 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        item.status === 'ใหม่' ? 'bg-yellow-100 text-yellow-700' : 
                                        item.status === 'ปิดเคส' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="py-3 text-sm text-right text-slate-400">
                                    {new Date(item.createdAt).toLocaleDateString('th-TH')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
