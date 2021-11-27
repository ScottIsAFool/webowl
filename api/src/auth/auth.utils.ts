/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import passwordValidator from 'password-validator'
import { EncryptionTransformer } from 'typeorm-encrypted'
import { getConfiguration } from '../config/configuration'

const passwordSchema = new passwordValidator()
    .is()
    .min(8)
    .is()
    .max(50)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits()
    .has()
    .symbols()
    .has()
    .not()
    .spaces()
    .is()
    .not()
    .oneOf([
        /*TODO*/
    ]) as passwordValidator

export function isValidPassword(password: string): boolean {
    const isValid = passwordSchema.validate(password)
    return typeof isValid === 'boolean' && isValid
}

export function getEncryptionTransformer(): EncryptionTransformer | undefined {
    if (process.env.JWT_TOKEN === undefined) return

    const encryptionOptions = getConfiguration().database.encryption

    return new EncryptionTransformer(encryptionOptions)
}
