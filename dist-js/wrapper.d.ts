import { PartialDeep } from "type-fest";
export type Document<T extends object = any> = {
    _id: string | null;
} & T;
export declare class Database {
    private _key;
    private _closed;
    private constructor();
    get key(): string;
    get closed(): boolean;
    check(): void;
    static open(key: string, path: string): Promise<Database | null>;
    static list_databases(): Promise<string[]>;
    static attach(key: string): Promise<Database | null>;
    collections(): Promise<string[]>;
    close(): Promise<boolean>;
    collection<T extends object = any>(name: string): Collection<T>;
}
export declare class Collection<T extends object = any> {
    private _database;
    private _name;
    constructor(_database: Database, _name: string);
    get databaseObject(): Database;
    get name(): string;
    get database(): string;
    check(): void;
    private makeDocuments;
    find<Query extends object = PartialDeep<T>>(query: Query, sort?: any): Promise<Document<T>[]>;
    find_one<Query extends object = PartialDeep<T>>(query: Query): Promise<Document<T> | null>;
    all(sort?: any): Promise<Document<T>[]>;
    get(id: string): Promise<Document<T> | null>;
    insert(...documents: T[]): Promise<number | null>;
    delete_many<Query extends object = PartialDeep<T>>(query: Query): Promise<number | null>;
    delete_one<Query extends object = PartialDeep<T>>(query: Query): Promise<number | null>;
    delete_all(): Promise<number | null>;
    update_many<Query extends object = PartialDeep<T>>(query: Query, update: object, upsert?: boolean): Promise<number | null>;
    update_one<Query extends object = PartialDeep<T>>(query: Query, update: object, upsert?: boolean): Promise<number | null>;
    update_all(update: object, upsert?: boolean): Promise<number | null>;
}
