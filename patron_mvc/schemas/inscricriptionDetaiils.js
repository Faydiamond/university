import z from 'zod'


const inscriptionDetaillSchema = z.object({
    materia: z.string().min(5),
    num_creditos : z.number().int().positive(),
    costo_credito: z.number().int().positive(),
    nombre_profesor: z.string().min(5),
    apellido_profesor:z.string().min(5),
    nombre_estudiante: z.string().min(5),
    apellido_estudiante: z.string().min(5),
})

export function validateInscriptionDetaill (input) {
  return studentSchema.safeParse(input)
}

export function validatePartialInscriptionDetaill(input) {
  return studentSchema.partial().safeParse(input)
}
