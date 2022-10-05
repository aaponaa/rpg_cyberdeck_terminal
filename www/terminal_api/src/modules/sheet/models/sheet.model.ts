import { PersonalData } from '@/modules/sheet/models/personal-data.model'
import { Attribute, Attributes } from '@/modules/sheet/models/attribute.model'
import { Campaign } from '@/modules/campaign/models/campaign.model'
import { Skills } from '@/modules/sheet/models/skill.model'

export type Sheet = {
    user: string,
    campaign: string
    image?: string
    personalData: PersonalData
    public: boolean;
    skills: {
        [rel in Attributes]: Attribute
    }
    skill: Skills
}

export type SheetModel = Omit<Sheet, 'campaign'> & {
    campaign?: Campaign
}
