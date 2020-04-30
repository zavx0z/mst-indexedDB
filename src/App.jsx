import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react"
import idxDB from "./features/mstIndexedDB/idxDB"

export default observer(() => {
    const [store] = useState(idxDB.getStore('store'))
    useEffect(() => {
        store.getTransaction()
            .then(transaction => console.log(transaction))
    }, [store])
    return <>
        <h1>mst-indexed-db</h1>
    </>
})