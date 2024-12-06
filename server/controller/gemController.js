const ApiError = require("../errors/ApiError");
const {Reviews, Gem} = require("../models/models")

class GemController {

    async create(req, res, next) {
        try {
            const {type, size, purity} = req.body;

            if(!type || !size || !purity) {
                return next(ApiError.badRequest("Не все поля в Gems заполнены"));
            }

            const newItem = await Gem.create({type, size, purity}); 

            return res.json(newItem);
        }
        catch (e) {
            console.log(e);
            next(ApiError.badRequest(e.message));
        }
    }


    async getAll(req, res) {
        const allItems = await Gem.findAll();
        
        // return res.json({message: "All ok in Gem"});
        return res.json(allItems);
    }


    async getOne(req, res) {
        const id = req.params.id;

        const oneItems = await Gem.findOne({where: {id}});

        res.json(oneItems);
    }

    async deleteById(req, res) {
        const id = req.params.id;
        const items = await Gem.delete({id});

        res.json(items.rows[0]);
    }

}

module.exports = new GemController();