
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Matricula, Tutor, Curso, Estudiante } from '../types';
import { Button, Card, Select, Label } from '../components/UI';
import { Plus, XCircle, AlertCircle } from 'lucide-react';

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

  if (loading) return <div>Cargando matrículas...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Matrículas e Inscripciones</h1>
          <p className="text-gray-500">Relación de alumnos, cursos y tutores asignados.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Matrícula
        </Button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Estudiante</th>
              <th className="px-6 py-4 font-semibold">Curso</th>
              <th className="px-6 py-4 font-semibold">Tutor</th>
              <th className="px-6 py-4 font-semibold">Fecha Inscripción</th>
              <th className="px-6 py-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {matriculas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No hay matrículas activas.</td>
              </tr>
            ) : (
              matriculas.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{m.estudiante_nombre}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{m.curso_nombre}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{m.tutor_nombre}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(m.fecha_inscripcion).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleCancel(m.id)} 
                      className="text-red-400 hover:text-red-600 flex items-center justify-end w-full"
                    >
                      <XCircle className="w-5 h-5 mr-1" />
                      <span className="text-sm">Cancelar</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Nueva Matrícula</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Seleccionar Estudiante *</Label>
                <Select 
                  value={formData.estudiante_id} 
                  onChange={(e) => setFormData({...formData, estudiante_id: parseInt(e.target.value)})}
                >
                  <option value={0}>Selecciona un alumno...</option>
                  {estudiantes.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </Select>
              </div>
              <div>
                <Label>Seleccionar Curso *</Label>
                <Select 
                  value={formData.curso_id} 
                  onChange={(e) => setFormData({...formData, curso_id: parseInt(e.target.value)})}
                >
                  <option value={0}>Selecciona un curso...</option>
                  {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} ({c.nivel})</option>)}
                </Select>
              </div>
              <div>
                <Label>Asignar Tutor *</Label>
                <Select 
                  value={formData.tutor_id} 
                  onChange={(e) => setFormData({...formData, tutor_id: parseInt(e.target.value)})}
                >
                  <option value={0}>Selecciona un tutor...</option>
                  {tutores.map(t => <option key={t.id} value={t.id}>{t.nombre} - {t.especialidad}</option>)}
                </Select>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg flex items-start text-blue-800 text-xs">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Al crear la matrícula se formaliza el vínculo entre el alumno y el tutor para el curso seleccionado.</span>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                  Cerrar
                </Button>
                <Button type="submit" className="flex-1">
                  Matricular
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
