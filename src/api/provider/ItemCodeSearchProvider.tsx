import { FC, useState } from "react";
import { createContext } from "react";

interface Context {
    searchKeyword : object;
    setSearchKeyword : (keyword: object) =>void;
}

const defaultValue : Context = {
    searchKeyword:{},
    setSearchKeyword:()=>{},
}

export const SearchItemCodeContext = createContext(defaultValue);

export const ItemCodeSearchProvider :FC<{children : React.ReactNode | React.ReactNode[] }> = ({children}) =>{
    const [searchKeyword, setSearchKeyword] = useState({});
    return <SearchItemCodeContext.Provider value = {{searchKeyword, setSearchKeyword}}>{children}</SearchItemCodeContext.Provider>
}