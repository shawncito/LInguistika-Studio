
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Stats, Clase } from '../types';
import { Card, Badge, Label, Input } from '../components/UI';
import { 
  Users, BookOpen, GraduationCap, 
  ClipboardList, Clock, CreditCard,
  User as UserIcon, Calendar as CalendarIcon
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

  if (loading && !stats) return <div className="text-center py-10">Cargando dashboard...</div>;

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color} text-white`}>
          {icon}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bienvenido a Linguistika</h1>
        <p className="text-gray-500">Resumen general y agenda diaria.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Tutores" value={stats?.tutores_activos} icon={<Users className="w-5 h-5" />} color="bg-blue-500" />
        <StatCard title="Estudiantes" value={stats?.estudiantes_activos} icon={<GraduationCap className="w-5 h-5" />} color="bg-emerald-500" />
        <StatCard title="Cursos" value={stats?.cursos_activos} icon={<BookOpen className="w-5 h-5" />} color="bg-indigo-500" />
        <StatCard title="Matrículas" value={stats?.matriculas_activas} icon={<ClipboardList className="w-5 h-5" />} color="bg-amber-500" />
        <StatCard title="Total Clases" value={stats?.total_clases} icon={<Clock className="w-5 h-5" />} color="bg-purple-500" />
        <StatCard title="Pendiente" value={`${stats?.ingresos_pendientes.toFixed(2)}€`} icon={<CreditCard className="w-5 h-5" />} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Agenda */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Agenda de Tutorías
            </h2>
            <div className="w-48">
              <Input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
              />
            </div>
          </div>

          {agenda.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              No hay tutorías programadas para esta fecha.
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {agenda.map((clase) => (
                <Card key={clase.id} className="p-4 hover:border-indigo-200 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-md font-mono text-sm">
                        {clase.hora_inicio} - {clase.hora_fin}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{clase.curso_nombre}</h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <UserIcon className="w-4 h-4 mr-1" />
                          <span>{clase.estudiante_nombre} (Alumno)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-gray-500">Tutor</p>
                        <p className="text-sm font-medium">{clase.tutor_nombre}</p>
                      </div>
                      <Badge variant={clase.estado === 'programada' ? 'warning' : 'success'}>
                        {clase.estado.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Tutor Summary */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Resumen por Tutor</h2>
          <Card className="divide-y divide-gray-100">
            {resumen.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">No hay actividad hoy.</div>
            ) : (
              resumen.map((r, i) => (
                <div key={i} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">{r.tutor_nombre}</span>
                    <Badge variant="default">{r.total_clases} clases</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 truncate">
                      <span className="font-semibold">Cursos:</span> {r.cursos || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      <span className="font-semibold">Alumnos:</span> {r.estudiantes || 'N/A'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
