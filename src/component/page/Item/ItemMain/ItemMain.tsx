import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { atom, useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { ItemModalStyled } from "../ItemModal/styled";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { Protal } from "../../../common/potal/Portal";
import { ItemModal } from "../ItemModal/ItemModal";
import { ItemCodeProvider } from "../../../../pages/Product";
import { Button } from "../../../common/Button/Button";
import { ItemStorage } from "../ItemStorage/ItemStorage";

export interface IItemList {
    item_code : string;
    item_name : string;
    manufac : string;
    provide_value : number;
    major_class : string; //file_name
    sub_class : string; //phsycal_path
    item_stand : string; //logical_path
    item_note : number; // file_size
    img_path : string; //file_ext
}

export interface IItemListJsonResponse {
    productList : IItemList[];
    productCnt : number;
}




export const modalState1 = atom<boolean>({
    key : 'modalState1',
    default : false,
})

export const ItemMain = () =>{
    const {search} =useLocation();
    const [productList , setProductList] = useState<IItemList[]>([]);
    const [productCnt, setProductCnt] =useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [modal1, setModal1] =useRecoilState<boolean>(modalState1);
    const [itemCode , setItemCode] = useState<string >('');
    const [currentParam, setCurrentParam] = useState<number | undefined>(1);
    useEffect(()=> {
        searchItemList();
    },[search]);

    
    const searchItemList = (cpage ? : number) =>{
        cpage = cpage || 1;
        const searchParam = new URLSearchParams(search);
        
        searchParam.append('cpage', cpage.toString());
        searchParam.append('pageSize','5');

        axios.post('/management/productSearch1.do', searchParam).then((res : AxiosResponse<IItemListJsonResponse>)=>{
            setProductList(res.data.productList);
            setProductCnt(res.data.productCnt);
            setCurrentParam(cpage);
        });
    };

    const handlerModal = (itemCode?: string) =>{
        setItemCode(itemCode || '');
        setModal(!modal);
    }

    const postSuccess = () => {
        setModal(!modal);
        searchItemList();
    }
    //창고에 넣기 하려면 recoil 하나 더 만들어야 할듯 .....
    //tb_inventory에 넣어야 할듯 이미 제품은 존재하니까 
    //stroage_code , model_num , item_code , product_num , inventory_count
    const handlerModal2 =(itemCode: string, e:React.MouseEvent<HTMLElement, MouseEvent>) =>{
        e.stopPropagation();
        setItemCode(itemCode || '');
        setModal1(!modal1);
    }
    return(
        <>
        총 갯수 : {productCnt} 현재 페이지 : {currentParam}
        <StyledTable>
            <thead>
                <tr>
                    <StyledTh size={20}>제품 코드</StyledTh>
                    <StyledTh size={40}>제품 명</StyledTh>
                    <StyledTh size={10}>제조사</StyledTh>
                    <StyledTh size={20}>가격</StyledTh>
                    <StyledTh size={20}>창고에 넣기</StyledTh>
                    
                </tr>
            </thead>
            <tbody>
                {productList.length > 0 ? (
                    productList.map((a) => {
                        return (
                            <tr key={a.item_code} onClick={() => handlerModal(a.item_code)}>
                                <StyledTd>{a.item_code}</StyledTd>
                                <StyledTd>{a.item_name}</StyledTd>
                                <StyledTd>{a.manufac}</StyledTd>
                                <StyledTd>{a.provide_value}</StyledTd>
                                <StyledTd>
                                    <a onClick={(e)=>handlerModal2(a.item_code, e)}>창고 선택</a>
                                </StyledTd>
                        </tr>
                        );
                    })
                ) : (
                    <tr>
                        <StyledTd colSpan={4} >데이터가 없습니다</StyledTd>
                    </tr>
                )}
            </tbody>
        </StyledTable>
        <PageNavigate
        totalItemsCount={productCnt}
        onChange={searchItemList}
        itemsCountPerPage={5}
        activePage={currentParam as number}
        ></PageNavigate>
        {modal ? (
            <Protal>
             <ItemCodeProvider>
            <ItemModal 
                itemCode={itemCode} 
                onSuccess={postSuccess} 
                setItemCode={setItemCode} 
            />
            </ItemCodeProvider>
        </Protal>
        
        ) : null}
        <ItemStorage itemCode={itemCode}></ItemStorage>
        </>
    )

}