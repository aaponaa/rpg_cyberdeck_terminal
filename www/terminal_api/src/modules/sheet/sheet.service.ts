import { Sheet, SheetModel } from '@/modules/sheet/models/sheet.model'
import fs from 'fs'
import { Campaign } from '@/modules/campaign/models/campaign.model'
import CampaignService from '@/modules/campaign/campaign.service'

class SheetService {
    public findSheetsForUser(username: string): Promise<SheetModel[]> {
        return Promise.all(this.userSheetsId(username).map((id) => this.findSheet(id)))
    }

    public findSheetsForCampaign(campaignId: string): Promise<SheetModel[]> {
        const campaigns = require('@/data/campaigns.json')['campaigns'] as Campaign[]
        const players = campaigns.find((c) => c.id === campaignId)?.players ?? []
        return Promise.all(players.filter((p) => p.character).map((p) => this.findSheet(p.character)))
    }

    public findSheet(id: string): Promise<SheetModel> {
        const sheet = this.sheet(id)
        if (sheet) {
            return CampaignService.findCampaign(sheet.campaign).then((c) => {
                return {
                    ...sheet,
                    campaign: c,
                }
            })
        } else {
            return Promise.resolve(undefined)
        }
    }

    private userSheetsId(username: string): string[] {
        const path = `src/data/users/user-characters.json`
        if (fs.existsSync(path)) {
            return require(path)[username] ?? []
        } else {
            return []
        }
    }

    characterImagePath(id: string): string {
        const sheet = this.sheet(id)
        return `src/data/images/${sheet?.image ?? 'unknown.png'}`
    }

    private sheet(id: string): Sheet {
        const path = `src/data/sheets/${id}.json`
        if (fs.existsSync(path)) {
            return require(path) as Sheet
        } else {
            return undefined
        }
    }
}

export default new SheetService()
