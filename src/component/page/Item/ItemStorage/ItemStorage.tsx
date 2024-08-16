import { FC, useEffect, useState } from "react";
import { ItemStorageModalStyled, ItemStorageTable } from "./styled";
import { useRecoilState } from "recoil";
import { modalState1 } from "../ItemMain/ItemMain";
import { Button } from "../../../common/Button/Button";
import { IStorageList, IStorageResponse } from "../../Storage/StorageMain/StorageMain";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export interface IItemStorageProps {
    itemCode: string;
}

export const ItemStorage: FC<IItemStorageProps> = ({ itemCode }) => {
    const [modal1, setModal1] = useRecoilState(modalState1);
    const [storageList, setStorageList] = useState<IStorageList[]>([]);
    const [itemCount, setItemCount] = useState<string>("");
    const [storage, setStorage] =useState<string>("1");
    const [model_num, setModel_num]=useState<string>("1");

    useEffect(() => {
        if (modal1) {
            searchStorage(); // 모달이 열릴 때만 호출
        }
    }, [modal1]); // 의존성 배열에 modal1 추가
    //여기서 스탑 같은 item_code있는지 또 검사해서 같은게 있으면 숫자를 늘리는 update가 되어야 하고 다르면 insert가 실행 되어야 함 
    //serviceImpl 쪽에서 수정해서 만들어 보자 
    //UPDATE tb_inventory
//SET inventory_count = inventory_count + 10
//WHERE storage_code = 'S1234' AND item_code = 'I5678';
    const searchStorage = async () => {
        const postAction: AxiosRequestConfig = {
            method: 'POST',
            url: '/management/warehouseList0.do',
            data: { item_code: itemCode }, // itemCode를 요청 데이터에 포함
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const res: AxiosResponse<IStorageResponse> = await axios(postAction);
            setStorageList(res.data.list || []); // 빈 배열로 초기화
        } catch (error) {
            console.error('Error fetching storage list:', error); // 에러 처리
        }
    };

    const saveItem = () => {
        const postAction:AxiosRequestConfig ={
            method:'POST',
            url: '/management/saveItemStorage.do',
            data: {storage, itemCode, itemCount, model_num},
            headers : {
                'Content-Type':'application/json',
            },
        };
        axios(postAction).then((res:AxiosResponse<IStorageResponse>)=>{
           
        })
    }

    const handlerStorageChange = (e: React.ChangeEvent<HTMLSelectElement>) =>{
        setStorage(e.target.value);
    }

    const handleItemCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setItemCount(e.target.value);
    };

    const handleModelNumChange = (e:React.ChangeEvent<HTMLSelectElement> )=>{
        setModel_num(e.target.value);
    }
    return (
        <ItemStorageModalStyled isOpen={modal1}>
            <div className="wrap">
                <div className="header">창고 선택</div>
                <ItemStorageTable>
                    <tbody>
                        <tr>
                            <td>
                                <select value={storage} onChange={handlerStorageChange}>
                                    {storageList.length > 0 ? (
                                        storageList.map(item => (
                                            <option key={item.storage_code} value={item.storage_code}>
                                                {item.storage_name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">No items available</option>
                                    )}
                                </select>
                            </td>
                            <td>모델 번호
                                <select value={model_num} onChange={handleModelNumChange}>
                                    <option value={"1"}>1</option>
                                    <option value={"2"}>2</option>
                                    <option value={"3"}>3</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>수량</td>
                            <td>
                                <input
                                    type="text"
                                    value={itemCount}
                                    onChange={handleItemCountChange}
                                />
                            </td>
                        </tr>
                    </tbody>
                </ItemStorageTable>
                <Button onClick={saveItem}>제품 저장</Button>
                <Button onClick={() => setModal1(!modal1)}>닫기</Button>
            </div>
        </ItemStorageModalStyled>
    );
};
