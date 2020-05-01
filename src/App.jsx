import React, {useEffect, useState} from 'react';
import storeDB from "./features/mstIndexedDB/store"

export default () => {
    const [store] = useState(storeDB.getStore('stairs'))
    const [items, setItems] = useState([])
    useEffect(() => {
        store.getItems()
            .then(items => setItems(items))
    }, [store])

    const [value, setValue] = useState('')
    const handleOnChangeValue = (e) => setValue(e.target.value)
    const handleAdd = () => store
        .add({name: value})
        .then(item => [...items, item])
        .then(newItems => setItems(newItems))
        .catch(e => console.log(e))
    const handleRemove = (id) => store
        .remove(id)
        .then(() => items.filter(item => item.id !== id))
        .then(newItems => setItems(newItems))
        .catch(e => console.log(e))
    return <>
        <h1>mst-indexed-db</h1>
        <input value={value} onChange={handleOnChangeValue}/>
        <button onClick={handleAdd}>Добавить</button>
        <ul>
            {items.map((item, idx) => <li key={idx}>
                <button onClick={() => handleRemove(item.id)}>удалить</button>
                &nbsp;
                {item.name}
            </li>)}
        </ul>
    </>
}
