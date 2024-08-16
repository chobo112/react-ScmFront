import { useContext, useState } from "react"
import { Button } from "../../../common/Button/Button";
import { StorageContext } from "../../../../pages/Warehouse";

export const StorageSearch = () =>{
    const {setSearchKeyword} = useContext(StorageContext);
    const [input, setInput] = useState<{
        searchSelect: string;
        searchTitle: string;
    }>({
        searchSelect: 'name',
        searchTitle: '',
    });

    const handlerSearch = () => {
        setSearchKeyword(input);
        console.log("검색 기능 정보 : ",input )
    };
    return(
        <>
            <select onChange={(e)=> setInput({...input, searchSelect: e.currentTarget.value})}>
                <option value={'name'}>창고 명</option>
                <option value={'address'}>위치(시,도) 명</option>
            </select>
            <input onChange={(e)=>setInput({...input, searchTitle: e.target.value})}></input>
            <Button padding={5} paddingbottom={5} onClick={handlerSearch}>
                검색
            </Button>
        </>
    )
}
