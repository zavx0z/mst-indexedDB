import {types} from "mobx-state-tree"
import baseDB from "../private/baseDatabaseIDB"
import storeIDB from "./storeIDB"

export default types.compose(baseDB, types
    .model({
        dbName: types.string,
        version: 1,
        stores: types.maybe(types.array(storeIDB))
    })
    .actions(self => ({
        createStore(db, store) {
            if (!db.objectStoreNames.contains(store.name)) {
                const objectStore = db.createObjectStore(store.name,
                    {keyPath: store.keyPath, autoIncrement: store.autoIncrement})
                objectStore.createIndex(store.keyPath, store.keyPath)
            }
        },
        getStore(name) {
            return self.stores.find(store => store.name === name)
        },
        deleteDB() {
            indexedDB.deleteDatabase(self.dbName)
        }
    }))
)