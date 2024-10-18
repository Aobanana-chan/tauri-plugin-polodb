import { invoke } from '@tauri-apps/api/core';
import { omit } from 'lodash';

async function exec(command, args) {
    try {
        return {
            success: true,
            data: await invoke(`plugin:polodb|${command}`, args),
        };
    }
    catch (e) {
        try {
            return {
                success: false,
                error: Object.keys(e)[0],
                context: e[Object.keys(e)[0]],
            };
        }
        catch (u) {
            return {
                success: false,
                error: "unknown",
                context: u,
            };
        }
    }
}
async function list_databases() {
    return await exec("list_databases");
}
async function list_collections(database) {
    return await exec("list_collections", { database });
}
async function open_database(key, path) {
    return await exec("open_database", { key, path });
}
async function close_database(key) {
    return await exec("close_database", { key });
}
async function insert(database, collection, documents) {
    return await exec("insert", { database, collection, documents });
}
async function insert_one(database, collection, document) {
    return await exec("insert_one", { database, collection, document });
}
async function find_many(database, collection, query, sorting) {
    return await exec("find", {
        database,
        collection,
        query,
        sorting: sorting ?? null,
    });
}
async function find_all(database, collection, sorting) {
    return await exec("find_all", {
        database,
        collection,
        sorting: sorting ?? null,
    });
}
async function find_one(database, collection, query) {
    return await exec("find_one", {
        database,
        collection,
        query,
    });
}
async function delete_many(database, collection, query) {
    return await exec("delete", {
        database,
        collection,
        query,
    });
}
async function delete_all(database, collection) {
    return await exec("delete_all", {
        database,
        collection,
    });
}
async function delete_one(database, collection, query) {
    return await exec("delete_one", {
        database,
        collection,
        query,
    });
}
async function update_many(database, collection, query, update, upsert) {
    return await exec("update", {
        database,
        collection,
        query,
        update,
        upsert: upsert ?? false,
    });
}
async function update_all(database, collection, update, upsert) {
    return await exec("update_all", {
        database,
        collection,
        update,
        upsert: upsert ?? false,
    });
}
async function update_one(database, collection, query, update, upsert) {
    return await exec("update_one", {
        database,
        collection,
        query,
        update,
        upsert: upsert ?? false,
    });
}

function isSuccess(result) {
    return result.success;
}
function isError(result) {
    return !result.success;
}

class Database {
    constructor(key) {
        this._key = key;
        this._closed = false;
    }
    get key() {
        return this._key;
    }
    get closed() {
        return this._closed;
    }
    check() {
        if (this.closed) {
            throw Error("Cannot operate on a closed database.");
        }
    }
    static async open(key, path) {
        const db = await open_database(key, path);
        return db.success ? new Database(key) : null;
    }
    static async list_databases() {
        const result = await list_databases();
        return result.success ? result.data : [];
    }
    static async attach(key) {
        return (await Database.list_databases()).includes(key)
            ? new Database(key)
            : null;
    }
    async collections() {
        this.check();
        const res = await list_collections(this.key);
        return res.success ? res.data : [];
    }
    async close() {
        this.check();
        const res = await close_database(this.key);
        if (res.success) {
            this._closed = true;
            return true;
        }
        else {
            return false;
        }
    }
    collection(name) {
        this.check();
        return new Collection(this, name);
    }
}
class Collection {
    constructor(_database, _name) {
        this._database = _database;
        this._name = _name;
    }
    get databaseObject() {
        return this._database;
    }
    get name() {
        return this._name;
    }
    get database() {
        return this._database.key;
    }
    check() {
        this._database.check();
    }
    makeDocuments(...objects) {
        return objects.map((v) => (Object.keys(v).includes("_id")
            ? Object.keys(v._id).includes("$oid")
                ? { _id: v._id["$oid"], ...omit(v, "_id") }
                : { _id: null, ...omit(v, "_id") }
            : v));
    }
    async find(query, sort) {
        this.check();
        const result = await find_many(this.database, this.name, query, sort);
        return result.success ? this.makeDocuments(...result.data) : [];
    }
    async find_one(query) {
        this.check();
        const result = await find_one(this.database, this.name, query);
        return result.success ? this.makeDocuments(...result.data)[0] : null;
    }
    async all(sort) {
        this.check();
        const result = await find_all(this.database, this.name, sort);
        return result.success ? this.makeDocuments(...result.data) : [];
    }
    async get(id) {
        return await this.find_one({ _id: { $oid: id } });
    }
    async insert(...documents) {
        this.check();
        const result = await insert(this.database, this.name, documents);
        return result.success ? result.data : null;
    }
    async delete_many(query) {
        this.check();
        const result = await delete_many(this.database, this.name, query);
        return result.success ? result.data : null;
    }
    async delete_one(query) {
        this.check();
        const result = await delete_one(this.database, this.name, query);
        return result.success ? result.data : null;
    }
    async delete_all() {
        this.check();
        const result = await delete_all(this.database, this.name);
        return result.success ? result.data : null;
    }
    async update_many(query, update, upsert) {
        this.check();
        const result = await update_many(this.database, this.name, query, update, upsert);
        return result.success ? result.data : null;
    }
    async update_one(query, update, upsert) {
        this.check();
        const result = await update_one(this.database, this.name, query, update, upsert);
        return result.success ? result.data : null;
    }
    async update_all(update, upsert) {
        this.check();
        const result = await update_all(this.database, this.name, update, upsert);
        return result.success ? result.data : null;
    }
}

export { Collection, Database, close_database, delete_all, delete_many, delete_one, find_all, find_many, find_one, insert, insert_one, isError, isSuccess, list_collections, list_databases, open_database, update_all, update_many, update_one };
