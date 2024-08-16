import { FC, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { StorageModalStyled, StorageTableStyled } from "./styled";
import { Button } from "../../../common/Button/Button";

export interface IStorageDetailList {
    storage_code?: string;
    storage_name?: string;
    item_name?: string;
    item_price?: number;
    inventory_count?: number;
    item_code?: string;
    storage_loc?: string;
    storage_detail_loc?: string;
    storage_loc_num?: number;
    storage_manager?: string;
}

export interface IStorageDetailResponse {
    resultMsg: string;
    map: IStorageDetailList;
}

export interface IStorageModalProps {
    onPostSuccess: () => void;
    storage_code: string;
    setStorage_code: (storage_code: string) => void;
}

export const StorageModal: FC<IStorageModalProps> = ({ onPostSuccess, storage_code, setStorage_code }) => {
    const [modal, setModal] = useRecoilState(modalState);
    const [storageDetail, setStorageDetail] = useState<IStorageDetailList>({});
    const [postcode, setPostcode] = useState(''); // 우편번호
    const [address, setAddress] = useState(''); // 기본 주소
    const [detailAddress, setDetailAddress] = useState(''); // 상세 주소
    const [isDaumLoaded, setIsDaumLoaded] = useState(false); // 스크립트 로드 여부 확인

    useEffect(() => {
        if (modal && storage_code) searchDetail(storage_code);

        // 스크립트 로드 확인
        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        script.onload = () => setIsDaumLoaded(true);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [modal, storage_code]);

    const searchDetail = async (storage_code: string) => {
        const postAction: AxiosRequestConfig = {
            method: 'POST',
            url: '/management/warehouseDetail1.do',
            data: { storage_code: storage_code },
            headers: {
                'Content-Type': 'application/json',
            },
        };
        axios(postAction).then((res: AxiosResponse<IStorageDetailResponse>) => {
            setStorageDetail(res.data.map);
        });
    }

   

    const handleComplete = (data: { address: string; addressType: string; bname: string; buildingName: string; zonecode: string; }) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        setPostcode(data.zonecode);
        setAddress(fullAddress);
        setDetailAddress('');

        setStorageDetail(prevState => ({
            ...prevState,
            storage_loc_num: Number(data.zonecode),
            storage_loc: fullAddress,
            storage_detail_loc: '' // 기본값으로 설정
          }));
    };

    const handleClick = () => {
        const { daum } = window as any;
        new daum.Postcode({
            oncomplete: handleComplete,
        }).open();
    };
    
    const handlerUpdate =()=>{
        const postAction:AxiosRequestConfig ={
            method : 'POST',
            url : '/management/newStorageUpdate1.do',
            data : storageDetail,
            headers : {
                'Content-Type':'application/json',
            },
        };
        axios(postAction).then((res:AxiosResponse<IStorageDetailResponse>)=>{
            if(res.data.resultMsg === "SUCCESS"){
                alert("SUCCESS");
                onPostSuccess();
            }else {
                alert("FAIL");
            }
        })
    }
    const handlerSave=()=>{
        //newStorageSave
        const postAction: AxiosRequestConfig={
            method: 'POSt',
            url : '/management/newStorageSave1.do',
            data : storageDetail,
            headers : {
                'Content-Type':'application/json',
            },
        };
        axios(postAction).then((res:AxiosResponse<IStorageDetailResponse>)=>{
            if(res.data.resultMsg==="SUCCESS"){
                onPostSuccess();
            }
        })
    }
    const handlerDelete =()=>{

    }
     const cleanUp = () => {
        setStorageDetail({});
        setStorage_code('');
        setPostcode('');
        setAddress('');
        setDetailAddress('');
    };

    return (
        <StorageModalStyled isOpen={modal} ariaHideApp={false} onAfterClose={cleanUp}>
            <div className="wrap">
                <div className="header">창고 재고 관리</div>
                <StorageTableStyled>
                    <tbody>
                        <tr>
                            <th>창고 명</th>
                            <td>
                                <input
                                    type="text"
                                    name="storage_name"
                                    required
                                    onChange={(e) => {
                                        setStorageDetail({ ...storageDetail, storage_name: e.target.value });
                                    }}
                                    value={storageDetail?.storage_name || ''}
                                />
                            </td>
                            <th>담당자</th>
                            <td>
                                <input
                                    type="text"
                                    name="storage_manager"
                                    required
                                    onChange={(e) => {
                                        setStorageDetail({ ...storageDetail, storage_manager: e.target.value });
                                    }}
                                    value={storageDetail?.storage_manager || ''}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>우편주소</th>
                            <td colSpan={2}>
                                <input
                                    type="text"
                                    name="storage_loc_num"
                                    required
                                    onChange={(e) => {
                                        setStorageDetail({ ...storageDetail, storage_loc_num: Number(e.target.value) });
                                    }}//우편주소를 통해서 자동으로 추가된 부분은 인식을 못하는 오류가 있다 . 
                                    value={postcode ? postcode : storageDetail?.storage_loc_num?.toString() }
                                />
                            </td>
                            <td colSpan={2}>
                                <Button onClick={handleClick}>주소찾기</Button>
                            </td>
                        </tr>
                        <tr>
                            <th>주소</th>
                            <td colSpan={3}>
                                <input
                                    type="text"
                                    name="storage_loc"
                                    required
                                    onChange={(e) => {
                                        setStorageDetail({ ...storageDetail, storage_loc: e.target.value });
                                    }}
                                    value={address? address : storageDetail?.storage_loc }
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>상세주소</th>
                            <td colSpan={3}>
                                <input
                                    type="text"
                                    name="storage_detail_loc"
                                    required
                                    onChange={(e) => {
                                        setStorageDetail({ ...storageDetail, storage_detail_loc: e.target.value });
                                    }}
                                    value={detailAddress? detailAddress : storageDetail?.storage_detail_loc }
                                />
                            </td>
                        </tr>
                    </tbody>
                </StorageTableStyled>
                <div className="btn-group">
                    <Button onClick={storage_code ? handlerUpdate : handlerSave}>{storage_code ? '수정' : '저장'}</Button>
                    {storage_code ? <Button onClick={handlerDelete}>삭제</Button> : null}
                    <Button onClick={() => setModal(!modal)}>닫기</Button>
                </div>
            </div>
        </StorageModalStyled>
    );
}
function setIsDaumLoaded(arg0: boolean): any {
    throw new Error("Function not implemented.");
}

