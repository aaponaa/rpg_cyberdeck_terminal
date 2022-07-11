import { Sheet } from '@/modules/sheet/models/sheet.model'
import fs from 'fs'
import { Campaign } from '@/modules/campaign/models/campaign.model'

class SheetService {
    findSheetsForUser(username: String): Promise<Sheet[]> {
        return Promise.resolve(SheetService.userSheets(username))
    }

    findSheetsForCampaign(campaignId: 'string'): Promise<Sheet[]> {
        const campaigns = require('@/data/campaigns.json')['campaigns'] as Campaign[]
        const players = campaigns.find((c) => c.id === campaignId)?.players ?? []
        const sheets = []
        players.forEach((player) => {
            sheets.push(...SheetService.userSheets(player).filter((s) => s.campaign === campaignId))
        })
        return Promise.resolve(sheets)
    }

    private static userSheets(username: String): Sheet[] {
        const path = `src/data/sheets/${username}.json`
        console.log(path)
        if (fs.existsSync(path)) {
            console.log('fdklfjdk')
            return require(path)['characters'] as Sheet[]
        } else {
            console.log(':(')
            return []
        }
    }
}

export default new SheetService()