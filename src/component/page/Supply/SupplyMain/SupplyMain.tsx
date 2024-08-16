import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";

import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { useNavigate } from "react-router-dom";
import { SupplyMainStyled } from "./styled";
import { Button } from "../../../common/Button/Button";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { SupplyModal } from "../SupplyModal/SupplyModal";
import { SupplyContext } from "../../../../pages/Supply";

export interface ISupplyList {
    cust_id: number;
    cust_name :string;
    loginID : string;
    password: string;
    cust_person :string;
    cust_person_ph : string;
}

export interface ISearchSupply {
    supplyCnt : number;
    supplyList : ISupplyList[];
}

export const SupplyMain = () => {
    const {searchKeyword} = useContext(SupplyContext)
    const [supplyList, setSupplyList] = useState<ISupplyList[]>();
    const [totalCnt, setTotalCnt] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>();
    const [modal, setModal] = useRecoilState(modalState);
    const [cust_id, setCust_id] = useState<number>(0);
    const [password, setPassword] = useState<string>('');

    const navigate = useNavigate();

    useEffect(()=>{
        searchSupply();
    },[searchKeyword]);
    
    const searchSupply = (cpage?:number) =>{
        cpage = cpage || 1;
        const param = {...searchKeyword, currentPage : cpage, pageSize: 5}
        const postAction : AxiosRequestConfig = {
            method : 'POST',
            url : '/management/supplyList1.do',
            data : param,
            headers : {
                'Content-Type' : 'application/json',
            },
        };

        axios(postAction).then((res : AxiosResponse<ISearchSupply>)=>{
            setSupplyList(res.data.supplyList);
            setTotalCnt(res.data.supplyCnt);
            setCurrentPage(cpage);
        });
       
    }

    const onPostSuccess = () =>{
        setModal(!modal);
        searchSupply(currentPage);
    };

    const handlerModal = (cust_id: number, e:React.MouseEvent<HTMLElement, MouseEvent>)=>{
        e.stopPropagation();
        setCust_id(cust_id);
        setModal(!modal);
    };

    const passwordCheck =(password: string, e:React.MouseEvent<HTMLElement, MouseEvent>) =>{
        e.stopPropagation();
        setPassword(password);
        alert(password);
    }
    return (
    <>
        <SupplyMainStyled>
            <Button
            onClick={() =>{
                setModal(!modal);////이 방식은 **익명 함수(Anonymous Function)**를 사용합니다. 
                //클릭 이벤트가 발생하면, 그 즉시 함수가 생성되어 실행됩니다.
            }}>
                신규등록
            </Button>
            <StyledTable>
            <colgroup>
                    <col width="30%" />
                    <col width="10%" />
                    <col width="10%" />
                    <col width="20%" />
                    <col width="30%" />
                   
                </colgroup>
                <thead>
                    <tr>
                        <StyledTh size={10}>납품업체명</StyledTh>
                        <StyledTh size={5}>LoginID</StyledTh>
                        <StyledTh size={10}>패스워드</StyledTh>
                        <StyledTh size={5}>담당자명</StyledTh>
                        <StyledTh size={7}>담당자 연락처</StyledTh>
                        <StyledTh size={5}></StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {supplyList && supplyList?.length > 0 ? (
                        supplyList.map((a) =>{
                            return (
                                <tr
                                key={a.cust_id}
                                onClick={()=> {
                                    navigate(`${a.cust_id}`, {state: {supplyNm : a.cust_name}})
                                }}
                                >
                                <StyledTd>{a.cust_name}</StyledTd>
                                <StyledTd>{a.loginID ? a.loginID  : "미등록"}</StyledTd>   
                                <StyledTd>
                                    {a.password ? 
                                    <a onClick={(e) =>{passwordCheck(a.password ,e);}} 
                                        style={{color : 'red'}}
                                        >확인</a> : "미등록"}
                                </StyledTd>   
                                <StyledTd>{a.cust_person}</StyledTd>   
                                <StyledTd>{a.cust_person_ph}</StyledTd>   
                                <StyledTd>
                                <a 
                                    onClick={(e) => {
                                        handlerModal(a.cust_id, e);
                                    }}//클릭 이벤트가 발생했을 때 handlerModal이라는 함수를 호출하는데, 
                                    //이 함수에 두 개의 인자, a.cust_id와 e,를 전달합니다.
                                    >수정</a>     
                                </StyledTd>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <StyledTd  colSpan={6}>데이터가 없습니다</StyledTd>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
            <div>

            </div>
            <PageNavigate
            totalItemsCount={totalCnt}
            onChange={searchSupply}
            itemsCountPerPage={5}
            activePage={currentPage as number}
            ></PageNavigate>
            <SupplyModal onPostSuccess={onPostSuccess} cust_id={cust_id} setCust_id={setCust_id}></SupplyModal>
        </SupplyMainStyled>
    </>
    )
}