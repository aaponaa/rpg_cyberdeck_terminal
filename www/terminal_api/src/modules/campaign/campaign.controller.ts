import { NextFunction, Request, Response } from 'express'
import CampaignService from '@/modules/campaign/campaign.service'
import { getLocale } from '@/modules/common/utils'
import TranslationService from '@/modules/common/translation.service'
import { Campaign } from '@/modules/campaign/models/campaign.model'
import AuthService from '@/modules/users/user.service'
import SheetService from '@/modules/sheet/sheet.service'

type ValidationError = { key: string; args?: string[] }

class CampaignController {
    campaigns(req: Request, res: Response, next: NextFunction) {
        let promise
        if (req.query.dm) {
            promise = CampaignService.findCampaignsByDm(req.query.dm as string)
        } else if (req.query.player) {
            promise = CampaignService.findCampaignsByPlayer(req.query.player as string)
        } else {
            promise = CampaignService.findAllCampaigns()
        }
        promise.then((campaigns) => {
            res.status(200).json(campaigns)
        })
    }

    createCampaign(req: Request, res: Response, next: NextFunction) {
        CampaignController.validateCampaignCreationData(req.body).then((errors) => {
            if (errors.length > 0) {
                res.status(400).json({
                    errors: errors.map((e) => TranslationService.translate(getLocale(req), e.key, ...(e.args ?? []))),
                })
            } else {
                CampaignService.createCampaign(req.body).then((campaign) => {
                    res.json(campaign)
                })
            }
        })
    }

    updateCampaign(req: Request, res: Response, next: NextFunction) {
        CampaignController.validateCampaignCreationData(req.body).then((errors) => {
            if (errors.length > 0) {
                res.status(400).json({
                    errors: errors.map((e) => TranslationService.translate(getLocale(req), e.key, ...(e.args ?? []))),
                })
            } else {
                CampaignService.updateCampaign({
                    id: req.params.id,
                    ...req.body,
                }).then((campaign) => {
                    res.json(campaign)
                })
            }
        })
    }

    private static validateCampaignCreationData(campaign: Omit<Campaign, 'id'>): Promise<ValidationError[]> {
        const errors = []
        if (!campaign.name) {
            errors.push({
                key: 'campaign.creation.missingName',
            })
        }
        if (!campaign.dm) {
            errors.push({
                key: 'campaign.creation.missingDM',
            })
        }
        return AuthService.findUsers().then((users) => {
            if (campaign.dm && !users.find((u) => u.username === campaign.dm)) {
                errors.push({
                    key: 'campaign.creation.unknownDM',
                    args: [campaign.dm],
                })
            }
            campaign.players?.forEach((player) => {
                if (!users.find((u) => u.username === player.user)) {
                    errors.push({
                        key: 'campaign.creation.unknownPlayer',
                        args: [player.user],
                    })
                }
            })

            const promises = []
            campaign.players
                ?.filter((player) => player.character)
                .forEach((player) => {
                    promises.push(
                        SheetService.findSheet(player.character).then((sheet) => {
                            if (!sheet) {
                                errors.push({
                                    key: 'campaign.creation.unknownSheet',
                                    args: [player.user],
                                })
                            }
                        }),
                    )
                })

            return Promise.all(promises).then((results) => errors)
        })
    }

    campaign(req: Request, res: Response, next: NextFunction) {
        CampaignService.findCampaign(req.params.id).then((campaign) => {
            if (campaign) {
                res.json(campaign)
            } else {
                res.sendStatus(404)
            }
        })
    }
}

export default new CampaignController()
