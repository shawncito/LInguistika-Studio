
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Tutor } from '../types';
import { Button, Card, Badge, Input, Label, Select } from '../components/UI';
import { Plus, Edit, Trash2, Mail, Phone, DollarSign } from 'lucide-react';

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

  if (loading) return <div>Cargando tutores...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Tutores</h1>
          <p className="text-gray-500">Administra el profesorado de la academia.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Tutor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutores.map((tutor) => (
          <Card key={tutor.id} className="p-6 relative group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{tutor.nombre}</h3>
                <Badge variant="default">{tutor.especialidad}</Badge>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(tutor)} className="p-1 text-gray-400 hover:text-indigo-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(tutor.id)} className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                {tutor.email}
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                {tutor.telefono}
              </div>
              <div className="flex items-center font-semibold text-gray-900 pt-2 border-t border-gray-50 mt-4">
                <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                {tutor.tarifa_por_hora.toFixed(2)}€ / hora
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Tutor' : 'Nuevo Tutor'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nombre Completo *</Label>
                <Input 
                  value={formData.nombre} 
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                  placeholder="Ej: Ana García" 
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  placeholder="ana@ejemplo.com" 
                />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input 
                  value={formData.telefono} 
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})} 
                  placeholder="600 000 000" 
                />
              </div>
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
                  <option>Chino</option>
                </Select>
              </div>
              <div>
                <Label>Tarifa por hora (€) *</Label>
                <Input 
                  type="number" 
                  value={formData.tarifa_por_hora} 
                  onChange={(e) => setFormData({...formData, tarifa_por_hora: parseFloat(e.target.value)})} 
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {editingId ? 'Actualizar' : 'Guardar'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Tutores;
