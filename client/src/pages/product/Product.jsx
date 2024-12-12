import React from "react";
import '../../components/styles/index.css';
import Gurman from "../../components/media/Gurman.jpg"
import Veterok from "../../components/media/Veterok.jpg"
import Aurora from "../../components/media/Aurora.jpg"
import East_fairytale from "../../components/media/East_fairytale.jpg"

let data = [
    {
        id: 1,
        name: "Кольцо",
        type: "Серебро",
        weight: "14",
        cost: 30000
    },
    {
        id: 2,
        name: "Цепочка",
        type: "Золото",
        weight: "19",
        cost: 30000
    }
]

function PrintJewlery(data) {
    return (
        <div class="list-products">
            {data.data.map(item => (
                <div class="list-products__product">
                    <div class="list-products__product__description-block">
                        <p>Номер товара: {item.id}</p>
                        <p>Тип: {item.name}</p>
                        <p>Металл: {item.type}</p>
                        <p>Вес: {item.weight}</p>
                        <p>Стоимость {item.cost}</p>
                        <button className="btn">Продать</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

function ProductList() {
    return (
        <section class="choose-restaurant list-restaurants-container">
            <PrintJewlery data={data} />
        </section>
    )
}

export default ProductList;