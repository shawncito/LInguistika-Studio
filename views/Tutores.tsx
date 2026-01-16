
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Tutor } from '../types';
import { 
  Button, Card, CardHeader, CardTitle, CardDescription,
  Badge, Input, Label, Select, Dialog 
} from '../components/UI';
import { Plus, Edit, Trash2, Mail, Phone, Briefcase, Star, MoreVertical, Search } from 'lucide-react';

const Tutores: React.FC = () => {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    especialidad: 'Inglés',
    tarifa_por_hora: 0
  });

  const loadData = async () => {
    setLoading(true);
    const data = await api.tutores.getAll();
    setTutores(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.especialidad || formData.tarifa_por_hora <= 0) {
      alert('Por favor rellena los campos obligatorios.');
      return;
    }

    if (editingId) {
      await api.tutores.update(editingId, formData);
    } else {
      await api.tutores.create(formData);
    }
    
    setShowModal(false);
    setEditingId(null);
    setFormData({ nombre: '', email: '', telefono: '', especialidad: 'Inglés', tarifa_por_hora: 0 });
    loadData();
  };

  const handleEdit = (tutor: Tutor) => {
    setEditingId(tutor.id);
    setFormData({
      nombre: tutor.nombre,
      email: tutor.email,
      telefono: tutor.telefono,
      especialidad: tutor.especialidad,
      tarifa_por_hora: tutor.tarifa_por_hora
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este tutor?')) {
      await api.tutores.delete(id);
      loadData();
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Cargando docentes...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Especialistas Docentes</h1>
          <p className="text-slate-500 font-medium mt-2">Gestión de profesorado y honorarios</p>
        </div>
        <Button onClick={() => setShowModal(true)} variant="primary" className="h-12 px-8 gap-3">
          <Plus className="w-5 h-5" />
          Nuevo Docente
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {tutores.map((tutor) => (
          <Card key={tutor.id} className="group relative overflow-hidden bg-white border-slate-200">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <CardHeader className="pb-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-xl shadow-inner">
                    {tutor.nombre.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-900">{tutor.nombre}</CardTitle>
                    <Badge variant="secondary" className="mt-1 font-bold">{tutor.especialidad}</Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(tutor)} className="h-9 w-9">
                        <Edit className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(tutor.id)} className="h-9 w-9">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
              </div>
            </CardHeader>

            <div className="px-8 space-y-4 pb-8">
              <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tarifa/Hora</p>
                      <p className="text-xl font-black text-slate-900">{tutor.tarifa_por_hora.toFixed(2)}€</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-inner">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Estado</p>
                      <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200" />
                          <span className="text-xs font-black text-emerald-700">Activo</span>
                      </div>
                  </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span>{tutor.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span>{tutor.telefono || 'Sin registrar'}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog 
        isOpen={showModal} 
        onClose={() => { setShowModal(false); setEditingId(null); }}
        title={editingId ? 'Editar Docente' : 'Registrar Nuevo Especialista'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div>
              <Label>Nombre y Apellidos *</Label>
              <Input 
                value={formData.nombre} 
                onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                placeholder="Ej: Marc Dubois" 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>E-mail *</Label>
                <Input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  placeholder="ejemplo@ling.com" 
                />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input 
                  value={formData.telefono} 
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})} 
                  placeholder="+34 600 000 000" 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Especialidad *</Label>
                <Select 
                  value={formData.especialidad} 
                  onChange={(e) => setFormData({...formData, especialidad: e.target.value})}
                >
                  <option>Inglés</option>
                  <option>Francés</option>
                  <option>Alemán</option>
                  <option>Italiano</option>
                  <option>Japonés</option>
                  <option>Español (ELE)</option>
                </Select>
              </div>
              <div>
                <Label>Tarifa (€/h) *</Label>
                <Input 
                  type="number" 
                  value={formData.tarifa_por_hora} 
                  onChange={(e) => setFormData({...formData, tarifa_por_hora: parseFloat(e.target.value)})} 
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-6">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {editingId ? 'Actualizar' : 'Guardar Docente'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Tutores;
