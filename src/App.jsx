import React from 'react';
import {observer} from "mobx-react"
import idxDB from "./features/mstIndexedDB/idxDB"

export default observer(() => {
    const {getStore} = idxDB
    const store = getStore('store')
    console.log(store)
    return <>
        <h1>mst-indexed-db</h1>
    </>
})
