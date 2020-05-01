import {types} from "mobx-state-tree"
import baseStoreIDB from "../private/baseStoreIDB"

export default types.compose(baseStoreIDB, types
    .model({
        id: types.identifierNumber,
        name: types.string,
        keyPath: types.string,
        autoIncrement: true,
    })
    .actions(self => ({}))
)