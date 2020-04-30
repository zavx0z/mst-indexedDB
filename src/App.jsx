import React, {useState} from 'react';
import {observer} from "mobx-react"
import idxDB from "./features/mstIndexedDB/idxDB"

export default observer(() => {
    const [store] = useState(idxDB.getStore('store'))
    const [value, setValue] = useState('')
    const handleAdd = () => {
        store.add({name: value})
            // .then(transaction => console.log(transaction))
            .catch(e => console.log(e))
    }
    const handleRemove = (id) => {
        store.remove(id)
    }
    return <>
        <h1>mst-indexed-db</h1>
        <input value={value} onChange={e => setValue(e.target.value)}/>
        <button onClick={handleAdd}>Добавить</button>
        <ul>
            {store.items.map((item, idx) => <li key={idx}>
                {item.name}&nbsp;
                <button onClick={() => handleRemove(item.id)}>удалить</button>
            </li>)}
        </ul>
    </>
})
