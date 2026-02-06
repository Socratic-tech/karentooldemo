import {
  Client,
  TablesDB,
  ID,
  type Models,
  Permission,
  Role,
} from 'node-appwrite'
import type { Students, HabitEntries } from './appwrite.types'

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!)

const tablesDB = new TablesDB(client)

export const db = {
  students: {
    create: (
      data: Omit<Students, keyof Models.Row>,
      options?: { rowId?: string; permissions?: string[] },
    ) =>
      tablesDB.createRow<Students>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'students',
        rowId: options?.rowId ?? ID.unique(),
        data,
        permissions: [
          Permission.write(Role.user(data.createdBy)),
          Permission.read(Role.user(data.createdBy)),
          Permission.update(Role.user(data.createdBy)),
          Permission.delete(Role.user(data.createdBy)),
        ],
      }),
    get: (id: string) =>
      tablesDB.getRow<Students>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'students',
        rowId: id,
      }),
    update: (
      id: string,
      data: Partial<Omit<Students, keyof Models.Row>>,
      options?: { permissions?: string[] },
    ) =>
      tablesDB.updateRow<Students>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'students',
        rowId: id,
        data,
        ...(options?.permissions ? { permissions: options.permissions } : {}),
      }),
    delete: (id: string) =>
      tablesDB.deleteRow({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'students',
        rowId: id,
      }),
    list: (queries?: string[]) =>
      tablesDB.listRows<Students>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'students',
        queries,
      }),
  },
  habitEntries: {
    create: (
      data: Omit<HabitEntries, keyof Models.Row>,
      options?: { rowId?: string; permissions?: string[] },
    ) =>
      tablesDB.createRow<HabitEntries>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'habit_entries',
        rowId: options?.rowId ?? ID.unique(),
        data,
        permissions: [
          Permission.write(Role.user(data.createdBy)),
          Permission.read(Role.user(data.createdBy)),
          Permission.update(Role.user(data.createdBy)),
          Permission.delete(Role.user(data.createdBy)),
        ],
      }),
    get: (id: string) =>
      tablesDB.getRow<HabitEntries>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'habit_entries',
        rowId: id,
      }),
    update: (
      id: string,
      data: Partial<Omit<HabitEntries, keyof Models.Row>>,
      options?: { permissions?: string[] },
    ) =>
      tablesDB.updateRow<HabitEntries>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'habit_entries',
        rowId: id,
        data,
        ...(options?.permissions ? { permissions: options.permissions } : {}),
      }),
    delete: (id: string) =>
      tablesDB.deleteRow({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'habit_entries',
        rowId: id,
      }),
    list: (queries?: string[]) =>
      tablesDB.listRows<HabitEntries>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'habit_entries',
        queries,
      }),
  },
}
