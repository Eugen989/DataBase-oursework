const ApiError = require("../errors/ApiError");
const {Reviews, Shedule} = require("../models/models")

class SheduleController {

    async create(req, res, next) {
        try {
            const {data, workStart, workEnd, employeeId} = req.body;

            if(!data || !workStart || !workEnd || !employeeId) {
                return next(ApiError.badRequest("Не все поля в Shedules заполнены"));
            }

            const newItem = await Shedule.create({data, workStart, workEnd, employeeId}); 

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


    async getOne(req, res) {
        const id = req.params.id;

        const oneItems = await Shedule.findOne({where: {id}});

        res.json(oneItems);
    }

    async deleteById(req, res) {
        const id = req.params.id;
        const items = await Shedule.delete({id});

        res.json(items.rows[0]);
    }

}

module.exports = new SheduleController();