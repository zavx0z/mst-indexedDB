import {types, getRoot, flow} from "mobx-state-tree"

export default types
    .model({})
    .actions(self => ({
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
                        request.onsuccess = (e) => {
                            const id = e.target.result
                            const item = store.get(id)
                            item.onsuccess = (e) => {
                                resolve(e.target.result)
                            }
                        }
                        request.onerror = () =>
                            reject(request.error)
                    })
                } catch (e) {
                    return Promise.reject(e)
                }
        }),
        remove: flow(function* (id) {
            try {
                const store = yield self._getStoreTransaction()
                return new Promise(resolve => {
                    const request = store.delete(id)
                    request.onsuccess = (e => resolve(e))
                })
            }catch(e){
                return Promise.reject(e)
            }
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