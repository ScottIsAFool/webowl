export const genderTypes = ['male', 'female', 'non-binary', 'other'] as const
export const ageTypes = ['junior', 'adult', 'senior'] as const

export type Gender = typeof genderTypes[number]
export type AgeType = typeof ageTypes[number]

export type Player = {
    id: number
    name: string
    gender: Gender
    ageType: AgeType
    dob?: Date
} & (
    | {
          isFloatingSub: true
      }
    | {
          isFloatingSub: false
          teamId: number
      }
)
