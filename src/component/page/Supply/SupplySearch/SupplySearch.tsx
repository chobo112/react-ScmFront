import { useContext,  useState } from "react"
import { SupplySearchStyled } from "./styled"
import { SupplyContext } from "../../../../pages/Supply"
import { Button } from "../../../common/Button/Button";

export const SupplySearch = () =>{
    const {setSearchKeyword} = useContext(SupplyContext);
    const [input, setInput] = useState<{// 기존의 공통 코드와 다른 내용이다 
        oname : string;
        sname : string;
    }>({
        oname: 'cust_name',
        sname : '' 
    });

    const handlerSearch = () => {
        setSearchKeyword(input)
        console.log("search : ",input)
    }

  
    return (// 백단에 조금 다른 내용이 있어서 수정함 (원래는 item_name을 검색해야 함)
    <>
        <SupplySearchStyled>
            <select onChange={(e) => setInput({...input, oname : e.currentTarget.value})}>
                <option value = {'cust_name'}>납품업체 명</option>
                <option value = {'cust_person'} >담당자 명</option> 
            </select>
            <input onChange={(e) => setInput({...input, sname: e.target.value})}></input>
            <Button paddingtop={5} paddingbottom={5} onClick={handlerSearch}>
                검색
            </Button>
        </SupplySearchStyled>
    </>)
}