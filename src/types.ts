export interface ListAPIBody {
    nickname: string,
    mail: string,
    serverID?: string,
}

export interface ListBatchAPIBody {
    list: ListAPIBody[]
}

export type ListMember = ListAPIBody;

export interface ListSendBody {
    number: number,
}

export interface Player {
    id: number,
    nickname: string,
    mail: string,
    serverID?: string,
    isValidated?: boolean,
}

export interface Store {
    count: number,
    idl: number
    list: Player[],
}

export interface BookInfo {
    pos: number,
    total: number,
}

export interface FeishuLogin {
    code: string,
}

export interface PasswordLoginBody {
    username: string,
    password: string,
}

export interface UserSettingBody {
    openID: string,
    unionID: string,
    permission: number,
}

export interface User extends UserSettingBody {
    name: string,
    password: string,
}