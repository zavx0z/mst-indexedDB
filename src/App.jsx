import React from 'react';
import {observer} from "mobx-react"
import idxDB from "./features/mstIndexedDB/idxDB"

export default observer(() => {
    console.log(idxDB.db)
    return <>
        <h1>mst-indexed-db</h1>
    </>
})
