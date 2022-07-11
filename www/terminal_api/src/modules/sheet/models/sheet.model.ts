import { PersonalData } from '@/modules/sheet/models/personal-data.model'
import { Skill, SkillType } from '@/modules/sheet/models/skill.model'

export type Sheet = {
    campaign: string
    personalData: PersonalData
    skills: {
        [rel in SkillType]: Skill
    }
}
