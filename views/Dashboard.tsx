import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Clase } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Input, Button } from '../components/UI';
import { formatCRC } from '../lib/format';
import { 
  Users, BookOpen, GraduationCap, 
  ClipboardList, Clock, CreditCard,
  User as UserIcon, Calendar as CalendarIcon,
  TrendingUp, Award, ChevronRight, Activity, Star, AlertCircle
} from 'lucide-react';

interface Stats {
  tutores_activos: number;
  estudiantes_activos: number;
  cursos_activos: number;
  matriculas_activas: number;
  total_clases: number;
  ingresos_pendientes: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [todayDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [agenda, setAgenda] = useState<Clase[]>([]);
  const [todayAgenda, setTodayAgenda] = useState<Clase[]>([]);
  const [resumen, setResumen] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Llamadas en paralelo
      const [s, a, ta, r] = await Promise.all([
        api.dashboard.getStats().catch(() => ({
          tutores_activos: 0,
          estudiantes_activos: 0,
          cursos_activos: 0,
          matriculas_activas: 0,
          total_clases: 0,
          ingresos_pendientes: 0
        })),
        api.dashboard.getAgenda(selectedDate).catch(() => []),
        api.dashboard.getAgenda(todayDate).catch(() => []),
        api.dashboard.getResumenTutores(selectedDate).catch(() => [])
      ]);
      setStats(s);
      setAgenda(a);
      setTodayAgenda(ta);
      setResumen(r);
    } catch (err) {
      console.error('Error en dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, todayDate]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Actualizar cada 30 segundos
    const onFocus = () => fetchData();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [fetchData]);

  const StatCard = ({ title, value, icon, accentColor }: any) => (
    <Card className="hover:translate-y-[-4px] transition-transform group cursor-default bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription className="font-bold text-slate-500">{title}</CardDescription>
        <div className={`p-3 rounded-xl ${accentColor} shadow-sm group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
        <div className="mt-4 flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          <TrendingUp className="w-3 h-3 mr-2 text-emerald-500" />
          En tiempo real
        </div>
      </CardContent>
    </Card>
  );

  if (loading && !stats) return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-6">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm font-semibold text-slate-500">Actualizando datos...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Resumen General
          </h1>
          <p className="text-slate-500 text-sm mt-3 font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Estado actual de Linguistika Academy
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={fetchData}
            disabled={loading}
          >
            Actualizar Datos
          </Button>
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-2xl border border-blue-200 shadow-sm">
            <div className="flex flex-col items-end px-2">
              <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Estado</span>
              <span className="text-sm font-bold text-blue-900">OPERATIVO</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        <StatCard 
          title="Tutores Activos" 
          value={stats?.tutores_activos || 0} 
          icon={<Users className="w-5 h-5 text-blue-600" />} 
          accentColor="bg-blue-50"
        />
        <StatCard 
          title="Estudiantes" 
          value={stats?.estudiantes_activos || 0} 
          icon={<GraduationCap className="w-5 h-5 text-indigo-600" />} 
          accentColor="bg-indigo-50"
        />
        <StatCard 
          title="Cursos" 
          value={stats?.cursos_activos || 0} 
          icon={<BookOpen className="w-5 h-5 text-emerald-600" />} 
          accentColor="bg-emerald-50"
        />
        <StatCard 
          title="Matrículas" 
          value={stats?.matriculas_activas || 0} 
          icon={<ClipboardList className="w-5 h-5 text-amber-600" />} 
          accentColor="bg-amber-50"
        />
        <StatCard 
          title="Sesiones Totales" 
          value={stats?.total_clases || 0} 
          icon={<Award className="w-5 h-5 text-rose-600" />} 
          accentColor="bg-rose-50"
        />
        <StatCard 
          title="Ingresos Pendientes" 
          value={formatCRC(stats?.ingresos_pendientes ?? 0)} 
          icon={<CreditCard className="w-5 h-5 text-slate-700" />} 
          accentColor="bg-slate-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Agenda de Sesiones - Fecha Seleccionada */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
                Agenda de Sesiones
              </h2>
              <Input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-11 w-44 font-bold"
              />
            </div>

            {agenda.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <Clock className="w-14 h-14 mb-3 text-slate-300" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sin sesiones para esta fecha</p>
              </div>
            ) : (
              <div className="space-y-3">
                {agenda.map((clase) => (
                  <Card key={clase.id} className="group border-slate-200 hover:border-blue-300 hover:shadow-md transition-all bg-white">
                    <div className="p-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 group-hover:from-blue-100 group-hover:to-blue-200 transition-colors flex-shrink-0">
                          <span className="text-xs font-bold text-blue-600 mb-1">HORA</span>
                          <span className="text-lg font-black text-blue-900">{clase.hora_inicio}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {clase.curso_nombre}
                          </h4>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-2 font-semibold text-slate-600">
                              <UserIcon className="w-4 h-4 text-blue-500" />
                              {clase.estudiante_nombre}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500 italic">Docente: {clase.tutor_nombre}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={clase.estado === 'programada' ? 'secondary' : 'default'}
                          className="font-bold px-4 py-2"
                        >
                          {clase.estado}
                        </Badge>
                        <button className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all border border-blue-100">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Sesiones de Hoy */}
          <section className="space-y-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Clock className="w-6 h-6 text-emerald-600" />
              Programado para Hoy ({todayDate})
            </h3>

            {todayAgenda.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-emerald-50 rounded-xl border-2 border-dashed border-emerald-200">
                <CheckCircle className="w-12 h-12 mb-3 text-emerald-300" />
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Sin clases hoy. Descanso bien merecido</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayAgenda.map((clase) => (
                  <div key={clase.id} className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg flex items-center justify-between hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                        {clase.hora_inicio}
                      </div>
                      <div>
                        <p className="font-bold text-emerald-900">{clase.curso_nombre}</p>
                        <p className="text-sm text-emerald-700">{clase.estudiante_nombre} • {clase.tutor_nombre}</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-emerald-600 text-white">En vivo</Badge>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar - Carga de Trabajo */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="overflow-hidden border-slate-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-900">Carga de Trabajo</CardTitle>
              <CardDescription>Actividad de docentes hoy</CardDescription>
            </CardHeader>
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {resumen.length === 0 ? (
                <div className="p-12 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-wide">Sin datos disponibles</p>
                </div>
              ) : (
                resumen.map((r, i) => (
                  <div key={i} className="p-5 hover:bg-slate-50/70 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
                          {r.tutor_nombre?.charAt(0) || 'T'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{r.tutor_nombre}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{r.total_clases} sesión{r.total_clases !== 1 ? 'es' : ''}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-bold px-3">
                        {r.total_estudiantes || 0} alum.
                      </Badge>
                    </div>
                    {r.cursos && (
                      <p className="text-xs font-medium text-slate-400 truncate italic mb-3">
                        Cursos: {r.cursos}
                      </p>
                    )}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min((r.total_clases / 10) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Info Card */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader>
              <CardDescription className="text-blue-900 font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Próximas Acciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-blue-900">
              <p>✓ Verificar disponibilidad de tutores</p>
              <p>✓ Confirmar matriculas activas</p>
              <p>✓ Revisar pagos pendientes</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// CheckCircle icon fallback
const CheckCircle = (props: any) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default Dashboard;
