import { FC, useEffect, useState } from "react";
import { modalState } from "../../../../stores/modalState";
import { useRecoilState } from "recoil";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { SupplyModalStyled, SupplyModalTableStyled } from "./styled";
import { cleanup } from "@testing-library/react";
import { Button } from "../../../common/Button/Button";

export interface ISupplyDetail { //데이터 타입 정의
    cust_id?:number;
    cust_name?:string;
    cust_person?:string;
    cust_person_ph?:string;

}

export interface IPostResponse {//응답에 대한 유형 
    result: 'SUCCESS';
}

export interface IDetailResponse extends IPostResponse { //왜인지 모르겠는데 응답에 대한 유형 msg타입이 나뉘어져 있음 
    custDetail : ISupplyDetail;
    resultMsg: string;
}

export interface ISupplyDetailModalProps {//props로 받은 내용에 대한 타입 정의
    onPostSuccess : () => void;
    cust_id :number;
    setCust_id:(cust_id:number) => void;

}

export const SupplyModal :FC<ISupplyDetailModalProps> = ({onPostSuccess, cust_id, setCust_id}) => {
    const [modal, setModal] = useRecoilState(modalState);
    const [supply, setSupply] = useState<ISupplyDetail>({});
    //스프링에서는 배열로 해서 가져오는데 
    //객체 형태로 가져오도록 변경 함 

    useEffect(()=>{
        if(modal && cust_id) searchDetail(cust_id);
    },[modal]);


    const searchDetail = async(cust_id: number)=>{
        const postAciton: AxiosRequestConfig = {
            method:'POST',
            url:'/management/custDetail1.do',
            data : {cust_id : cust_id},
            headers: {
                'Content-Type' : "application/json",
            },
        };
        axios(postAciton).then((res: AxiosResponse<IDetailResponse>)=>{
                setSupply(res.data.custDetail);
                
            });
           
    };

    const handlerSave = () =>{
        const postAction : AxiosRequestConfig ={
            method: 'POST',
            url : '/management/custRegister.do',
            data : supply,
            headers: {
                'Content-Type':"application/json",
            },
        };
        axios(postAction).then((res: AxiosResponse<IDetailResponse>) =>{
            if(res.data.resultMsg === 'SUCCESS') {
                alert("SUCCESS");
                onPostSuccess();
            }
        });
        // const postAction1 : AxiosRequestConfig ={
        //     method: 'POST',
        //     url : '/management/newOrderCompany.do',
        //     data : {cust_id : supply.cust_id, cust_name : supply.cust_name},
        //     headers : {
        //         'Content-Type':'application/json',
        //     },
        // };
        // axios(postAction1).then((res:AxiosResponse<IDetailResponse>)=>{
        //     if(res.data.resultMsg === 'SUCCESS'){
        //         alert("SUCCESS")
        //         onPostSuccess();
        //     }
        // })
    };

    const handlerUpdate= () => {
        const postAciton : AxiosRequestConfig ={
            method : 'POST',
            url : '/management/custUpdate.do',
            data : supply,
            headers : {
                'Content-Type' : 'application/json',
            },
        };
        axios(postAciton).then((res : AxiosResponse<IDetailResponse>)=>{
            if(res.data.resultMsg === 'SUCCESS'){
                alert("SUCCESS");
                onPostSuccess();
            }
        });
    };

    const handlerDelete = () =>{
        const postAciton :AxiosRequestConfig = {
            method : 'POST',
            url : '/management/custDelete.do',
            data : {cust_id : cust_id},
            headers : {
                'Content-Type' : 'application/json',
            },
        };
        axios(postAciton).then((res : AxiosResponse<IDetailResponse>) =>{
            if(res.data.resultMsg === 'SUCCESS'){
                alert("SUCCESS");
                onPostSuccess();
            }
        })
    }

    const cleanUp = () => {
        setSupply({});
        setCust_id(0);
    }
    
    return (
    <>
        <SupplyModalStyled isOpen={modal} ariaHideApp={false} onAfterClose={cleanUp}>
            <div className="wrap">
                <div className="header">납품업체 관리</div>
                <SupplyModalTableStyled>
                    <tbody>
                        <tr>
                            <th>기업 코드</th>
                            <td>
                                <input
                                type="text"
                                name="cust_id"
                                required
                                onChange={(e) =>{
                                    setSupply({...supply, cust_id:  parseInt(e.target.value)});
                                }}
                                placeholder="자동 업데이트"
                                defaultValue={supply?.cust_id || ''}
                                readOnly
                                ></input>
                            </td>
                            <th>기업 명</th>
                            <td>
                                <input
                                type="text"
                                name="cust_name"
                                required
                                onChange={(e) =>{
                                    setSupply({...supply, cust_name:  e.target.value});
                                }}
                                defaultValue={supply?.cust_name || ''}
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <th>담당자</th>
                            <td>
                                <input
                                type="text"
                                name="cust_person"
                                required
                                onChange={(e) =>{
                                    setSupply({...supply, cust_person:  e.target.value});
                                }}
                                defaultValue={supply?.cust_person || ''}
                                ></input>
                            </td>
                            <th>담당자 연락처</th>
                            <td>
                                <input
                                type="text"
                                name="cust_person_ph"
                                required
                                onChange={(e) =>{
                                    setSupply({...supply, cust_person_ph:  e.target.value});
                                }}
                                defaultValue={supply?.cust_person_ph || ''}
                                ></input>
                            </td>
                        </tr>
                    </tbody>
                </SupplyModalTableStyled>
                <div className="btn-group">
                    <Button onClick={cust_id ? handlerUpdate : handlerSave }>{cust_id ? '수정' : '저장'}</Button>
                    {cust_id ? <Button onClick={ handlerDelete}>삭제</Button> : null}
                    <Button onClick={()=>setModal(!modal)}>닫기</Button>
                </div>
            </div>
        </SupplyModalStyled>
    </>)
}