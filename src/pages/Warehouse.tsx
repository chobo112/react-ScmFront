import { FC, useState } from "react";
import { createContext } from "react";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { StorageMain } from "../component/page/Storage/StorageMain/StorageMain";
import { StorageSearch } from "../component/page/Storage/StorageSearch/StorageSearch";

//전역적으로 상태를 공유하기 위해 사용되는 Context 객체를 생성합니다. 
interface Context {
    searchKeyword : object;
    setSearchKeyword : (keyword: object) => void;
}

const defaultValue: Context = {
    searchKeyword: {},
    setSearchKeyword: () => {},
}

export const StorageContext = createContext(defaultValue);

export const StorageProvider : FC<{children : React.ReactNode | React.ReactNode[]}>=({children}) =>{
    const [searchKeyword, setSearchKeyword] = useState({});
    return <StorageContext.Provider value ={{searchKeyword, setSearchKeyword}}>{children}</StorageContext.Provider>
}

export const Warehouse = () => {
    return (
        <>
        <StorageProvider>
            <ContentBox>창고</ContentBox>
            <StorageSearch></StorageSearch>
            <StorageMain></StorageMain>
        </StorageProvider>
        </>
    )
}