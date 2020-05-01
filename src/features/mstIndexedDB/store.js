import databaseIDB from "./shared/databaseIDB"

export default databaseIDB
    .create({
        dbName: "db",
        stores: [
            {
                id: 1,
                name: 'stairs',
                keyPath: 'id',
                dataListUrl: 'https://dnk-zamer.firebaseio.com/stairs.json'
            }
        ]
    })
