import { ViewTeacherModel } from '../models/mysql/viewTeacher.js';
export class ViewTeacherController {

    static async getAll(req, res) {
        const { teacher,lastname } = req.query
        const citys = await ViewTeacherModel.getAll({ teacher,lastname })
        res.json(citys)

    }

}
