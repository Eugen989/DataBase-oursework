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
    const [test, setTest] = useState(1);

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

    function filterBrand({ value }) {
        return (
            <div>
                {value}
            </div>
        )
    }

    return (
        <div>
            <div>
                <filterBrand value={test} />
                {/* <input placeholder="Тип" onChange={e => setTest(e.target.value)} /> */}
            </div>
            <div className="list-products">
                {Array.isArray(toJS(user.product)) && toJS(user.product).map(item => (
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
