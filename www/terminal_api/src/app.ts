import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import sheetRouter from './routes/sheet.controller';
import {RouteConfig} from "@/modules/common/route-config";
import {AuthRoutes} from "@/modules/auth/auth.route";
import {SheetRoutes} from "@/routes/sheet.route";

const app = express();
const routes: Array<RouteConfig> = [];
const PORT = 8080;
const trustedHost = ["http://localhost:3001", "http://localhost:3000"]

// const corsOptions = {
//     origin: trustedHost,
//     credentials: true
// };

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: false
}));


app.use(cors());
// app.use("/auth", userRouter)
routes.push(new AuthRoutes(app));
routes.push(new SheetRoutes(app));

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
    routes.forEach((route: RouteConfig) => {
        console.log(`Routes configured for ${route.getName()}`)
    })
});

export default app;


