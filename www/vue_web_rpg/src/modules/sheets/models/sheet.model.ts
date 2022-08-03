import type { PersonalData } from '@/modules/sheets/models/personal-data.model'
import type { Attribute, Attributes } from '@/modules/sheets/models/attribute.model'
import type { Campaign } from '@/modules/campaign/models/campaign.model'

export type Sheet = {
    id: string
    campaign: Campaign
    personalData: PersonalData
    attributes: {
        [rel in Attributes]: Attribute
    }
}
