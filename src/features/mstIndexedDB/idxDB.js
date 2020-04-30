import {flow, types} from "mobx-state-tree"
import storeDB from "./storeDB"

const idxDB = types
    .model({
        dbName: types.string,
        version: 1,
        stores: types.maybe(types.array(storeDB))
    })
    .volatile(self => ({
        _db: undefined
    }))
    .actions(self => ({
        afterCreate() {
            if ("indexedDB" in window) {
                console.log("[idxDB] Браузер поддерживает IndexedDB")
                let request = indexedDB.open(self.dbName, self.version)
                request.onupgradeneeded = () => self._upgrade(request)
                request.onerror = () => console.error("[idxDB] Error", request.error)
                request.onsuccess = () => self._success(request)
                request.onblocked = () => console.log("[idxDB] соединение не закрыто после _db.onversionchange")
            } else console.log("[idxDB] Браузер не поддерживает IndexedDB")
        },
        _upgrade(request) {
            this.setDB(request.result)
            switch (self._db.version) {
                case 0:
                    console.log("[idxDB] инициализация")
                    break
                case 1:
                    console.log("[idxDB] обновление")
                    self.stores.map(store => this.createStore(request, store))
                    break
                default:
                    console.log("default")
            }
        },
        _success(request) {
            console.log("[idxDB] База готова к работе")
            this.setDB(request.result)
            self._db.onversionchange = () => {
                self._db.close()
                console.log("[idxDB] База устарела, перезагрузи страницу.")
            }
        },
        getDB: flow(function* () {
            try {
                return yield new Promise(resolve => {
                    const fn = () => {
                        if (typeof self._db !== "undefined") {
                            clearInterval(interval)
                            return resolve(self._db)
                        }
                    }
                    const interval = setInterval(fn, 100)
                })
            } catch (e) {

            }
        }),
        setDB(_db) {
            self._db = _db
        },// ==========================================================
        createStore(request, store) {
            !self._db.objectStoreNames.contains(store.name) &&
            self._db.createObjectStore(store.name, {keyPath: store.keyPath})
        },
        getStore(name) {
            return self.stores.find(store => store.name === name)
        },
        deleteDB() {
            indexedDB.deleteDatabase(self.dbName)
        }
    }))
export default idxDB.create({
    dbName: "db",
    stores: [
        {id: 1, name: 'store', keyPath: 'id'},
    ]
})
