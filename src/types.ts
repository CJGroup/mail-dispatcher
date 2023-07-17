export interface ListAPIBody {
    nickname: string,
    mail: string,
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
