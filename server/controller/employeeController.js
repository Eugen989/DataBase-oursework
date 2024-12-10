const ApiError = require("../errors/ApiError");
const {Reviews, Employee} = require("../models/models")

class EmployeeController {

    async create(req, res, next) {
        try {
            const {salary, fullName, birthday, position} = req.body;

            console.log("Employee data - ", {salary, fullName, birthday, position})

            if(!salary) return next(ApiError.badRequest("Не все заполнено поле salary"));
            else if(!fullName) return next(ApiError.badRequest("Не все заполнено поле fullName"));
            else if(!birthday) return next(ApiError.badRequest("Не все заполнено поле birthday"));
            else if(!position) return next(ApiError.badRequest("Не все заполнено поле position"));
            else if(!salary || !fullName || !birthday || !position) {
                return next(ApiError.badRequest("Не все поля в Employees заполнены"));
            }

            const newItem = await Employee.create({salary, fullName, birthday, position}); 

            return res.json(newItem);
        }
        catch (e) {
            console.log(e);
            next(ApiError.badRequest(e.message));
        }
    }


    async getAll(req, res) {
        const allItems = await Employee.findAll();
        
        // return res.json({message: "All ok"});
        return res.json(allItems);   
    }


    async getOne(req, res) {
        const id = req.params.id;

        const oneItems = await Employee.findOne({where: {id}});

        res.json(oneItems);
    }

    async deleteById(req, res) {
        const id = req.params.id;
        const items = await Employee.delete({id});

        res.json(items.rows[0]);
    }

}

module.exports = new EmployeeController();