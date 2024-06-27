import Card from "./shared/Card";
import { useContext } from "react";
import EcomContext from "../context/EcomContext";
import AuthContext from "../context/AuthContext"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Featured() {
  const {featured, addToCart} = useContext(EcomContext)
  const [state, dispatch] = useContext(AuthContext)
  const isAuthenticated = state.accessToken !== null
  const redirect = useNavigate()

  const login = ()=>{
    if (!isAuthenticated) {
      redirect("/login")
    }
  }

  return (
    <div className="my-[20px] mx-[30px]">
      <h1 className="mb-[10px] text-orange-500 font-bold text-2xl">
        Featured Products
      </h1>
      <div className="flex gap-5 flex-wrap">
        {featured.map((item) => (
          <Card key={item._id}>
            <Link to={`/detail/${item._id}`}><img src={"https://technotronix-api-qav1.onrender.com/" + item.img} alt="" className="h-[200px]" /></Link>
            <p className="font-bold">{item.name}</p>
            <p>₦{item.price}</p>
            <button onClick={isAuthenticated ? ()=> addToCart(item._id) : login} className="inline-block rounded bg-orange-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-orange-400 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-orange-400 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-orange-400 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
              Add to cart
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Featured;
