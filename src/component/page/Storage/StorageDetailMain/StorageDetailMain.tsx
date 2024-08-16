import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { ContentBox } from "../../../common/ContentBox/ContentBox";
import { Button } from "../../../common/Button/Button";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import KakaoMapComponent from "../StorageLocation/KakaoMap";
import { StorageDetailModal } from "../StorageDetailModal/StorageDetailModal";


export interface IStorageItemList{
    storage_code : number;
    storage_name : string;
    item_name : string;
    item_price : number;
    inventory_count : number;
    item_code : string;
}

export interface IStorageItemListResponse {
    resultMsg : string;
    map : IStorageItemList[];
}

export const StorageDetailMain =() =>{
    const {storage_code} = useParams();
    const navigate = useNavigate();
    const [StorageItemList, setStorageItemList] = useState<IStorageItemList[]>();
    const [item_code, setItem_code] = useState<string>();
    const [modal, setModal] = useRecoilState(modalState);
   
    useEffect(()=>{
        searchStorageItemList();
    },[storage_code]);
   
    const onPostSuccess =() =>{
        setModal(!modal);
    }

    const searchStorageItemList =()=>{
        const postAction:AxiosRequestConfig ={
            method :'POST',
            url : '/management/warehouseDetail2.do',
            data :{storage_code: storage_code},
            headers : {
                'Content-Type':'application/json',
            },
        };
        axios(postAction).then((res: AxiosResponse<IStorageItemListResponse>)=>{
            setStorageItemList(res.data.map);
        })
    } //창고이름	상품이름	상품가격	상품개수
    const handlerModal =(item_code?: string)=>{
        setModal(!modal);
        setItem_code(item_code);
    }
    return(
        <>
        <ContentBox>창고 제품 리스트</ContentBox>
        <Button onClick={()=> navigate(-1)}>뒤로가기</Button>
        <Button onClick={handlerModal}>창고에 상품 등록하기</Button>
        
        <StyledTable>
        
            <thead>
                <tr>
                <StyledTh size={10}>창고이름</StyledTh>
                <StyledTh size={10}>상품이름</StyledTh>
                <StyledTh size={7}>상품가격</StyledTh>
                <StyledTh size={10}>상품개수</StyledTh>
                </tr>
            </thead>
            <tbody>
                {StorageItemList && StorageItemList.length > 0? (
                    StorageItemList.map((a)=>{
                        return(
                            <tr key={a.storage_code} onClick={() =>handlerModal(a.item_code)}>
                                <StyledTd>{a.storage_name}</StyledTd>
                                <StyledTd>{a.item_name}</StyledTd>
                                <StyledTd>{a.item_price}</StyledTd>
                                <StyledTd>{a.inventory_count}</StyledTd>
                            </tr>
                        )
                    })
                ):(
                    <tr>
                        <StyledTd colSpan={4}>데이터가 없습니다</StyledTd>
                    </tr>
                )}
            </tbody>
        </StyledTable>
        <StorageDetailModal onPostSuccess={onPostSuccess} item_code={item_code} ></StorageDetailModal>
        </>
    )
}