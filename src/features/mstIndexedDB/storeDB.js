import {types, getRoot, flow} from "mobx-state-tree"

export default types
    .model({
        id: types.identifierNumber,
        name: types.string,
        keyPath: types.string
    })
    .actions(self => ({
        add(data) {
            let request = self.transaction.add(data)
            request.onsuccess = function () {
                console.log(`Объект ${data} добавлен в хранилище`, request.result)
            }
            request.onerror = function () {
                console.log(`Ошибка добавления объекта ${data}`, request.error)
            }
        },
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
                // return transaction.objectStore(self.name)
                return db
            }
            return undefined
        }
    }))
