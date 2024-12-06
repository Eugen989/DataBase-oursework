const ApiError = require("../errors/ApiError");
const {Reviews, Product} = require("../models/models")

class ProductController {

    async create(req, res, next) {
        try {
            const {brand, weight, size, cost, materialId} = req.body;

            if(!brand || !weight || !size || !cost || !materialId) {
                return next(ApiError.badRequest("Не все поля в Products заполнены"));
            }

            const newItem = await Product.create({brand, weight, size, cost, materialId}); 

            return res.json(newItem);
        }
        catch (e) {
            console.log(e);
            next(ApiError.badRequest(e.message));
        }
    }


    async getAll(req, res) {
        const allItems = await Product.findAll();
        
        // return res.json({message: "All ok in Product"});
        return res.json(allItems);
    }


    async getOne(req, res) {
        const id = req.params.id;

        const oneItems = await Product.findOne({where: {id}});

        res.json(oneItems);
    }

    async deleteById(req, res) {
        const id = req.params.id;
        const items = await Product.delete({id});

        res.json(items.rows[0]);
    }

}

module.exports = new ProductController();