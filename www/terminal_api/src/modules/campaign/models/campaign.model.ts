export type Campaign = {
    id: string
    name: string
    dm: string
    players: CampaignPlayer[]
}

export type CampaignPlayer = {
    user: string;
    character?: string;
}

export type CampaignCreationData = {
    name: string
    dm: string
    players: string[]
}