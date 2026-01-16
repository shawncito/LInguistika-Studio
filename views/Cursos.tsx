
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Curso, Nivel } from '../types';
import { 
  Button, Card, CardHeader, CardTitle, CardDescription, 
  Badge, Input, Label, Select, Dialog,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '../components/UI';
import { Plus, Edit, Trash2, BookOpen, Users as UsersIcon, GraduationCap } from 'lucide-react';

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

  if (loading) return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-400">Cargando catálogo educativo...</p>
      </div>
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-200 pb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Catálogo Académico</h1>
          <p className="text-slate-500 font-medium mt-2">Oferta de cursos e idiomas disponibles</p>
        </div>
        <Button onClick={() => setShowModal(true)} variant="primary" className="h-12 px-8 gap-3">
          <Plus className="w-5 h-5" />
          Nuevo Curso
        </Button>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Curso</TableHead>
            <TableHead>Nivel MCER</TableHead>
            <TableHead className="hidden lg:table-cell">Descripción</TableHead>
            <TableHead>Cupo Máx.</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cursos.map((curso) => (
            <TableRow key={curso.id}>
              <TableCell className="font-bold text-slate-900">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  {curso.nombre}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-extrabold px-4">{curso.nivel}</Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-slate-500 max-w-xs italic">
                {curso.descripcion || 'Sin detalles adicionales'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-slate-600 font-bold">
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  {curso.max_estudiantes} plazas
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(curso)} className="h-9 w-9">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(curso.id)} className="h-9 w-9">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog 
        isOpen={showModal} 
        onClose={() => { setShowModal(false); setEditingId(null); }}
        title={editingId ? 'Modificar Curso' : 'Añadir al Catálogo'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Título del Curso *</Label>
            <Input 
              value={formData.nombre} 
              onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
              placeholder="Ej: Preparación C1 Advanced" 
            />
          </div>
          <div>
            <Label>Breve Descripción</Label>
            <textarea 
              className="flex min-h-[100px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              placeholder="Objetivos del curso..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nivel Oficial</Label>
              <Select 
                value={formData.nivel} 
                onChange={(e) => setFormData({...formData, nivel: e.target.value as Nivel})}
              >
                {Object.values(Nivel).map(n => <option key={n} value={n}>{n}</option>)}
              </Select>
            </div>
            <div>
              <Label>Límite Alumnos</Label>
              <Input 
                type="number" 
                value={formData.max_estudiantes} 
                onChange={(e) => setFormData({...formData, max_estudiantes: parseInt(e.target.value)})} 
              />
            </div>
          </div>
          <div className="flex gap-4 pt-6">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
              Descartar
            </Button>
            <Button type="submit" variant="primary" className="flex-1 font-black shadow-lg shadow-blue-100">
              {editingId ? 'Guardar Cambios' : 'Registrar Curso'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Cursos;
