import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { FC, useContext, useEffect, useState } from "react";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";

import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { Button } from "../../../common/Button/Button";
import { ItemContext } from "../../../../pages/Product";
import { SearchItemCodeContext } from "../../../../api/provider/ItemCodeSearchProvider";


export interface IItemCodeList {
    cust_id: number;
    length: number;
    company_seq?: number;
    item_code?: string;
    cust_name?: string;
}

export interface IItemCodeResponse {
    totalCnt: number
    itemCodeList : IItemCodeList[];
    resultMsg : string;
}



export const ItemCodeModal = () => {
    const [itemCodeList, setItemCodeList] = useState<IItemCodeList[]>([]);
    const [totalCnt, setotalCnt] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>();
    const [checked, setChecked] = useState<Record<number, boolean>>([false]); // 체크 상태
    const {setItemCodeContext} = useContext(ItemContext);
    const {searchKeyword} = useContext(SearchItemCodeContext);
    
    useEffect(()=>{
        ItemCodeList();
    },[searchKeyword])//의존성 배열 안넣으니까 무한 호출 되었음 
    
    const ItemCodeList =(cpage? : number) =>{
        cpage = cpage || 1;
        
        const postAciton : AxiosRequestConfig = {
            method : 'POST',
            url : '/management/selectItemCode.do',
            data : {...searchKeyword, currentPage : cpage, pageSize : 5},
            headers : {
                'Content-Type':'application/json',
            },
        };
        axios(postAciton).then((res : AxiosResponse<IItemCodeResponse>)=>{
            setItemCodeList(res.data.itemCodeList);
            setotalCnt(res.data.totalCnt);
            setCurrentPage(cpage);
        })
    }
    
    const handleCheckboxChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(prev => ({
            ...prev,
            [index]: event.target.checked
        }));
        setItemCodeContext(event.target.checked ? event.target.value || '' : ''); // 상태 업데이트
        console.log(event.target.checked ? event.target.value || '' : '');
    };

    const handlerModal = (company_seq: any) => {

    }
    return (
        <>
       
        <div className="">
            <StyledTable>
            <colgroup>
                    <col width="5%" />
                    <col width="20%" />
                    <col width="20%" />
                    <col width="20%" />
                    <col width="5%" />
                </colgroup>
                <thead>
                    <tr>
                        <StyledTh size={5}></StyledTh>
                        <StyledTh size={10}>업체 명</StyledTh> 
                        <StyledTh size={10}>제품 코드</StyledTh>
                        <StyledTh size={10}>납품업체 코드</StyledTh>
                        <StyledTh size={5}></StyledTh>

                    </tr>
                </thead>
                <tbody>
                    {itemCodeList && itemCodeList?.length > 0 ? (
                        itemCodeList.map((a, i)=> {
                            return (
                                <tr key={i}>
                                    <StyledTd>
                                        <input 
                                        name ="item_code" 
                                        type='radio' 
                                        value={a.cust_id}
                                        onChange={handleCheckboxChange(i) }
                                        ></input>
                                    </StyledTd>
                                    <StyledTd>{a.cust_name}</StyledTd>
                                    <StyledTd>{a.item_code}</StyledTd>
                                    <StyledTd>{a.company_seq}</StyledTd>
                                    <StyledTd>
                                        <a 
                                        onClick={(e) => {
                                            handlerModal(a.company_seq);
                                        }}>
                                        수정    
                                        </a>
                                    </StyledTd>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <StyledTd colSpan={4}>데이터가 없습니다.</StyledTd>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
            <PageNavigate
                totalItemsCount={totalCnt}
                onChange={ItemCodeList}
                itemsCountPerPage={5}
                activePage={currentPage as number}
            ></PageNavigate>
            </div>
        
        </>
    )
}