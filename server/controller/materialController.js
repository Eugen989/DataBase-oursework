const ApiError = require("../errors/ApiError");
const {Reviews, Material} = require("../models/models")

class MaterialController {

    async create(req, res, next) {
        try {
            const {metal, probe} = req.body;

            if(!metal || !probe) {
                return next(ApiError.badRequest("Не все поля в Materials заполнены"));
            }

            const newItem = await Material.create({metal, probe}); 

            return res.json(newItem);
        }
        catch (e) {
            console.log(e);
            next(ApiError.badRequest(e.message));
        }
    }


    async getAll(req, res) {
        const allItems = await Material.findAll();
        
        // return res.json({message: "All ok in Material"});
        return res.json(allItems);
    }


    async getOne(req, res) {
        const id = req.params.id;

        const oneItems = await Material.findOne({where: {id}});

        res.json(oneItems);
    }

    async deleteById(req, res) {
        const id = req.params.id;
        const items = await Material.delete({id});

        res.json(items.rows[0]);
    }

}

module.exports = new MaterialController();