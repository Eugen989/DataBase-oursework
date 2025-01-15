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
    const [filterProductMaxCost, setFilterProductMaxCost] = useState();
    const [filterProductMinCost, setFilterProductMinCost] = useState();

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

    const [image, setImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [result, setResult] = useState(null);

    const handleImageChange = (e) => {
        e.preventDefault();
        let file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(file);
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", image);

        try {
            const response = await fetch("http://localhost:8000/uploadfile/", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setResult(data.filename);

            let peopleMaxMoney, peopleMinMoney;

            if(result == 'White') {
                setFilterProductMaxCost(55000);
                setFilterProductMinCost(20000);
            }
            else if(result == 'Black') {
                setFilterProductMaxCost(12000);
                setFilterProductMinCost(5000);
            }

            else if(result == 'Indian') {
                setFilterProductMaxCost(60000);
                setFilterProductMinCost(30000);
            }

            else if(result == 'Asian') {
                setFilterProductMaxCost(40000);
                setFilterProductMinCost(12000);
            }

        } catch (error) {
            console.error("Ошибка при отправке изображения:", error);
        }
    };

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
                
                <renderFilter value={filterProductMaxCost} />
                <input className="product__filter__input" placeholder="Максимальная стоимость" onChange={e => setFilterProductMaxCost(e.target.value)} />

                <renderFilter value={filterProductMaxCost} />
                <input className="product__filter__input" placeholder="Минимальная стоимость" onChange={e => setFilterProductMinCost(e.target.value)} />
            </div>
            <div>

            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreviewUrl && (
                    <div>
                        <img src={imagePreviewUrl} style={{ width: '100px', height: 'auto', marginTop: '10px' }} />
                    </div>
                )}
                <button type="submit">Загрузить изображение</button>
            </form>
            {result && <p>Результат: {result}, Максимум денег - {filterProductMaxCost}, Минимум денег - {filterProductMinCost}</p>}

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
                        (!filterProductMinCost || Number(item.cost) > filterProductMinCost) &&
                        (!filterProductMaxCost || Number(item.cost) < filterProductMaxCost)
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
