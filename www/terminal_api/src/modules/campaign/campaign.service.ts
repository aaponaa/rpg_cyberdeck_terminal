import fs from 'fs/promises'
import { Campaign, CampaignPlayer } from '@/modules/campaign/models/campaign.model'
import { v4 } from 'uuid'

class CampaignService {
    constructor() {}

    findAllCampaigns(): Promise<Campaign[]> {
        const campaigns = require('@/data/campaigns.json')
        return Promise.resolve(campaigns.campaigns)
    }

    findCampaignsByDm(dm: string): Promise<Campaign[]> {
        return this.findAllCampaigns().then((campaigns) => {
            return campaigns.filter((c) => c.dm === dm)
        })
    }

    findCampaignsByPlayer(player: string): Promise<Campaign[]> {
        return this.findAllCampaigns().then((campaigns) => {
            return campaigns.filter((c) => c.players.map(p => p.user).includes(player))
        })
    }

    findCampaign(id: string): Promise<Campaign | undefined> {
        return this.findAllCampaigns().then((campaigns) => {
            return campaigns.find((c) => c.id === id)
        })
    }

    createCampaign(campaign: Omit<Campaign, 'id'>): Promise<Campaign> {
        return this.findAllCampaigns().then((campaigns) => {
            const newCampaign = {
                id: v4(),
                ...campaign,
            }
            campaigns.push(newCampaign)
            return fs.writeFile('src/data/campaigns.json', JSON.stringify({ campaigns })).then(() => {
                return newCampaign
            })
        })
    }

    updateCampaign(campaign: Campaign): Promise<Campaign> {
        return this.findAllCampaigns().then((campaigns) => {
            campaigns = campaigns.filter((c) => c.id !== campaign.id)
            campaigns.push(campaign)
            return fs.writeFile('src/data/campaigns.json', JSON.stringify({ campaigns })).then(() => {
                return campaign
            })
        })
    }
}

export default new CampaignService()
