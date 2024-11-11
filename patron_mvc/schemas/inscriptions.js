import z from 'zod'

const inscriptionSchema = z.object({
    id_estudiante :  z.number().int().positive(),
    id_materia : z.number().int().positive(),
})

export function validateInscription (input) {
  return inscriptionSchema.safeParse(input)
}

export function validatePartialInscription(input) {
  return inscriptionSchema.partial().safeParse(input)
}
