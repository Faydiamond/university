import z from 'zod'

const citySchema = z.object({
    ciudad: z.string({
    invalid_type_error: 'El campo ciudad es obligatorio',
        required_error: 'Por favor envie el campo ciudad'
  })
})

export function validateCity (input) {
  return citySchema.safeParse(input)
}

export function validatePartialCity (input) {
  return citySchema.partial().safeParse(input)
}
