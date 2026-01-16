
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Matricula, Tutor, Curso, Estudiante } from '../types';
import { Button, Card, Select, Label, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from '../components/UI';
import { Plus, XCircle, AlertCircle, Calendar, User, BookOpen, GraduationCap } from 'lucide-react';

const Matriculas: React.FC = () => {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    estudiante_id: 0,
    curso_id: 0,
    tutor_id: 0
  });

  const loadData = async () => {
    setLoading(true);
    const [m, e, c, t] = await Promise.all([
      api.matriculas.getAll(),
      api.estudiantes.getAll(),
      api.cursos.getAll(),
      api.tutores.getAll()
    ]);
    setMatriculas(m);
    setEstudiantes(e);
    setCursos(c);
    setTutores(t);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.estudiante_id || !formData.curso_id || !formData.tutor_id) {
      return alert('Selecciona todos los campos obligatorios.');
    }

    await api.matriculas.create(formData);
    setShowModal(false);
    setFormData({ estudiante_id: 0, curso_id: 0, tutor_id: 0 });
    loadData();
  };

  const handleCancel = async (id: number) => {
    if (window.confirm('¿Confirmas que deseas cancelar esta matrícula?')) {
      await api.matriculas.delete(id);
      loadData();
    }
  };

  if (loading) return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-400">Verificando inscripciones...</p>
      </div>
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-200 pb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Expediente de Matrículas</h1>
          <p className="text-slate-500 font-medium mt-2">Vínculos entre alumnos, cursos y docentes</p>
        </div>
        <Button onClick={() => setShowModal(true)} variant="primary" className="h-12 px-8 gap-3">
          <Plus className="w-5 h-5" />
          Nueva Matrícula
        </Button>
      </header>

      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead>Estudiante</TableHead>
            <TableHead>Curso Asignado</TableHead>
            <TableHead>Tutor Responsable</TableHead>
            <TableHead>Fecha Inscripción</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matriculas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-24 text-center text-slate-400 font-bold uppercase tracking-widest italic">No se registran matrículas activas</TableCell>
            </TableRow>
          ) : (
            matriculas.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900">{m.estudiante_nombre}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-slate-700">{m.curso_nombre}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                    <span className="text-slate-600 font-semibold">{m.tutor_nombre}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(m.fecha_inscripcion).toLocaleDateString('es-ES')}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleCancel(m.id)} 
                    className="gap-2 rounded-xl"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancelar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <Card className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border-none">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Formalizar Matrícula</h2>
                    <p className="text-sm text-slate-500 mt-1">Vincula alumnos a programas de estudio</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 rounded-full hover:bg-white border border-slate-200 text-slate-400 transition-all">
                    <XCircle className="w-6 h-6" />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-6">
                <div>
                  <Label>Seleccionar Alumno *</Label>
                  <Select 
                    value={formData.estudiante_id} 
                    onChange={(e) => setFormData({...formData, estudiante_id: parseInt(e.target.value)})}
                  >
                    <option value={0}>Buscar por nombre...</option>
                    {estudiantes.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                  </Select>
                </div>
                <div>
                  <Label>Programa de Estudio *</Label>
                  <Select 
                    value={formData.curso_id} 
                    onChange={(e) => setFormData({...formData, curso_id: parseInt(e.target.value)})}
                  >
                    <option value={0}>Selecciona un curso...</option>
                    {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} ({c.nivel})</option>)}
                  </Select>
                </div>
                <div>
                  <Label>Asignar Tutoría *</Label>
                  <Select 
                    value={formData.tutor_id} 
                    onChange={(e) => setFormData({...formData, tutor_id: parseInt(e.target.value)})}
                  >
                    <option value={0}>Elegir profesional docente...</option>
                    {tutores.map(t => <option key={t.id} value={t.id}>{t.nombre} - {t.especialidad}</option>)}
                  </Select>
                </div>
              </div>
              
              <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 flex items-start text-blue-700 text-xs leading-relaxed font-bold">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 text-blue-600" />
                <span>Esta acción formalizará el expediente del alumno y habilitará la programación de sesiones. Verifique que el docente tenga disponibilidad.</span>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="secondary" className="flex-1 rounded-2xl h-14" onClick={() => setShowModal(false)}>
                  Descartar
                </Button>
                <Button type="submit" variant="primary" className="flex-1 rounded-2xl h-14 font-black shadow-xl shadow-blue-100">
                  Matricular Alumno
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Matriculas;
