import {types, getRoot, flow} from "mobx-state-tree"

export default types
    .model({
        id: types.identifierNumber,
        name: types.string,
        keyPath: types.string,
        autoIncrement: true
    })
    .actions(self => ({
        add: flow(function* (data) {
            try {
                const store = yield self._getStoreTransaction()
                const request = store.add(data)
                return new Promise((resolve, reject) => {
                    request.onsuccess = () =>
                        resolve(`[idxDB] Объект ${data.name} добавлен в хранилище\n${request.result}`)
                    request.onerror = () =>
                        reject(`[idxDB] Ошибка добавления объекта ${data.name}\n${request.error}`)
                })
            } catch (e) {
                return Promise.reject(e)
            }
        }),
        delete() {
        },
        update() {
        },
        _getStoreTransaction: flow(function* () {
            const root = getRoot(self)
            try {
                const db = yield root.getDB()
                const transaction = db.transaction(self.name, "readwrite")
                return transaction.objectStore(self.name)
            } catch (e) {

            }
        })
    }))
    .views(self => ({}))
