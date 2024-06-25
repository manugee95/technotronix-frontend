const useLocalStorage = (key)=>{
    const setItem = (value)=>{
        localStorage.setItem(key, value)
    }

    const getItem = ()=>{
        return localStorage.getItem(key)
    }

    const deleteItem = ()=>{
        localStorage.removeItem(key)
    }

    return {setItem, getItem, deleteItem}
}

export default useLocalStorage