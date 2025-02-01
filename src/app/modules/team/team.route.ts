import express from "express";
import {
  allTeamMember,
  createTeamMember,
  deleteMember,
  getSingleMember,
  getTeamMember,
  searchMember,
  updateTeamBannerImage,
  updateTeamInfo,
} from "./team.controller";
import verifyToken from "../../../middleware/userVerify";
import adminVerify from "../../../middleware/adminVerify";

const teamRoute = express.Router();
// all Routes
teamRoute.post("/create-team-member", createTeamMember);
teamRoute.get("/team-member", allTeamMember);
teamRoute.get("/single-member/:id", getSingleMember);
teamRoute.get("/team-member-admin", getTeamMember);
teamRoute.get("/search-users", searchMember);

teamRoute.put("/update-team-info", adminVerify, updateTeamInfo);
teamRoute.put("/update-banner", adminVerify, updateTeamBannerImage);
teamRoute.delete("/delete-user", adminVerify, deleteMember);

export default teamRoute;
