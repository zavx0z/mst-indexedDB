import idxDB from "./features/mstIndexedDB/idxDB"
import storeDB from "./features/mstIndexedDB/storeDB"

export default idxDB
    .create({
    dbName: "db",
    stores: [
        storeDB.create(
        {id: 1, name: 'stairs', keyPath: 'id'}),
    ]
})
