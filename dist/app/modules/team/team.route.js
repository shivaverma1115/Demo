"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const team_controller_1 = require("./team.controller");
const adminVerify_1 = __importDefault(require("../../../middleware/adminVerify"));
const teamRoute = express_1.default.Router();
// all Routes
teamRoute.post("/create-team-member", team_controller_1.createTeamMember);
teamRoute.get("/team-member", team_controller_1.allTeamMember);
teamRoute.get("/single-member/:id", team_controller_1.getSingleMember);
teamRoute.get("/team-member-admin", team_controller_1.getTeamMember);
teamRoute.get("/search-users", team_controller_1.searchMember);
teamRoute.put("/update-team-info", adminVerify_1.default, team_controller_1.updateTeamInfo);
teamRoute.put("/update-banner", adminVerify_1.default, team_controller_1.updateTeamBannerImage);
teamRoute.delete("/delete-user", adminVerify_1.default, team_controller_1.deleteMember);
exports.default = teamRoute;
