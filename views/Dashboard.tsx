
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Stats, Clase } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Label, Input } from '../components/UI';
import { 
  Users, BookOpen, GraduationCap, 
  ClipboardList, Clock, CreditCard,
  User as UserIcon, Calendar as CalendarIcon,
  TrendingUp, Award, ChevronRight, Activity, Zap, Star
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [agenda, setAgenda] = useState<Clase[]>([]);
  const [resumen, setResumen] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [s, a, r] = await Promise.all([
          api.dashboard.getStats(),
          api.dashboard.getAgenda(selectedDate),
          api.dashboard.getResumenTutores(selectedDate)
        ]);
        setStats(s);
        setAgenda(a);
        setResumen(r);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate]);

  if (loading && !stats) return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-6">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Cargando métricas...</p>
    </div>
  );

  const StatCard = ({ title, value, icon, accentColor }: any) => (
    <Card className="hover:translate-y-[-4px] transition-transform group cursor-default">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription className="font-bold text-slate-400">{title}</CardDescription>
        <div className={`p-2.5 rounded-xl ${accentColor} shadow-sm group-hover:scale-110 transition-transform`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
        <div className="mt-4 flex items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
          <TrendingUp className="w-3 h-3 mr-2 text-emerald-500" />
          Actualizado ahora
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Resumen General
          </h1>
          <p className="text-slate-500 text-sm mt-3 font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Estado actual de la academia Linguistika
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col items-end px-3">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Matrícula 2025</span>
                <span className="text-sm font-bold text-slate-900">ABIERTA</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200">
                <Star className="w-5 h-5 fill-current" />
            </div>
        </div>
      </header>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard title="Tutores" value={stats?.tutores_activos} icon={<Users className="w-5 h-5 text-blue-600" />} accentColor="bg-blue-50" />
        <StatCard title="Estudiantes" value={stats?.estudiantes_activos} icon={<GraduationCap className="w-5 h-5 text-indigo-600" />} accentColor="bg-indigo-50" />
        <StatCard title="Cursos" value={stats?.cursos_activos} icon={<BookOpen className="w-5 h-5 text-emerald-600" />} accentColor="bg-emerald-50" />
        <StatCard title="Matrículas" value={stats?.matriculas_activas} icon={<ClipboardList className="w-5 h-5 text-amber-600" />} accentColor="bg-amber-50" />
        <StatCard title="Sesiones" value={stats?.total_clases} icon={<Award className="w-5 h-5 text-rose-600" />} accentColor="bg-rose-50" />
        <StatCard title="Pendiente" value={`${stats?.ingresos_pendientes}€`} icon={<CreditCard className="w-5 h-5 text-slate-700" />} accentColor="bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Agenda Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              Agenda de Sesiones
            </h2>
            <div className="w-56">
              <Input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-11 shadow-sm font-bold"
              />
            </div>
          </div>

          <div className="space-y-4">
            {agenda.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <Clock className="w-16 h-16 mb-4 text-slate-300" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sin clases para esta fecha</p>
              </div>
            ) : (
              agenda.map((clase) => (
                <Card key={clase.id} className="group border-slate-100 shadow-sm hover:border-blue-200">
                  <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                            <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Hora</span>
                            <span className="text-lg font-black text-slate-900">{clase.hora_inicio}</span>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{clase.curso_nombre}</h4>
                            <div className="flex items-center gap-6 mt-2">
                                <span className="flex items-center text-sm font-semibold text-slate-500">
                                    <UserIcon className="w-4 h-4 mr-2 text-blue-600" />
                                    {clase.estudiante_nombre}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                <span className="text-sm font-medium text-slate-400 italic">Prof. {clase.tutor_nombre}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <Badge variant={clase.estado === 'programada' ? 'info' : 'success'} className="h-8 px-5 rounded-xl">
                            {clase.estado}
                        </Badge>
                        <button className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-slate-100">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Resumen Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="overflow-hidden border-slate-200">
            <CardHeader className="bg-slate-50/50">
              <CardTitle className="text-lg">Carga de Trabajo</CardTitle>
              <CardDescription>Resumen de actividad por docente</CardDescription>
            </CardHeader>
            <div className="divide-y divide-slate-100">
              {resumen.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">Sin registros</div>
              ) : (
                resumen.map((r, i) => (
                  <div key={i} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {r.tutor_nombre.charAt(0)}
                        </div>
                        <span className="font-bold text-sm text-slate-900">{r.tutor_nombre}</span>
                      </div>
                      <Badge variant="secondary" className="font-bold">{r.total_clases} Clases</Badge>
                    </div>
                    <p className="text-xs font-medium text-slate-400 truncate mb-4 italic">{r.cursos || 'No asignado'}</p>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((r.total_clases / 5) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
