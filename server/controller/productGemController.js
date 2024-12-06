const ApiError = require("../errors/ApiError");
const {Reviews, ProductGem} = require("../models/models")

class ProductGemController {

    async create(req, res, next) {
        try {
            const {productId, gemId} = req.body;

            if(!productId || !gemId) {
                return next(ApiError.badRequest("Не все поля в ProductGems заполнены"));
            }

            const newItem = await ProductGem.create({productId, gemId}); 

            return res.json(newItem);
        }
        catch (e) {
            console.log(e);
            next(ApiError.badRequest(e.message));
        }
    }


    async getAll(req, res) {
        const allItems = await ProductGem.findAll();
        
        // return res.json({message: "All ok in ProductGem"});
        return res.json(allItems);
    }


    async getOne(req, res) {
        const id = req.params.id;

        const oneItems = await ProductGem.findOne({where: {id}});

        res.json(oneItems);
    }

    async deleteById(req, res) {
        const id = req.params.id;
        const items = await ProductGem.delete({id});

        res.json(items.rows[0]);
    }

}

module.exports = new ProductGemController();