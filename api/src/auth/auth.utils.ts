import passwordValidator from 'password-validator'

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
    ])

export const isValidPassword = (password: string): boolean => {
    const isValid = passwordSchema.validate(password)
    return typeof isValid === 'boolean' && isValid
}
