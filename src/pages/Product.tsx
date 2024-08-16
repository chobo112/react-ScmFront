
import { createContext, FC, useState } from "react";
import { ContentBox } from "../component/common/ContentBox/ContentBox"
import { ItemMain } from "../component/page/Item/ItemMain/ItemMain"
import { ItemSearch } from "../component/page/Item/ItemSearch/ItemSearch"


// Context의 타입 정의
interface Context {
    itemCodeContext: string;
    setItemCodeContext: (item_code: string) => void; // 함수로 타입 정의
}

// Context의 기본값 설정
const defaultValue: Context = {
    itemCodeContext: '',
    setItemCodeContext: () => {}, // 빈 함수로 기본값 설정
};

// Context 생성
export const ItemContext = createContext<Context>(defaultValue);

// Context Provider 정의
export const ItemCodeProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
    const [itemCodeContext, setItemCodeContext] = useState<string>(''); // 문자열로 초기화

    return (
        <ItemContext.Provider value={{ itemCodeContext, setItemCodeContext }}>
            {children}
        </ItemContext.Provider>
    );
};


export const Product = () => {
    return(
        <>

        <ContentBox>제품</ContentBox>
        <ItemSearch></ItemSearch>
        <ItemMain></ItemMain>
        
        </>
    )
}