import React, { useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import '../../components/styles/index.css';
import { backend_get_products, backend_get_sold_products, backend_sell_products } from "../../http/userApi";
import { Context } from "../..";
import { toJS } from "mobx";
import { PROFILE_ROUTE } from "../../utils/consts";
import { useNavigate } from "react-router-dom";

function PrintJewlery() {
    const navigate = useNavigate();
    const { user } = useContext(Context);

    const [filterProductId, setFilterProductId] = useState();
    const [filterProductBrand, setFilterProductBrand] = useState();
    const [filterProductMaterial, setFilterProductMaterial] = useState();
    const [filterProductWeight, setFilterProductWeight] = useState();
    const [filterProductGem, setFilterProductGem] = useState();
    const [filterProductPurity, setFilterProductPurity] = useState();
    const [filterProductCost, setFilterProductCost] = useState();

    const loadProducts = async () => {
        let data = await backend_get_products();
        let soldData = await backend_get_sold_products();
        console.log("soldData - ", soldData);
        if (soldData && data) {
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < soldData.length; j++) {
                    if (soldData[j].productId === data[i].productId) {
                        data.splice(i, 1);
                    }
                }
            }
            console.log("data -", data);
            user.setProduct(data);
        }
    }

    useEffect(() => {
        loadProducts();
        console.log(toJS(user.product));
    }, []);

    const sellProduct = async (item) => {
        console.log(item);
        console.log(jwtDecode(user.user).id);
        await backend_sell_products(item.productId, jwtDecode(user.user).id);
        await loadProducts();
        navigate(PROFILE_ROUTE);
    }

    function renderFilter({ value }){
        console.log(value);
        return (<div> {value} </div>)
    }

    return (
        <div>
            <div className="folter_container">
                <renderFilter value={filterProductId} />
                <input className="product__filter__input" placeholder="Номер" onChange={e => setFilterProductId(e.target.value)} />

                <renderFilter value={filterProductBrand} />
                <input className="product__filter__input" placeholder="Тип" onChange={e => setFilterProductBrand(e.target.value)} />

                <renderFilter value={filterProductMaterial} />
                <input className="product__filter__input" placeholder="Металл" onChange={e => setFilterProductMaterial(e.target.value)} />

                <renderFilter value={filterProductWeight} />
                <input className="product__filter__input" placeholder="Вес" onChange={e => setFilterProductWeight(e.target.value)} />

                <renderFilter value={filterProductGem} />
                <input className="product__filter__input" placeholder="Камень" onChange={e => setFilterProductGem(e.target.value)} />

                <renderFilter value={filterProductPurity} />
                <input className="product__filter__input" placeholder="Чистота" onChange={e => setFilterProductPurity(e.target.value)} />
                
                <renderFilter value={filterProductCost} />
                <input className="product__filter__input" placeholder="Стоимость" onChange={e => setFilterProductCost(e.target.value)} />
            </div>
            <div className="list-products">
                {Array.isArray(toJS(user.product)) && toJS(user.product).map(item => (
                    <div>
                        {(String(item.productId).indexOf(filterProductId) != -1 || !filterProductId) && 
                        (String(item.brand).indexOf(filterProductBrand) != -1 || !filterProductBrand) &&
                        (String(item.metal).indexOf(filterProductMaterial) != -1 || !filterProductMaterial) &&
                        (String(item.type).indexOf(filterProductGem) != -1 || !filterProductGem) &&
                        (String(item.weight).indexOf(filterProductWeight) != -1 || !filterProductWeight) &&
                        (String(item.purity).indexOf(filterProductPurity) != -1 || !filterProductPurity) &&
                        (String(item.cost).indexOf(filterProductCost) != -1 || !filterProductCost)
                        ? (
                        <div>
                            <div className="list-products__product" key={item.productId}>
                                <div className="list-products__product__description-block">
                                    <p>Номер товара: {item.productId}</p>
                                    <p>Тип: {item.brand}</p>
                                    <p>Металл: {item.metal}</p>
                                    <p>Вес: {item.weight}</p>
                                    {item.type ? (
                                        <div>
                                            <p>Камень: {item.type}</p>
                                            <p>Чистота: {item.purity}</p>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                    <p>Стоимость {item.cost}</p>
                                    <button className="btn" onClick={() => sellProduct(item)}>Продать</button>
                                </div>
                            </div>
                        </div>) : (<div> </div>)}
                    </div>
                ))}
            </div>
        </div>
        
    )
}

function ProductList() {
    return (
        <section className="choose-restaurant list-restaurants-container">
            <PrintJewlery />
        </section>
    )
}

export default ProductList;
