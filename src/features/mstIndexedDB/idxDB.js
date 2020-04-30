import {flow, types} from "mobx-state-tree"
import storeDB from "./storeDB"

export default types
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
                request.onupgradeneeded = (e) => self._upgrade(e)
                request.onerror = (e) => console.error("[idxDB] Error", e.error)
                request.onsuccess = (e) => self._success(e)
                request.onblocked = (e) => console.log("[idxDB] соединение не закрыто после _db.onversionchange")
            } else console.log("[idxDB] Браузер не поддерживает IndexedDB")
        },
        _upgrade(e) {
            const db = e.target.result
            switch (db.version) {
                case 0:
                    console.log("[idxDB] инициализация")
                    self.stores.map(store => this.createStore(db, store))
                    break
                case 1:
                    console.log("[idxDB] обновление")
                    self.stores.map(store => this.createStore(db, store))
                    break
                default:
                    console.log("default")
            }
        },
        _success(e) {
            console.log("[idxDB] База готова к работе")
            this.setDB(e.target.result)
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
                return Promise.reject(e)
            }
        }),
        setDB(_db) {
            self._db = _db
        },// ==========================================================
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
