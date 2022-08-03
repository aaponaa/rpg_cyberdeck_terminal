import { NextFunction, Request, Response } from 'express'
import SheetService from '@/modules/sheet/sheet.service'
import fs from 'fs'
import Jwt from '@/modules/auth/jwt'

class SheetController {
    sheets(req: Request, res: Response, next: NextFunction) {
        SheetService.findSheetsForUser(req.query.name as string).then((sheets) => {
            res.json(sheets)
        })
    }

    sheet(req: Request, res: Response, next: NextFunction) {
        SheetService.findSheet(req.params.id).then((sheet) => {
            if (sheet) {
                Jwt.getAuthenticatedUser(req).then((u) => {
                    // res.json(sheet)
                    let canSeeSheet = true;
                                    if (!sheet.public) {
                                        if (u !== sheet.user) {
                                            if (u !== sheet.campaign.dm) {
                                                canSeeSheet = false;
                                            }
                                        }
                                    }
                    if (!canSeeSheet) {
                        res.sendStatus(403);
                    } else {
                        // res.json(sheet);
                        res.sendStatus(403);
                    }
                })

            } else {
                res.sendStatus(404)
            }
        })
    }

    image(req: Request, res: Response, next: NextFunction) {
        const path = SheetService.characterImagePath(req.params.id)
        if (path) {
            fs.readFile(path, {}, (err, data) => {
                res.write(data)
            })
        } else {
            res.sendStatus(404)
        }
    }
}

export default new SheetController()
