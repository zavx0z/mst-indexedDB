import {types, getRoot} from "mobx-state-tree"

export default types
    .model({
        id: types.identifierNumber,
        name: types.string,
        keyPath: types.string
    })
    .volatile(self => ({
        db: {}
    }))
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
        }
    }))
    .views(self => ({
        get transaction() {
            const {db} = getRoot(self)
            const transaction = db.transaction(self.name, "readwrite")
            return transaction.objectStore(self.name)
        }
    }))
