import { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { StorageContext } from "../../../../pages/Warehouse";
import { useNavigate } from "react-router-dom";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Button } from "../../../common/Button/Button";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { StorageModal } from "../StorageModal/StorageModal";

export interface IStorageList {
    storage_code : string;
    storage_name : string;
    storage_loc : string;
    storage_detail_loc : string;
    storage_loc_num :number;
    storage_manager : string;
}

export interface IStorageResponse {
    totalCount : number;
    list : IStorageList[];
    resultMsg : string;
}

export const StorageMain =()=>{
    const [storageList, setStorageList] = useState<IStorageList[]>();//[] 배열 타입이라고 넣어줘야 함 안하면 오류남 
    const [totalCnt, setTotalCnt] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>();
    const [modal, setModal] = useRecoilState(modalState);//Recoil 상태 관리를 위한 훅으로, Recoil 상태를 읽고 업데이트할 수 있습니다
    const {searchKeyword} = useContext(StorageContext);
    const [storage_code, setStorage_code] = useState<string>('');
    const navigate = useNavigate();

    useEffect(()=> {
        searchStorage();
    },[searchKeyword]);

    const searchStorage =(cpage? : number) =>{
        cpage = cpage || 1;
        const postAction: AxiosRequestConfig = {
            method: 'POST',
            url  :'/management/warehouseList1.do',
            data : {...searchKeyword, currentPage: cpage, pageSize: 5},
            headers : {
                'Content-Type' : 'application/json',
            },
        };
        axios(postAction).then((res: AxiosResponse<IStorageResponse>)=>{
            setStorageList(res.data.list);
            setTotalCnt(res.data.totalCount);
            setCurrentPage(cpage);
        });
    }

    const onPostSuccess=()=>{
        setModal(!modal);
        searchStorage(currentPage);
    };

    const handlerModal = (storage_code: string, e:React.MouseEvent<HTMLElement, MouseEvent>) =>{
        e.stopPropagation();
        setStorage_code(storage_code);
        setModal(!modal);
    }

    return(
        <>
         <Button
                onClick={() => {
                    setModal(!modal);
                }}
            >
                창고 등록
            </Button>
            <StyledTable>
                <colgroup>
                    <col width="20%" />
                    <col width="10%" />
                    <col width="20%" />
                    <col width="7%" />
                    <col width="10%" />
                    <col width="5%" />
                </colgroup>
                <thead>
                    <tr>
                        <StyledTh size={10}>창고 코드</StyledTh>
                        <StyledTh size={5}>창고 명</StyledTh>
                        <StyledTh size={10}>담당자</StyledTh>
                        <StyledTh size={7}>창고위치</StyledTh>
                        <StyledTh size={3}></StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {storageList && storageList?.length > 0 ? (
                        storageList.map((a) => {
                            return (
                                    <tr
                                    key={a.storage_code}
                                    onClick={() => {
                                        navigate(a.storage_code, { state: { storage_code:a.storage_code, storage_name: a.storage_name } });
                                    }}
                                    >
                                    <StyledTd>{a.storage_code}</StyledTd>
                                    <StyledTd>{a.storage_name}</StyledTd>
                                    <StyledTd>{a.storage_manager}</StyledTd>
                                    <StyledTd>{a.storage_loc}</StyledTd>
                                    <StyledTd>
                                        <a
                                            onClick={(e) => {
                                                handlerModal(a.storage_code, e);
                                            }}
                                        >
                                            수정
                                        </a>
                                    </StyledTd>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                        <StyledTd colSpan={6}>데이터가 없습니다.</StyledTd>
                    </tr>
                    )}
                </tbody>
            </StyledTable>
            <PageNavigate
                totalItemsCount={totalCnt}
                onChange={searchStorage}
                itemsCountPerPage={5}
                activePage={currentPage as number}
            ></PageNavigate>
            <StorageModal onPostSuccess={onPostSuccess} storage_code={storage_code} setStorage_code={setStorage_code}></StorageModal>
            
        </>
    )
}