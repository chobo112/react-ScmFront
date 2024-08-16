import { FC, useEffect, useState } from "react"
import { modalState } from "../../../../stores/modalState"
import { IStorageItemList } from "../StorageDetailMain/StorageDetailMain";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useLocation, useParams } from "react-router-dom";
import { StorageDetailModalStyled, StorageDetailModalTable } from "./styled";
import { useRecoilState } from "recoil";
import { Button } from "../../../common/Button/Button";



export interface IStorageItemProps {
    item_code? : string;
    onPostSuccess : () => void;
}

export interface IStorageItemUpdateResponse {
    itemList : IStorageItemList;
    map : IStorageItemList;
    resultMsg :string;
}

export const StorageDetailModal: FC<IStorageItemProps> =({item_code, onPostSuccess})=>{
    const [modal, setModal] = useRecoilState(modalState);
    const {storage_code} = useParams();
    const [StorageItem, setStorageItem] =useState<IStorageItemList>();
    const {state} = useLocation();
    useEffect(()=>{
        if(modal && item_code) searchStorageItem();
    },[item_code])
    

    const searchStorageItem=()=>{//근데 여기도 item 또 불러오고 같은 작업 아닌가? 
        const postAction:AxiosRequestConfig ={
            method : 'POST',
            url : '/management/warehouseDetail3.do',
            data : {item_code: item_code, storage_code : storage_code},//창고 명은 state로 써보기
            headers : {
                'Content-Type':'application/json',
            },
        };
        axios(postAction).then((res:AxiosResponse<IStorageItemUpdateResponse>)=>{
            setStorageItem(res.data.map);
        })
    }

    const cleanUp = () =>{

    }

    return(
        <>
        <StorageDetailModalStyled isOpen={modal} onAfterClose={cleanUp} ariaHideApp={false}>
            <div className="wrap">
                <div className="header">창고 제품 관리</div>
                <StorageDetailModalTable>
                    <tbody>
                        <tr>
                            <th>창고 명</th>
                            <input type="text" name="storage_name" defaultValue={state.storage_name}
                            readOnly
                            ></input>
                            <th>상품 명</th>
                            <input type="text" name="item_name" defaultValue={StorageItem?.item_name}
                            ></input>
                        </tr>
                        <tr>
                            <th>상품 가격</th>
                            <input type="text" name="item_price" defaultValue={StorageItem?.item_price}
                            ></input>
                            <th>상품 수량</th>
                            <input type="text" name="itme_count" defaultValue={StorageItem?.item_price}
                            ></input>
                        </tr>
                    </tbody>
                </StorageDetailModalTable>
                <Button onClick={()=> setModal(!modal)}>닫기</Button>
            </div>
        </StorageDetailModalStyled>
        </>
    )
}