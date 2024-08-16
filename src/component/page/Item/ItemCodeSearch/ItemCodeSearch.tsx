import { useContext, useState } from "react";
import { SearchItemCodeContext } from "../../../../api/provider/ItemCodeSearchProvider";
import { Button } from "../../../common/Button/Button";

export const ItemCodeSearch = () => {
    const { setSearchKeyword } = useContext(SearchItemCodeContext); // 괄호 수정
    const [input, setInput] = useState<{
        oname: string;
        sname: string;
    }>({
        oname: 'item_code',
        sname: '',
    });

    const handlerSearch = () => {
        setSearchKeyword(input);
    };

    return (
        <>
            <select onChange={(e) => setInput({ ...input, oname: e.currentTarget.value })}>
                <option value={'item_code'}>아이템 코드</option>
                <option value={'cust_name'}>납품업체 명</option>
            </select>
            <input onChange={(e) => setInput({ ...input, sname: e.target.value })} />
            <Button paddingtop={5} paddingbottom={5} onClick={handlerSearch}>검색</Button>
        </>
    );
}
