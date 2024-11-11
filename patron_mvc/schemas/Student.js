import z from 'zod'

const studentSchema = z.object({
    //id_estudiante : z.number().int(),
    nombre : z.string({
        invalid_type_error: 'El campo nombre es obligatorio',
        required_error: 'Por favor envie el campo nombre'
    }),
    apellido : z.string({
        invalid_type_error: 'El campo apellido es obligatorio',
        required_error: 'Por favor envie el campo apellido'
    }),
    direccion: z.string().min(8),
    correo_electronico: z.string({
        invalid_type_error: 'El campo correo electronico es obligatorio',
        required_error: 'Por favor envie el campo correo_electronico'
    }),
    clave : z.string({
        invalid_type_error: 'El campo clave es obligatorio',
        required_error: 'Por favor envie el campo clave'
    }),
    fecha_nacimiento : z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha de nacimiento inválida (formato AAAA-MM-DD)'),
    id_programa :  z.number().int().positive(),
    id_ciudad : z.number().int().positive(),
})

export function validateStudent (input) {
  return studentSchema.safeParse(input)
}

export function validatePartialStudent(input) {
  return studentSchema.partial().safeParse(input)
}
