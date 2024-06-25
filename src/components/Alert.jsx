import { useContext } from "react"
import EcomContext from "../context/EcomContext"

function Alert() {
    const {alertInfo} = useContext(EcomContext)

  return (
    <div>
        {alertInfo.show && <div className={`${alertInfo.type === "success" ? "bg-green-600" : "bg-red-600"} fixed top-[60px] z-[30] w-[30%] m-auto left-0 right-0 rounded text-center text-white p-[10px]`}>{alertInfo.message}</div>}
    </div>
  )
}

export default Alert