import z from 'zod'

const MateriaSchema = z.object({
    nombre : z.string({
        invalid_type_error: 'El campo nombre es obligatorio',
        required_error: 'Por favor envie el campo nombre'
    }),
    num_creditos : z.number().int().positive(),
    costo_credito:z.number().int().positive(),
    id_profesor :  z.number().int().positive()
})

export function validateMateria (input) {
  return MateriaSchema.safeParse(input)
}

export function validatePartialMateria(input) {
  return MateriaSchema.partial().safeParse(input)
}
