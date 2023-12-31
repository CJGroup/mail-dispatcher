import * as bcrypt from 'bcrypt'

const saltRounds = 10;

export function encrypt(plain:string):string{
    return bcrypt.hashSync(plain, 10)
}

export function verify(obj:string, tar:string):boolean {
    return bcrypt.compareSync(obj, tar);
}