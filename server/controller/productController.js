    const ApiError = require("../errors/ApiError");
    const {Reviews, Product, Material, Gem, ProductGem} = require("../models/models")

    function findMaterialForId(materialItem, id) {
        for (let i = 0; i < materialItem.length; i++)
            if(materialItem[i].dataValues.id == id) return materialItem[i];
    }

    function findGemForId(gemItem, id) {
        for (let i = 0; i < materialItem.length; i++)
            if(gemItem[i].dataValues.id == id) return gemItem[i];
    }

    class ProductController {

        async create(req, res, next) {
            try {
                console.log(req.body);
                const {id, addData} = req.body;
                // const {metal, probe} = req.body;
                // const {brand, weight, productSize, cost} = req.body;
                // const {type, gemSize, purity} = req.body;

                console.log("addData -", addData);

                if(!addData.metal || !addData.probe) {
                    return next(ApiError.badRequest("Не все поля в Material заполнены"));
                }
                if(!addData.brand || !addData.weight || !addData.productSize || !addData.cost) {
                    return next(ApiError.badRequest("Не все поля в Products заполнены"));
                }

                let newMaterial = await Material.create({metal: addData.metal, probe: addData.probe}); 
                let newProduct = await Product.create({brand: addData.brand, weight: addData.weight, productSize: addData.productSize, cost: addData.cost, materialId: newMaterial.id });

                let newGem;
                let newProductGem;
                if(addData.type && addData.gemSize && addData.purity) {
                    newGem = await Gem.create({type: addData.type, gemSize: addData.gemSize, purity: addData.purity})
                    newProductGem = await ProductGem.create({productId: newProduct.id, gemId: newGem.id});
                }


                return res.json({newMaterial, newProduct, newGem, newProductGem});
                // return res.json({message: "all ok"});
            }
            catch (e) {
                console.log(e);
                next(ApiError.badRequest(e.message));
            }
        }


        async getAll(req, res) {
            const materialItem = await Material.findAll();
            const productItem = await Product.findAll();
            const gemItem = await Gem.findAll();
            const productGemItem = await ProductGem.findAll();

            let allItems = [];
            let isGem = false;
            for (let i = 0; i < productItem.length; i++) {
                isGem = false;
                for (let j = 0; j < productGemItem.length; j++) {
                    if(productItem[i].id == productGemItem[j].productId) {
                        let materialItemId = findMaterialForId(materialItem, productItem[i].dataValues.materialId);
                        let gemItemId = findMaterialForId(gemItem, productGemItem[j].dataValues.gemId);
                        allItems.push(
                        {
                            id: i,
                            productId: productItem[i].dataValues.id,
                            metal: materialItemId.dataValues.metal,
                            probe: materialItemId.dataValues.probe,
                            brand: productItem[i].dataValues.brand,
                            weight: productItem[i].dataValues.weight,
                            productSize: productItem[i].dataValues.productSize,
                            cost: productItem[i].dataValues.cost,
                            type: gemItemId.dataValues.type,
                            gemSize: gemItemId.dataValues.gemSize,
                            purity: gemItemId.dataValues.purity
                        });
                        isGem = true;
                    }
                }
                if (!isGem)
                {
                    let materialItemId = findMaterialForId(materialItem, productItem[i].dataValues.materialId);
                    allItems.push(
                        {
                            id: i,
                            productId: productItem[i].dataValues.id,
                            metal: materialItemId.dataValues.metal,
                            probe: materialItemId.dataValues.probe,
                            brand: productItem[i].dataValues.brand,
                            weight: productItem[i].dataValues.weight,
                            productSize: productItem[i].dataValues.productSize,
                            cost: productItem[i].dataValues.cost,
                            materialId: productItem[i].dataValues.materialId,
                        });
                }
                    
            }

            // allItems = {materialItem, productItem, gemItem, productGemItem};

            // return res.json({message: "All ok in Product"});
            return res.json(allItems);
        }


        async getOne(req, res) {
            const id = req.params.id;

            const oneItems = await Product.findOne({where: {id}});

            res.json(oneItems);
        }

        async updateById(req, res) {
            const {id, updatedData} = req.body;
            console.log(updatedData);
            
            let updatedGem = {
                type: updatedData.type,
                gemSize: updatedData.gemSize,
                purity: updatedData.purity,
            }
            let updatedMaterial = {
                metal: updatedData.metal,
                probe: updatedData.probe
            }
            let updatedProduct = {
                brand: updatedData.brand,
                weight: updatedData.weight,
                productSize: updatedData.productSize,
                cost: updatedData.cost,
                materialId: updatedData.materialId,
            }
            // const oneItem = await Product.findOne({where: {id}});
            // await oneItem.update(updatedData);

            let productItem = (await Product.findOne({where: {id}})).dataValues;
            let productGemItem = (await ProductGem.findOne({where: {productId: productItem.id}})).dataValues;
            // let gemItems = (await Gem.findOne({where: {id: productGemItem.gemId}})).dataValues;

            // for (let i = 0; i < productGemItems.length; i++) {
            //     gemItems.push(await Gem.findOne({where: {id: productGemItems[i].dataValues.gemId}}));
            //     await Gem.update({where: {id: productGemItems[i].dataValues.gemId}, });
            // }


            await Gem.update(updatedGem, {where: {id: productGemItem.gemId}});
            await Material.update(updatedMaterial, {where: {id: productItem.materialId}});
            await Product.update(updatedProduct, {where: {id}});

            console.log(updatedData)
            
            console.log("Update successful");
            res.json(updatedData);
        }

        async deleteById(req, res) {
            const {id} = req.body;
            // console.log(id);
            const deletedCount = await Product.destroy({where: {id}});

            console.log("Delete successful");
            res.json(deletedCount);
        }

    }

    module.exports = new ProductController();