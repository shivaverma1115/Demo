"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTeamBannerImage = exports.updateTeamInfo = exports.deleteMember = exports.searchMember = exports.getTeamMember = exports.getSingleMember = exports.allTeamMember = exports.createTeamMember = void 0;
const team_model_1 = require("./team.model");
const createTeamMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const TeamInfo = req.body;
        const { title } = TeamInfo;
        const alreayExist = yield team_model_1.Team.findOne({ title: title });
        if (alreayExist) {
            res.send({ message: "Already Exist" });
        }
        else {
            const newTeamInfo = new team_model_1.Team(TeamInfo);
            yield newTeamInfo.save();
            res.status(200).send({ message: "success" });
        }
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.createTeamMember = createTeamMember;
const allTeamMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTeamMembers = yield team_model_1.Team.find({});
        res.status(200).send(allTeamMembers);
    }
    catch (error) {
        res.status(500).send({ message: "custom error" });
    }
});
exports.allTeamMember = allTeamMember;
const getSingleMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teamMember = yield team_model_1.Team.find({ _id: req.params.id });
        if (!teamMember) {
            return res.send({ message: "custom error" });
        }
        res.status(200).send({
            data: teamMember,
        });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.getSingleMember = getSingleMember;
const getTeamMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const skip = (parsedPage - 1) * parsedLimit;
        const users = yield team_model_1.Team.find({})
            .sort({ date: -1 })
            .skip(skip)
            .limit(parsedLimit);
        const totaluserCount = yield team_model_1.Team.countDocuments();
        const totalPages = Math.ceil(totaluserCount / parsedLimit);
        res.status(200).send({
            users,
            totalPages,
            currentPage: parsedPage,
            totalProducts: totaluserCount,
        });
    }
    catch (e) {
        res.status(500).send({ message: "custom error" });
    }
});
exports.getTeamMember = getTeamMember;
const searchMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = req.query.search;
        let keywordArray = [];
        if (searchQuery && typeof searchQuery === "string") {
            keywordArray = searchQuery.split(",");
        }
        else if (Array.isArray(searchQuery)) {
            keywordArray = searchQuery;
        }
        const keywordFilter = keywordArray.map((keyword) => ({
            $or: [
                { email: { $regex: keyword, $options: "i" } },
                { title: { $regex: keyword, $options: "i" } },
            ],
        }));
        const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
        const result = yield team_model_1.Team.find(query).sort({ date: -1 });
        res.send(result);
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.searchMember = searchMember;
const deleteMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield team_model_1.Team.deleteOne({ _id: req.query.id });
        if (result.deletedCount === 1) {
            res.send({ message: "success" });
        }
        else {
            res.send({ message: "something is wrong" });
        }
    }
    catch (err) {
        res.send({ message: "Error occurred while deleting user history" });
    }
});
exports.deleteMember = deleteMember;
// update team info
const updateTeamInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, title, subTitle, aboutMe, phone, email, location, skills, facebook, twitter, instagram, linkedin, } = req.body;
        yield team_model_1.Team.updateOne({ _id: id }, {
            $set: {
                title,
                subTitle,
                aboutMe,
                phone,
                email,
                location,
                skills,
                facebook,
                twitter,
                instagram,
                linkedin,
            },
        });
        res.send({ message: "success" });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.updateTeamInfo = updateTeamInfo;
const updateTeamBannerImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, img, imgTwo, imgThree } = req.body;
        yield team_model_1.Team.updateOne({ _id: id }, {
            $set: {
                img,
                imgTwo,
                imgThree,
            },
        });
        res.send({ message: "success" });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.updateTeamBannerImage = updateTeamBannerImage;
