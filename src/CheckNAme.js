import React, { useContext } from "react";
import NoteContext from "./Componrnt/ContextUSe/NoteContext";

const CheckNAme = () => {

    const a = useContext(NoteContext);

    return(
        <>
       <h2>My Name iS {a.name}</h2>
        </>
    )
}
export default CheckNAme;