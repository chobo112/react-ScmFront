import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { ItemSearchStyled } from "./styled";
import { Button } from "../../../common/Button/Button";
import { modalState } from "../../../../stores/modalState";

//*atom**은 Recoil 상태의 기본 단위로, 상태를 정의하고, 관리할 수 있는 객체입니다. 
export const ItemSearch = () => {
    const navigate = useNavigate();
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const itemSearch = useRef<HTMLInputElement>(null);
    const nameSearch = useRef<HTMLInputElement>(null);
    const manufacSearch = useRef<HTMLInputElement>(null);
    const [option, setOption] = useState<string>('itemSearch');

    const handlerSearch = () => {
        const query: string[] = [];

        !itemSearch.current?.value || query.push(`searchItemCode=${itemSearch.current?.value}`);
        !nameSearch.current?.value || query.push(`searchItemName=${nameSearch.current?.value}`);
        !manufacSearch.current?.value || query.push(`searchManufac=${manufacSearch.current?.value}`);

        const queryString = query.length > 0 ? `?${query.join('&')}` : '';
        navigate(`/react/management/productInfo.do${queryString}`);
    };

    const handlerModal = () => {
        setModal(!modal);
    };

    return (
        <ItemSearchStyled>
            <select onChange={(e) => setOption(e.target.value)} value={option}>
                <option value="itemSearch">제품코드</option>
                <option value="nameSearch">제품명</option>
                <option value="manufacSearch">제품제조사</option>
            </select>
            {option === 'itemSearch' && <input ref={itemSearch} placeholder="제품코드 입력" />}
            {option === 'nameSearch' && <input ref={nameSearch} placeholder="제품명 입력" />}
            {option === 'manufacSearch' && <input ref={manufacSearch} placeholder="제품제조사 입력" />}
            <Button onClick={handlerSearch}>검색</Button>
            <Button onClick={handlerModal}>등록</Button>
        </ItemSearchStyled>
    );
};
