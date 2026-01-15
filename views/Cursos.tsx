
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Curso, Nivel } from '../types';
import { Button, Card, Badge, Input, Label, Select } from '../components/UI';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Cursos: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    nivel: Nivel.A1,
    max_estudiantes: 10
  });

  const loadData = async () => {
    setLoading(true);
    const data = await api.cursos.getAll();
    setCursos(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre) return alert('El nombre es obligatorio.');

    if (editingId) {
      await api.cursos.update(editingId, formData);
    } else {
      await api.cursos.create(formData);
    }
    
    setShowModal(false);
    setEditingId(null);
    setFormData({ nombre: '', descripcion: '', nivel: Nivel.A1, max_estudiantes: 10 });
    loadData();
  };

  const handleEdit = (curso: Curso) => {
    setEditingId(curso.id);
    setFormData({
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      nivel: curso.nivel,
      max_estudiantes: curso.max_estudiantes
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Deseas eliminar este curso?')) {
      await api.cursos.delete(id);
      loadData();
    }
  };

  if (loading) return <div>Cargando cursos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogo de Cursos</h1>
          <p className="text-gray-500">Gestiona la oferta académica.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Curso
        </Button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Nombre</th>
              <th className="px-6 py-4 font-semibold">Nivel</th>
              <th className="px-6 py-4 font-semibold">Descripción</th>
              <th className="px-6 py-4 font-semibold">Capacidad</th>
              <th className="px-6 py-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cursos.map((curso) => (
              <tr key={curso.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{curso.nombre}</td>
                <td className="px-6 py-4">
                  <Badge variant="warning">{curso.nivel}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{curso.descripcion}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{curso.max_estudiantes} estudiantes</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => handleEdit(curso)} className="text-gray-400 hover:text-indigo-600">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(curso.id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Curso' : 'Nuevo Curso'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nombre del Curso *</Label>
                <Input 
                  value={formData.nombre} 
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                  placeholder="Ej: Inglés Básico A1" 
                />
              </div>
              <div>
                <Label>Descripción</Label>
                <textarea 
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all h-24"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  placeholder="Breve resumen del contenido..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nivel</Label>
                  <Select 
                    value={formData.nivel} 
                    onChange={(e) => setFormData({...formData, nivel: e.target.value as Nivel})}
                  >
                    {Object.values(Nivel).map(n => <option key={n} value={n}>{n}</option>)}
                  </Select>
                </div>
                <div>
                  <Label>Máx. Estudiantes</Label>
                  <Input 
                    type="number" 
                    value={formData.max_estudiantes} 
                    onChange={(e) => setFormData({...formData, max_estudiantes: parseInt(e.target.value)})} 
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Guardar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Cursos;
