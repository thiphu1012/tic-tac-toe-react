import { useEffect, useRef } from "react"

export default function Cell({x,y, onCellClick, onInit}){
    const cellRef = useRef(null);

    useEffect(()=>{
        onInit(x,y, cellRef)
    },[])

    return (
        <div className="cell" onClick={()=>{
            onCellClick(x,y, cellRef)
        }} ref={cellRef}>
        </div>
    )
}