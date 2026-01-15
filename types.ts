
export enum Nivel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

export enum EstadoPago {
  PENDIENTE = 'pendiente',
  PAGADO = 'pagado'
}

export enum EstadoClase {
  PROGRAMADA = 'programada',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada'
}

export interface Tutor {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  tarifa_por_hora: number;
  estado: number;
  created_at: string;
}

export interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  nivel: Nivel;
  max_estudiantes: number;
  estado: number;
  created_at: string;
}

export interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  fecha_inscripcion: string;
  estado: number;
  created_at: string;
}

export interface Matricula {
  id: number;
  estudiante_id: number;
  curso_id: number;
  tutor_id: number;
  fecha_inscripcion: string;
  estado: number;
  created_at: string;
  // Joined fields
  estudiante_nombre?: string;
  curso_nombre?: string;
  tutor_nombre?: string;
  tarifa_por_hora?: number;
}

export interface Clase {
  id: number;
  matricula_id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: EstadoClase;
  notas: string;
  created_at: string;
  // Joined fields
  estudiante_nombre?: string;
  tutor_nombre?: string;
  curso_nombre?: string;
  tarifa_por_hora?: number;
}

export interface Pago {
  id: number;
  tutor_id: number;
  clase_id?: number;
  cantidad_clases?: number;
  monto: number;
  fecha_pago: string;
  estado: EstadoPago;
  descripcion: string;
  created_at: string;
  // Joined fields
  tutor_nombre?: string;
  tutor_email?: string;
}

export interface Stats {
  tutores_activos: number;
  estudiantes_activos: number;
  cursos_activos: number;
  matriculas_activas: number;
  total_clases: number;
  ingresos_pendientes: number;
}
