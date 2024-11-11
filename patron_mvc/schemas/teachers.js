import z from 'zod'

const teacherSchema = z.object({
    //id_estudiante : z.number().int(),
    nombre : z.string({
        invalid_type_error: 'El campo nombre es obligatorio',
        required_error: 'Por favor envie el campo nombre'
    }),
    apellido : z.string({
        invalid_type_error: 'El campo apellido es obligatorio',
        required_error: 'Por favor envie el campo apellido'
    }),
    fecha_nacimiento : z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha de nacimiento inválida (formato AAAA-MM-DD)'),
    correo: z.string({
        invalid_type_error: 'El campo correo electronico es obligatorio',
        required_error: 'Por favor envie el campo correo'
    }),
    clave : z.string({
        invalid_type_error: 'El campo clave es obligatorio',
        required_error: 'Por favor envie el campo clave'
    }),
    id_ciudad : z.number().int().positive(),
})

export function validateTeacher (input) {
  return teacherSchema.safeParse(input)
}

export function validatePartialTeacher(input) {
  return teacherSchema.partial().safeParse(input)
}
