import Card from "./shared/Card";
import { useContext } from "react";
import EcomContext from "../context/EcomContext";
import { Link } from "react-router-dom";

function TopSelling() {
  const { topSelling, addToCart } = useContext(EcomContext);

  return (
    <div className="my-[20px] mx-[30px]">
      <h1 className="mb-[10px] text-orange-500 font-bold text-2xl">
        Top Selling Products
      </h1>
      <div className="flex gap-5 flex-wrap">
        {topSelling.map((item) => (
          <Card key={item._id}>
            <Link to={`/detail/${item._id}`}>
              <img src={"http://localhost:3000/" + item.img} alt="" className="h-[200px]" />
            </Link>
            <p className="font-bold">{item.name}</p>
            <p>₦{item.price}</p>
            <button onClick={()=> addToCart({...item, quantity: 1})} className="bg-orange-500 text-white p-[10px] rounded mt-[10px]">
              Add to cart
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default TopSelling;
