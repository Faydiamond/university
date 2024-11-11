import z from 'zod'

const programSchema = z.object({
    program: z.string({
    invalid_type_error: 'El campo program es obligatorio',
        required_error: 'Por favor envie el campo program'
  })
})

export function validateProgram (input) {
  return programSchema.safeParse(input)
}

export function validatePartialProgram (input) {
  return programSchema.partial().safeParse(input)
}
