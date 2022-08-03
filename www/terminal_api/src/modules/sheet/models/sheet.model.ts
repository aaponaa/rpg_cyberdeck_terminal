import { PersonalData } from '@/modules/sheet/models/personal-data.model'
import { Attribute, Attributes } from '@/modules/sheet/models/attribute.model'
import { Campaign } from '@/modules/campaign/models/campaign.model'

export type Sheet = {
    user: string,
    campaign: string
    image?: string
    personalData: PersonalData
    public: boolean;
    skills: {
        [rel in Attributes]: Attribute
    }
}

export type SheetModel = Omit<Sheet, 'campaign'> & {
    campaign?: Campaign
}
