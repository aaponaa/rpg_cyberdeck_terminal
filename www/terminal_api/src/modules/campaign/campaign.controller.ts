import {NextFunction, Request, Response} from "express"
import CampaignService from "@/modules/campaign/campaign.service";
import {getLocale} from "@/modules/common/utils";
import TranslationService from "@/modules/common/translation.service";
import {Campaign} from "@/modules/campaign/models/campaign.model";
import AuthService from "@/modules/users/user.service";

type ValidationError = { key: string, args?: string[] };

class CampaignController {

    campaigns(req: Request, res: Response, next: NextFunction): Promise<Response> {
        let promise;
        if (req.query.dm) {
            promise = CampaignService.findCampaignsByDm(req.query.dm as string)
        } else if (req.query.player) {
            promise = CampaignService.findCampaignsByPlayer(req.query.player as string)
        } else {
            promise = CampaignService.findAllCampaigns();
        }
        return promise.then(campaigns => {
            return res.status(200).json(campaigns);
        })
    }

    createCampaign(req: Request, res: Response, next: NextFunction): Promise<Response> {
        return CampaignController.validateCampaignCreationData(req.body).then(errors => {
            if (errors.length > 0) {
                return res.status(400).json({
                    errors: errors.map(e => TranslationService.translate(getLocale(req), e.key, ...(e.args ?? [])))
                })
            } else {
                return CampaignService.createCampaign(req.body).then(campaign => {
                    return res.status(200).json(campaign);
                })
            }
        })
    }

    private static validateCampaignCreationData(campaign: Omit<Campaign, "id">): Promise<ValidationError[]> {
        const errors = [];
        if (!campaign.name) {
            errors.push({
                key: "campaign.creation.missingName"
            });
        }
        if (!campaign.dm) {
            errors.push({
                key: "campaign.creation.missingDM"
            });
        }
        return AuthService.findUsers().then(users => {
            if (campaign.dm && !users.find(u => u.username === campaign.dm)) {
                errors.push({
                    key: "campaign.creation.unknownDM",
                    args: [campaign.dm]
                });
            }
            campaign.players?.forEach(player => {
                if (!users.find(u => u.username === player)) {
                    errors.push({
                        key: "campaign.creation.unknownPlayer",
                        args: [player]
                    });
                }
            });
            return errors;
        })
    }
}

export default new CampaignController();