import {types, getRoot, flow} from "mobx-state-tree"

export default types
    .model({
        id: types.identifierNumber,
        name: types.string,
        keyPath: types.string
    })
    .actions(self => ({
        add: flow(function* (data) {
            try {
                const transaction = yield self.getTransaction()
                const store = transaction.objectStore(self.name)
                const request = store.add(data)
                return new Promise((resolve, reject) => {
                    request.onsuccess = () =>
                        resolve(`[idxDB] Объект ${data.name} добавлен в хранилище\n${request.result}`)
                    request.onerror = () =>
                        reject(`[idxDB] Ошибка добавления объекта ${data.name}\n${request.error}`)
                })
            } catch (e) {

            }
        }),
        delete() {
        },
        update() {
        },
        getTransaction: flow(function* () {
            const root = getRoot(self)
            try {
                const db = yield root.getDB()
                return db.transaction(self.name, "readwrite")
            } catch (e) {

            }
        })
    }))
    .views(self => ({
        get transaction() {
            const {db} = getRoot(self)
            console.log(db)
            if (typeof db !== "undefined") {
                const transaction = db.transaction(self.name, "readwrite")
                console.log(transaction)
                return db
            }
            return undefined
        }
    }))
