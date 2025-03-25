import React from 'react';
import './menu.css';

const desserts = [
  {
    name: "Nuage au Caramel",
    description: "Delicate layers of mascarpone caramel mousse, espresso-soaked ladyfingers, and whipped crème légère, crowned with artisanal caramel drizzle and a dusting of Valrhona cocoa. A sublime balance of airiness and indulgence.",
    image: "nuageAuCaramel.jpg",
    price: "$11"
  },
  {
    name: "Tiramisu Noir",
    description: "A decadent reinterpretation of the Italian classic, layered with espresso-soaked cocoa sponge, velvety mascarpone cream, and rich chocolate mousse. Finished with dark cocoa powder and shaved chocolate curls over a pool of espresso ganache. Bold, elegant, and unforgettable.",
    image: "tiramisuNoir.jpg",
    price: "$10"
  },
  {
    name: "Lime Zest Parfait",
    description: "A refreshing medley of tangy key lime curd, velvety whipped cream, and graham cracker crumble, layered with a hint of matcha and citrus mousse. Crowned with a swirl of lime-infused whipped topping and garnished with a fresh lime wheel.",
    image: "limeZestParfait.jpg",
    price: "$9"
  },
  {
    name: "Layali Caramel",
    description: "Translating to \"Caramel Nights,\" this dessert blends the classic French flan with a scoop of artisan vanilla ice cream, draped in golden caramel syrup. A smooth and dreamy indulgence served chilled.",
    image: "layaliCaramel.jpg",
    price: "$10"
  },
  {
    name: "Cinnamon Velvet",
    description: "A spiced twist on the classic cheesecake — smooth vanilla cream cheese filling over a buttery graham crust, crowned with a delicate cinnamon swirl and dusted with warm spice. Soft, creamy, and just the right touch of cozy sophistication.",
    image: "cinnamonVelvet.jpg",
    price: "$10"
  },
  {
    name: "Janna Fustuq",
    description: "A soft pistachio cheesecake layered with biscuit and topped with hand-selected whole nuts. A silky green bite of heaven.",
    image: "jannaFustuq.jpg",
    price: "$11"
  },
  {
    name: "Ube Obsession",
    description: "A striking layered creation of ube cream, vanilla mousse, and dark cocoa crumble, finished with a silky ube ganache and topped with purple velvet cake bites.",
    image: "ubeObsession.jpg",
    price: "$10"
  },
  {
    name: "Berry Blush",
    description: "A creamy trio of raspberry sponge, fluffy pink mousse, and crisp biscuit crust, topped with whipped cream and juicy raspberries. Pretty in pink and bursting with fresh flavor.",
    image: "berryBlush.jpg",
    price: "$9"
  },
  {
    name: "Velvet Royale",
    description: "A sultry fusion of red velvet cake and vanilla cheesecake on a dark chocolate crust, draped in cherry glaze and crowned with whipped cream, maraschino cherry, and mini chocolate Oreo cookies.",
    image: "velvetRoyale.jpg",
    price: "$10"
  },
  {
    name: "Emirati Gold Bar",
    description: "Luxe pistachio gelato enrobed in a rich Belgian chocolate shell, elegantly drizzled with pistachio ganache and sprinkled with crushed roasted nuts. Bold, creamy, and made to impress.",
    image: "pistachioIceCream.jpg",
    price: "$11"
  },
  {
    name: "Dubai Chocolate – Sultan’s Jewels",
    description: "A luxurious fusion of crunchy knafeh and creamy pistachio nestled inside handcrafted milk chocolate bars. Finished with elegant marbling and a glossy gold touch.",
    image: "dubaiChocolate.jpg",
    price: "$11"
  },
  {
    name: "Lavande Noire",
    description: "Blackberry lavender cheesecake layered over a buttery crumble base and finished with fresh blackberries and edible lavender blossoms.",
    image: "lavandeNoire.jpg",
    price: "$10"
  },
  {
    name: "Nocturne aux Myrtilles",
    description: "An elegant trio of lavender cream, dark sponge, and wild berry glaze, finished with fresh fruit and edible florals. A mysterious and graceful dessert, made for nightfall.",
    image: "blueberryNocturne.jpg",
    price: "$10"
  },
  {
    name: "Banoffee Bliss",
    description: "A velvety vanilla cheesecake on a golden graham crust, crowned with fresh banana slices, toasted walnuts, and a cascade of silky caramel.",
    image: "banofeeBliss.jpg",
    price: "$9"
  },
  {
    name: "Soleil au Citron",
    description: "Smooth lemon-infused cream set on a golden crumble base, crowned with lemon glaze and fresh slices.",
    image: "lemonSunlight.jpg",
    price: "$9"
  },
  {
    name: "Maison Fraise",
    description: "Golden shortcake biscuits stacked with whipped cream and sun-ripened strawberries, finished with a delicate drizzle of strawberry glaze.",
    image: "strawberryDaydream.jpg",
    price: "$10"
  },
  {
    name: "Red Affair",
    description: "Rich, velvety layers of cocoa-kissed crimson cake, sandwiched with whipped cream cheese frosting and topped with fresh strawberries.",
    image: "redVelvet.jpg",
    price: "$9"
  },
  {
    name: "Biscoff Royale",
    description: "A velvety cheesecake set over a buttery Biscoff cookie crust, layered with creamy spiced cookie butter and topped with a signature Lotus biscuit.",
    image: "biscoffRoyale.jpg",
    price: "$10"
  },
  {
    name: "Knafeh Lebneniyeh",
    description: "A smooth Lebanese knafeh made with buttery golden semolina and filled with luscious ashta cream, soaked in aromatic rose and orange blossom syrup.",
    image: "knefe.jpg",
    price: "$11"
  },
  {
    name: "Baklawa Ashta Bites",
    description: "Crisp, buttery layers of golden phyllo pastry filled with rich ashta cream, drizzled in orange blossom honey and sprinkled with crushed pistachios.",
    image: "baklawa.jpg",
    price: "$10"
  },
  {
    name: "Ekmek Kataifi",
    description: "A traditional Mediterranean layered dessert with syrup-soaked kataifi, velvety cream custard, whipped topping, and crushed pistachios.",
    image: "ekmekKataifi.jpg",
    price: "$9"
  },
  {
    name: "Maamoul Trio",
    description: "Handcrafted semolina shortbread cookies filled with your choice of dates, pistachios, or walnuts. A traditional Arab treat served with coffee or joy.",
    image: "maamoul.jpg",
    price: "$8"
  }
];

const Menu = () => {
  return (

<div
  className="menu-background"
  style={{ backgroundImage: "url('/images/restomainpic.jpg')" }}
>
      <div className="menu-overlay">
        <h1 className="menu-title">Our Signature Desserts</h1>
        <div className="dessert-grid">
          {desserts.map((item, index) => (
            <div className="dessert-card" key={index}>
              <img src={`/images/${item.image}`} alt={item.name} className="dessert-img" />
              <h2 className="dessert-name">{item.name}</h2>
              <p className="dessert-description">{item.description}</p>
              <p className="dessert-price">{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;