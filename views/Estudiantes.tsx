
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Estudiante } from '../types';
import { Button, Card, Input, Label } from '../components/UI';
import { Plus, Edit, Trash2, Mail, Phone, Calendar } from 'lucide-react';

const Estudiantes: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });

  const loadData = async () => {
    setLoading(true);
    const data = await api.estudiantes.getAll();
    setEstudiantes(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre) return alert('El nombre es obligatorio.');

    if (editingId) {
      await api.estudiantes.update(editingId, formData);
    } else {
      await api.estudiantes.create(formData);
    }
    
    setShowModal(false);
    setEditingId(null);
    setFormData({ nombre: '', email: '', telefono: '' });
    loadData();
  };

  const handleEdit = (est: Estudiante) => {
    setEditingId(est.id);
    setFormData({
      nombre: est.nombre,
      email: est.email,
      telefono: est.telefono
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Deseas eliminar este estudiante?')) {
      await api.estudiantes.delete(id);
      loadData();
    }
  };

  if (loading) return <div>Cargando estudiantes...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Estudiantes</h1>
          <p className="text-gray-500">Administra el alumnado.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Estudiante
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {estudiantes.map((est) => (
          <Card key={est.id} className="p-5 border-l-4 border-l-indigo-600">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">{est.nombre}</h3>
                <span className="text-xs text-gray-400">ID: #{est.id}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(est)} className="p-1 text-gray-400 hover:text-indigo-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(est.id)} className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Mail className="w-3.5 h-3.5 mr-2" />
                {est.email}
              </div>
              <div className="flex items-center">
                <Phone className="w-3.5 h-3.5 mr-2" />
                {est.telefono}
              </div>
              <div className="flex items-center text-xs text-gray-400 mt-4 pt-2 border-t border-gray-50">
                <Calendar className="w-3.5 h-3.5 mr-2" />
                Inscrito: {new Date(est.fecha_inscripcion).toLocaleDateString('es-ES')}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Estudiante' : 'Nuevo Estudiante'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nombre Completo *</Label>
                <Input 
                  value={formData.nombre} 
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                  placeholder="Ej: Juan Pérez" 
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  placeholder="juan@mail.com" 
                />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input 
                  value={formData.telefono} 
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})} 
                  placeholder="611 222 333" 
                />
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

export default Estudiantes;
