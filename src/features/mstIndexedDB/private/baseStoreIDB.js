import {types, getRoot, flow} from "mobx-state-tree"

export default types
    .model({})
    .volatile(self => ({
        items: [],
    }))
    .actions(self => ({
        afterCreate() {
            self.getItems()
                .then(its => self.setItems(its))
                .catch(e => console.log(e))
        },
        setItems(items) {
            self.items = items
        },
        getItems: flow(function* () {
            try {
                const store = yield self._getStoreTransaction()
                let request = store.openCursor()
                return new Promise((resolve, reject) => {
                    const items = []
                    request.onsuccess = () => {
                        let cursor = request.result
                        if (cursor) {
                            items.push(cursor.value)
                            cursor.continue()
                        } else resolve(items)
                    }
                })
            } catch (e) {
                return Promise.reject(e)
            }
        }),
        add: flow(function* (data) {
            if (data)
                try {
                    const store = yield self._getStoreTransaction()
                    const request = store.add(data)
                    return new Promise((resolve, reject) => {
                        request.onsuccess = () => {
                            self.getItems().then(its => self.setItems(its))
                            resolve()
                        }
                        request.onerror = () =>
                            reject(request.error)
                    })
                } catch (e) {
                    return Promise.reject(e)
                }
        }),
        remove: flow(function* (id) {
            const store = yield self._getStoreTransaction()
            store.delete(id)
            self.getItems().then(its => self.setItems(its))
        }),
        update() {
        },
        _getStoreTransaction: flow(function* () {
            const root = getRoot(self)
            try {
                const db = yield root.getDB()
                const transaction = db.transaction(self.name, "readwrite")
                return transaction.objectStore(self.name)
            } catch (e) {
                return Promise.reject(e)
            }
        })
    }))