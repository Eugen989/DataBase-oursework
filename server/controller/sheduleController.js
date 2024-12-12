const ApiError = require("../errors/ApiError");
const {Reviews, Shedule, Employee} = require("../models/models")

class SheduleController {

    async create(req, res, next) {
        try {
            // const {data, workStart, workEnd, employeeId} = req.body;
            const {id, addData} = req.body;

            if(!addData.data || !addData.workStart || !addData.workEnd || !addData.employeeId) {
                return next(ApiError.badRequest("Не все поля в Shedules заполнены"));
            }

            const newItem = await Shedule.create({data: addData.data, workStart: addData.workStart, workEnd: addData.workEnd, employeeId: addData.employeeId}); 

            return res.json(newItem);
        }
        catch (e) {
            console.log(e);
            next(ApiError.badRequest(e.message));
        }
    }


    async getAll(req, res) {
        const allItems = await Shedule.findAll();
        
        // return res.json({message: "All ok in Shedule"});
        return res.json(allItems);
    }

    async getAllById(req, res) {
        const {id} = req.body;
        // const employeeItem = await Employee.findOne({where: {id}});
        const allItems = await Shedule.findAll({where: {employeeId: id}});
        
        // return res.json({message: "All ok in Shedule"});
        return res.json(allItems);
    }


    async getOne(req, res) {
        const id = req.params.id;

        const oneItems = await Shedule.findOne({where: {id}});

        res.json(oneItems);
    }

    async updateById(req, res) {
        const {id, updatedData} = req.body;
        console.log("This is updateById");
        console.log("update id data -", id);
        console.log("updatedData -", updatedData);
        
        let updatedShedule = {
            data: updatedData.data,
            workStart: updatedData.workStart,
            workEnd: updatedData.workEnd,
            employeeId: updatedData.employeeId,
        }


        await Shedule.update(updatedShedule, {where: {id}});

        console.log(updatedData)
        
        console.log("Update successful");
        res.json(updatedData);
    }

    async deleteById(req, res) {
        const {id} = req.body;
        console.log("delete id -", id)
        const deletedCount = await Shedule.destroy({where: {id}});

        console.log("Delete shedule successful");
        res.json(deletedCount);
    }

}

module.exports = new SheduleController();