import express, { json } from 'express' // require -> commonJS
import { studentRouter } from './routes/students.js';
import { inscriptionRouter } from './routes/inscriptions.js';
import { cityRouter } from './routes/citys.js';
import { teacherRouter } from './routes/teachers.js';
import { materiaRouter } from './routes/materias.js';
import { programRouter } from './routes/programs.js';
import { ViewTeacherRouter } from './routes/viewTeacher.js';
import { ViewStudentRouter } from './routes/viewStudent.js';
import { corsMiddleware } from './middlewares/cors.js';

const app = express()
app.use(json())
app.disable('x-powered-by')

//app.use('/movies', moviesRouter)
app.use('/students', studentRouter)
app.use('/inscriptions', inscriptionRouter)
app.use('/citys', cityRouter)
app.use('/teachers', teacherRouter)
app.use('/materias', materiaRouter)
app.use('/programas', programRouter)
app.use('/viewteachers', ViewTeacherRouter)
app.use('/viewStudent', ViewStudentRouter)

const PORT = process.env.PORT ?? 3005

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
