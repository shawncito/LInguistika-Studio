
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Estudiante } from '../types';
import { Button, Card, CardHeader, CardTitle, Input, Label, Badge } from '../components/UI';
// Add missing 'X' import from lucide-react
import { Plus, Edit, Trash2, Mail, Phone, Calendar, UserPlus, X } from 'lucide-react';

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

  if (loading) return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-400">Cargando alumnado...</p>
      </div>
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Registro de Alumnos</h1>
          <p className="text-slate-500 font-medium mt-2">Base de datos de estudiantes matriculados</p>
        </div>
        <Button onClick={() => setShowModal(true)} variant="primary" className="h-12 px-8 gap-3">
          <UserPlus className="w-5 h-5" />
          Nuevo Estudiante
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {estudiantes.map((est) => (
          <Card key={est.id} className="group border-slate-200 bg-white hover:border-blue-400">
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-black text-lg">
                    {est.nombre.charAt(0)}
                </div>
                <div className="flex gap-1">
                    <button onClick={() => handleEdit(est)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(est.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                </div>

                <div className="space-y-1 mb-6">
                    <h3 className="text-lg font-bold text-slate-900">{est.nombre}</h3>
                    <Badge variant="secondary" className="font-extrabold">ID #{est.id}</Badge>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-50 text-sm font-medium">
                    <div className="flex items-center text-slate-600">
                        <Mail className="w-4 h-4 mr-3 text-blue-500" />
                        <span className="truncate">{est.email}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                        <Phone className="w-4 h-4 mr-3 text-blue-500" />
                        {est.telefono}
                    </div>
                    <div className="flex items-center text-xs font-bold text-slate-400 mt-6 pt-4 border-t border-slate-50">
                        <Calendar className="w-4 h-4 mr-3" />
                        Ingreso: {new Date(est.fecha_inscripcion).toLocaleDateString('es-ES')}
                    </div>
                </div>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-none animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900">{editingId ? 'Actualizar Ficha' : 'Nuevo Alumno'}</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <Label>Nombre Completo *</Label>
                <Input 
                  value={formData.nombre} 
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                  placeholder="Ej: Juan Pérez" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>
              <div className="flex gap-4 pt-6">
                <Button type="button" variant="secondary" className="flex-1 rounded-2xl h-12" onClick={() => setShowModal(false)}>
                  Cerrar
                </Button>
                <Button type="submit" variant="primary" className="flex-1 rounded-2xl h-12 font-black shadow-lg shadow-blue-100">
                  Guardar Estudiante
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
