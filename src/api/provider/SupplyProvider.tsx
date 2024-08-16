import { FC, ReactNode, useState } from "react";
import { createContext } from "react";

interface Context {
    searchKeyword : object;
    setSearchKeyword : (keyword: object) =>void;
}    

const defaultValue: Context = {
    searchKeyword: {},
    setSearchKeyword: () => {},
}

export const SupplyContext = createContext(defaultValue);

export const SupplyProvider : FC<{children : React.ReactNode | ReactNode[]}>=({children})=>{
    const [searchKeyword, setSearchKeyword] = useState({});
    return <SupplyContext.Provider value ={{searchKeyword, setSearchKeyword}}>{children}</SupplyContext.Provider>
}