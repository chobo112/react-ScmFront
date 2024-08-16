import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { ContentBox } from "../../../common/ContentBox/ContentBox";
import { Button } from "../../../common/Button/Button";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { SupplyDetailModal } from "../SupplyDetailModal/SupplyDetailModal";
//회사가 납품하는 item 테이블의 정보가 나와야 한다 
//SELECT 
//item_code,
//item_name,
//provide_value
//FROM 
//tb_item_info
//WHERE 
//item_code IN (
   // SELECT item_code
   // FROM tb_company_item
   // WHERE company_seq = 4);
export interface IListItemJsonResponse {
    //총수

    //리스트
    itemList : IItemDetailList[];
    //페이지 사이즈

    //커런트 페이지
}

export interface IItemDetailList {
    item_code : string;
    item_name : string;
    provide_value : number;
}

export const SupplyDetail = () =>{
    const {cust_id} = useParams();
    const navigate = useNavigate();
    const [supplyItemList , setSupplyItemList] = useState<IItemDetailList[]>();
    const [modal, setModal] = useRecoilState(modalState);
    const [item_code, setItem_code] =  useState<string>();
    useEffect(()=>{
        searchItemDetail();
    },[cust_id])

    const searchItemDetail = (cpage?: number) =>{
        cpage = cpage ||1;
        const postAciton : AxiosRequestConfig = {
            method : 'POST',
            url: '/management/supplyItem.do',
            data : {cust_id: cust_id, currentPage : cpage, pageSize: 5},
            headers : {
                'Content-Type':'application/json',
            },
        };
        axios(postAciton).then((res:AxiosResponse<IListItemJsonResponse>)=>{
            setSupplyItemList(res.data.itemList);
        })
    }

    const handlerModal=(item_code?: string) =>{
        setModal(!modal);
        setItem_code(item_code);
    }

    const onPostSuccess =() =>{
        setModal(!modal);
        searchItemDetail();
    }
    return (
    
    <>
        <ContentBox>제품 정보</ContentBox>
        <Button onClick={() =>navigate(-1)}>뒤로가기</Button>
        <Button onClick={handlerModal}>신규등록</Button>
        <StyledTable>
            <thead>
                <tr>
                    <StyledTh size={10}>상품 코드</StyledTh>
                    <StyledTh size={10}>상품 이름</StyledTh>
                    <StyledTh size={7}>판매가</StyledTh>
                </tr>
            </thead>
            <tbody>
                {supplyItemList && supplyItemList.length > 0 ? (
                    supplyItemList.map((a) => {
                        return (
                            <tr key={a.item_code} onClick={()=> handlerModal(a.item_code)}>
                                <StyledTd >{a.item_code}</StyledTd>
                                <StyledTd >{a.item_name}</StyledTd>
                                <StyledTd >{a.provide_value}</StyledTd>
                            </tr>
                        )
                    })
                ) : (
                    <tr>
                        <StyledTd colSpan={3}>데이터가 없습니다</StyledTd>
                    </tr>
                )}
            </tbody>
        </StyledTable>
        <SupplyDetailModal item_code={item_code} onPostSuccess={onPostSuccess} setItem_code={setItem_code}></SupplyDetailModal>
    </>
    
)
}