const ApiError = require("../errors/ApiError");
const {Reviews, SoldProduct} = require("../models/models")

class SoldProductController {

    async create(req, res, next) {
        try {
            const {timeAndDate, cost, discount, productId, employeeId} = req.body;

            if(!timeAndDate || !cost || !discount || !productId || !employeeId) {
                return next(ApiError.badRequest("Не все поля в SoldProducts заполнены"));
            }

            const newItem = await SoldProduct.create({timeAndDate, cost, discount, productId, employeeId}); 

            return res.json(newItem);
        }
        catch (e) {
            console.log(e);
            next(ApiError.badRequest(e.message));
        }
    }


    async getAll(req, res) {
        const allItems = await SoldProduct.findAll();
        
        // return res.json({message: "All ok in SoldProduct"});
        return res.json(allItems);
    }


    async getOne(req, res) {
        const id = req.params.id;

        const oneItems = await SoldProduct.findOne({where: {id}});

        res.json(oneItems);
    }

    async deleteById(req, res) {
        const id = req.params.id;
        const items = await SoldProduct.delete({id});

        res.json(items.rows[0]);
    }

}

module.exports = new SoldProductController();