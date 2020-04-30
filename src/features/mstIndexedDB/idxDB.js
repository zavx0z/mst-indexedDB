import {types} from "mobx-state-tree"
import storeDB from "./storeDB"

const idxDB = types
    .model({
        dbName: types.string,
        version: 1,
        stores: types.maybe(types.array(storeDB))
    })
    .volatile(self => ({
        db: {}
    }))
    .actions(self => ({
        afterCreate() {
            if ("indexedDB" in window) {
                console.log("Браузер поддерживает IndexedDB")
                let request = indexedDB.open(self.dbName, self.version)
                request.onupgradeneeded = () => self._upgrade(request)
                request.onerror = () => console.error("Error", request.error)
                request.onsuccess = () => self._success(request)
                request.onblocked = () => console.log("соединение не закрыто после db.onversionchange")
            } else console.log("Браузер не поддерживает IndexedDB")
        },
        _upgrade(request) {
            this.setDB(request.result)
            switch (self.db.version) {
                case 0:
                    console.log("инициализация")
                    break
                case 1:
                    console.log("обновление")
                    self.stores.map(store => this.createStore(request, store))
                    break
                default:
                    console.log("default")
            }
        },
        _success(request) {
            console.log("База готова к работе")
            this.setDB(request.result)
            self.db.onversionchange = () => {
                self.db.close()
                alert("База данных устарела, перезагрузите страницу.")
            }
        },
        setDB(db) {
            self.db = db
        },// ==========================================================
        createStore(request, store) {
            !self.db.objectStoreNames.contains(store.name) &&
            self.db.createObjectStore(store.name, {keyPath: store.keyPath})
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
