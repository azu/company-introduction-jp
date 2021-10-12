import type { NextApiRequest, NextApiResponse } from "next";
import company from "../company.json";
export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        return;
    }
    res.status(200).json(company);
};
