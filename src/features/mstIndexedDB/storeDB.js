import databaseIDB from "./shared/databaseIDB"

export default databaseIDB
    .create({
        dbName: "db",
        stores: [
            {
                id: 1,
                name: 'stairs',
                keyPath: 'id',
            }
        ]
    })
