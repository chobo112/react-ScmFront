import {  FC, ReactNode, useState } from "react";
import { createContext } from "react";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { SupplyMain } from "../component/page/Supply/SupplyMain/SupplyMain";
import { SupplySearch } from "../component/page/Supply/SupplySearch/SupplySearch";

//일단 다 기본적으로 공통 코드 기준으로 공부 하면서 만들기 
    //DB 확인 
    // /management/supplyList.do 납품업체 리스트 출력
    // /management/custProduct.do 납품업체 클릭했을 때 납품업체가 제공하는 제품 리스트 출력
    // /management/supplySearch.do 검색기능을 구현하는 API가 따로 존재함 ???? 그냥 이걸로 호출해도 상관은 없을 듯 
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
export const Supply = () =>{
    return(
        <>
            <SupplyProvider>
                <ContentBox>납품업체</ContentBox>
                <SupplySearch></SupplySearch>
                <SupplyMain></SupplyMain>
            </SupplyProvider>
        </>
    )
}    
   
