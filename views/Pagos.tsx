
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Pago, Tutor, EstadoPago } from '../types';
import { Button, Card, Badge, Input, Label, Select } from '../components/UI';
import { CreditCard, Filter, History, Search } from 'lucide-react';

const Pagos: React.FC = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTutor, setFilterTutor] = useState<string>('all');
  
  const [formData, setFormData] = useState({
    tutor_id: 0,
    monto: 0,
    descripcion: '',
    estado: EstadoPago.PAGADO
  });

  const loadData = async () => {
    setLoading(true);
    const [p, t] = await Promise.all([
      api.pagos.getAll(),
      api.tutores.getAll()
    ]);
    setPagos(p);
    setTutores(t);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tutor_id || formData.monto <= 0) {
      return alert('Datos de pago inválidos.');
    }

    await api.pagos.create(formData);
    setFormData({ tutor_id: 0, monto: 0, descripcion: '', estado: EstadoPago.PAGADO });
    alert('Pago registrado correctamente.');
    loadData();
  };

  const filteredPagos = filterTutor === 'all' 
    ? pagos 
    : pagos.filter(p => p.tutor_id === parseInt(filterTutor));

  const totalFiltered = filteredPagos.reduce((acc, curr) => acc + curr.monto, 0);

  if (loading) return <div>Cargando pagos...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pagos a Tutores</h1>
        <p className="text-gray-500">Administra las liquidaciones y pagos pendientes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <Card className="p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
            Registrar Pago Manual
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Tutor *</Label>
              <Select 
                value={formData.tutor_id} 
                onChange={(e) => setFormData({...formData, tutor_id: parseInt(e.target.value)})}
              >
                <option value={0}>Selecciona tutor...</option>
                {tutores.map(t => <option key={t.id} value={t.id}>{t.nombre} ({t.tarifa_por_hora}€/h)</option>)}
              </Select>
            </div>
            <div>
              <Label>Monto (€) *</Label>
              <Input 
                type="number" 
                step="0.01" 
                value={formData.monto} 
                onChange={(e) => setFormData({...formData, monto: parseFloat(e.target.value)})} 
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>Descripción / Notas</Label>
              <Input 
                value={formData.descripcion} 
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})} 
                placeholder="Ej: Liquidación quincena"
              />
            </div>
            <Button type="submit" className="w-full">
              Confirmar Pago
            </Button>
          </form>
        </Card>

        {/* Payment History and Filters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select 
                className="w-48"
                value={filterTutor} 
                onChange={(e) => setFilterTutor(e.target.value)}
              >
                <option value="all">Todos los tutores</option>
                {tutores.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </Select>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total filtrado</p>
              <p className="text-xl font-bold text-indigo-600">{totalFiltered.toFixed(2)}€</p>
            </div>
          </div>

          <Card className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="px-4 py-3 font-semibold">Tutor</th>
                  <th className="px-4 py-3 font-semibold text-center">Monto</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPagos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No hay registros de pagos para este criterio.</td>
                  </tr>
                ) : (
                  filteredPagos.map((p) => (
                    <tr key={p.id} className="text-sm hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium">{p.tutor_nombre}</p>
                        <p className="text-xs text-gray-400">{p.tutor_email}</p>
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-gray-900">
                        {p.monto.toFixed(2)}€
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={p.estado === EstadoPago.PAGADO ? 'success' : 'warning'}>
                          {p.estado.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(p.fecha_pago).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-4 py-3 text-gray-500 truncate max-w-[150px]">
                        {p.descripcion || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pagos;
