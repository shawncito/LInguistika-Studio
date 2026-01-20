import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Curso } from '../types';
import { 
  Button, Card, CardHeader, CardTitle, CardDescription, 
  Badge, Input, Label, Select, Dialog
} from '../components/UI';
import { Plus, Edit, Trash2, BookOpen, Users as UsersIcon, Clock } from 'lucide-react';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const NIVELES = ['None', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const TURNOS = ['Tarde', 'Noche'];

const Cursos: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    nivel: 'None',
    tipo_clase: 'grupal', // 'grupal' o 'tutoria'
    max_estudiantes: 10,
    dias: [] as string[],
    turno: ''
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
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'Nombre requerido';
    if (formData.dias.length === 0) newErrors.dias = 'Selecciona al menos un día';
    if (!formData.turno) newErrors.turno = 'Selecciona un turno';
    if (formData.tipo_clase === 'grupal' && formData.max_estudiantes <= 0) {
      newErrors.max_estudiantes = 'Límite debe ser mayor a 0 para cursos grupales';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const dataToSubmit = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        nivel: formData.nivel,
        tipo_clase: formData.tipo_clase,
        max_estudiantes: formData.tipo_clase === 'tutoria' ? null : formData.max_estudiantes,
        dias: formData.dias,
        turno: formData.turno
      };

      if (editingId) {
        await api.cursos.update(editingId, dataToSubmit);
      } else {
        await api.cursos.create(dataToSubmit);
      }

      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      setErrors({ submit: 'Error al guardar curso' });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      nombre: '',
      descripcion: '',
      nivel: 'None',
      tipo_clase: 'grupal',
      max_estudiantes: 10,
      dias: [],
      turno: ''
    });
    setErrors({});
  };

  const handleEdit = (curso: Curso) => {
    setEditingId(curso.id);
    setFormData({
      nombre: curso.nombre,
      descripcion: curso.descripcion || '',
      nivel: curso.nivel || 'None',
      tipo_clase: curso.tipo_clase || 'grupal',
      max_estudiantes: curso.max_estudiantes || 10,
      dias: Array.isArray(curso.dias) ? curso.dias : [],
      turno: curso.turno || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este curso?')) {
      await api.cursos.delete(id);
      loadData();
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Cargando cursos...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Catálogo de Cursos</h1>
          <p className="text-slate-500 font-medium mt-2">Programas académicos y niveles</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          variant="primary"
          className="h-12 px-8 gap-3 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-5 h-5" />
          Nuevo Curso
        </Button>
      </header>

      {/* Modal de Formulario */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <CardHeader className="border-b border-slate-200">
              <CardTitle>{editingId ? 'Editar Curso' : 'Nuevo Curso'}</CardTitle>
              <CardDescription>Configura los detalles del programa académico</CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Nombre */}
              <div>
                <Label>Nombre del Curso *</Label>
                <Input
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Ej: Inglés Avanzado"
                  className={errors.nombre ? 'border-red-500' : ''}
                />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
              </div>

              {/* Descripción */}
              <div>
                <Label>Descripción</Label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Descripción del curso..."
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                  rows={3}
                />
              </div>

              {/* Nivel y Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nivel *</Label>
                  <Select value={formData.nivel} onChange={(e) => setFormData(prev => ({ ...prev, nivel: e.target.value }))}>
                    {NIVELES.map(nivel => (
                      <option key={nivel} value={nivel}>{nivel}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Tipo de Clase *</Label>
                  <Select 
                    value={formData.tipo_clase} 
                    onChange={(e) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        tipo_clase: e.target.value,
                        max_estudiantes: e.target.value === 'tutoria' ? 1 : 10
                      }));
                    }}
                  >
                    <option value="grupal">Grupal</option>
                    <option value="tutoria">Tutoría (Infinito)</option>
                  </Select>
                </div>
              </div>

              {/* Límite de Estudiantes */}
              {formData.tipo_clase === 'grupal' && (
                <div>
                  <Label>Límite de Estudiantes *</Label>
                  <Input
                    type="number"
                    value={formData.max_estudiantes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_estudiantes: parseInt(e.target.value) || 1 }))}
                    min="1"
                    max="50"
                    className={errors.max_estudiantes ? 'border-red-500' : ''}
                  />
                  {errors.max_estudiantes && <p className="text-red-500 text-sm mt-1">{errors.max_estudiantes}</p>}
                </div>
              )}

              {formData.tipo_clase === 'tutoria' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900">
                    ℹ️ Tutoría: Sin límite de estudiantes
                  </p>
                </div>
              )}

              {/* Días */}
              <div>
                <Label>Días Hábiles *</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {DIAS_SEMANA.map(dia => (
                    <label key={dia} className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-blue-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.dias.includes(dia)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, dias: [...prev.dias, dia] }));
                          } else {
                            setFormData(prev => ({ ...prev, dias: prev.dias.filter(d => d !== dia) }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm font-semibold text-slate-700">{dia.slice(0, 3)}</span>
                    </label>
                  ))}
                </div>
                {errors.dias && <p className="text-red-500 text-sm mt-2">{errors.dias}</p>}
              </div>

              {/* Turno */}
              <div>
                <Label>Turno *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {TURNOS.map(turno => (
                    <label key={turno} className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-blue-400 cursor-pointer"
                      style={{ borderColor: formData.turno === turno ? '#2563eb' : undefined }}>
                      <input
                        type="radio"
                        name="turno"
                        value={turno}
                        checked={formData.turno === turno}
                        onChange={(e) => setFormData(prev => ({ ...prev, turno: e.target.value }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-semibold text-slate-900">{turno}</span>
                    </label>
                  ))}
                </div>
                {errors.turno && <p className="text-red-500 text-sm mt-2">{errors.turno}</p>}
              </div>

              {/* Botones */}
              <div className="flex gap-4 justify-end pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-8"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {editingId ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
              {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
            </form>
          </Card>
        </div>
      </Dialog>

      {/* Grid de Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {cursos.map((curso) => (
          <Card key={curso.id} className="group relative overflow-hidden bg-white border-slate-200">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black shadow-inner">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-900">{curso.nombre}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="font-bold">{curso.nivel || 'None'}</Badge>
                      <Badge className={`${curso.tipo_clase === 'tutoria' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'} font-bold`}>
                        {curso.tipo_clase === 'tutoria' ? '1:1' : 'Grupal'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(curso)}
                    className="h-9 w-9 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(curso.id)}
                    className="h-9 w-9 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {curso.descripcion && (
              <div className="px-8 mb-4">
                <p className="text-sm text-slate-600">{curso.descripcion}</p>
              </div>
            )}

            <div className="px-8 space-y-4 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <UsersIcon className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold">
                    {curso.tipo_clase === 'tutoria' ? 'Sin límite' : `Máx: ${curso.max_estudiantes}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold">{curso.turno}</span>
                </div>
              </div>

              {Array.isArray(curso.dias) && curso.dias.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {curso.dias.map((dia) => (
                    <span key={dia} className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-1 rounded">
                      {dia.slice(0, 3)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Cursos;
