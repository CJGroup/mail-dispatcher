export interface ListAPIBody {
    nickname: string,
    mail: string,
}

export interface ListBatchAPIBody {
    list: ListAPIBody[]
}

export type ListMember = ListAPIBody;

export interface ListSendBody {
    number: number,
}

export interface User {
    id: number,
    nickname: string,
    mail: string,
    isValidated?: boolean,
}

export interface Store {
    count: number,
    idl: number
    list: User[],
}

export interface BookInfo {
    pos: number,
    total: number,
}
