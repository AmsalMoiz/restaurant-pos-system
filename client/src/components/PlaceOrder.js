import React from 'react';
import './placeOrder.css';

const desserts = [
  {
    name: "Nuage au Caramel",
    price: "$11",
    image: "nuageAuCaramel.jpg"
  },
  {
    name: "Tiramisu Noir",
    price: "$10",
    image: "tiramisuNoir.jpg"
  },
  {
    name: "Lime Zest Parfait",
    price: "$9",
    image: "limeZestParfait.jpg"
  },
  {
    name: "Layali Caramel",
    price: "$10",
    image: "layaliCaramel.jpg"
  },
  {
    name: "Cinnamon Velvet",
    price: "$10",
    image: "cinnamonVelvet.jpg"
  },
  {
    name: "Janna Fustuq",
    price: "$11",
    image: "jannaFustuq.jpg"
  },
  {
    name: "Ube Obsession",
    price: "$10",
    image: "ubeObsession.jpg"
  },
  {
    name: "Berry Blush",
    price: "$9",
    image: "berryBlush.jpg"
  },
  {
    name: "Velvet Royale",
    price: "$10",
    image: "velvetRoyale.jpg"
  },
  {
    name: "Emirati Gold Bar",
    price: "$11",
    image: "pistachioIceCream.jpg"
  },
  {
    name: "Dubai Chocolate – Sultan’s Jewels",
    price: "$11",
    image: "dubaiChocolate.jpg"
  },
  {
    name: "Lavande Noire",
    price: "$10",
    image: "lavandeNoire.jpg"
  },
  {
    name: "Nocturne aux Myrtilles",
    price: "$10",
    image: "blueberryNocturne.jpg"
  },
  {
    name: "Banoffee Bliss",
    price: "$9",
    image: "banofeeBliss.jpg"
  },
  {
    name: "Soleil au Citron",
    price: "$9",
    image: "lemonSunlight.jpg"
  },
  {
    name: "Maison Fraise",
    price: "$10",
    image: "strawberryDaydream.jpg"
  },
  {
    name: "Red Affair",
    price: "$9",
    image: "redVelvet.jpg"
  },
  {
    name: "Biscoff Royale",
    price: "$10",
    image: "biscoffRoyale.jpg"
  },
  {
    name: "Knafeh Lebneniyeh",
    price: "$11",
    image: "knefe.jpg"
  },
  {
    name: "Baklawa Ashta Bites",
    price: "$10",
    image: "baklawa.jpg"
  },
  {
    name: "Ekmek Kataifi",
    price: "$9",
    image: "ekmekKataifi.jpg"
  },
  {
    name: "Maamoul Trio",
    price: "$8",
    image: "maamoul.jpg"
  }
];

const PlaceOrder = () => {
  return (
    <div className="order-wrapper">
      <h1 className="order-title">Your Dessert Order</h1>

      <div className="order-list">
        {desserts.map((item, index) => (
          <div className="order-card" key={index}>
            <img src={`/images/${item.image}`} alt={item.name} />
            <div className="order-details">
              <h2>{item.name}</h2>
              <p>{item.price}</p>
              <input type="number" min="1" defaultValue="1" />
              <textarea placeholder="Notes (optional)" />
            </div>
          </div>
        ))}
      </div>

      <button className="confirm-btn">Confirm Order</button>
    </div>
  );
};

export default PlaceOrder;