export interface ListAPIBody {
    nickname: string,
    mail: string,
}

export interface User {
    id: number,
    nickname: string,
    mail: string,
    isValidated?: boolean,
}
