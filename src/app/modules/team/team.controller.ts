import { Request, Response } from "express";
import { Team } from "./team.model";

export const createTeamMember = async (req: Request, res: Response) => {
  try {
    const TeamInfo = req.body;
    const { title } = TeamInfo;
    const alreayExist = await Team.findOne({ title: title });
    if (alreayExist) {
      res.send({ message: "Already Exist" });
    } else {
      const newTeamInfo = new Team(TeamInfo);
      await newTeamInfo.save();
      res.status(200).send({ message: "success" });
    }
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const allTeamMember = async (req: Request, res: Response) => {
  try {
    const allTeamMembers = await Team.find({});
    res.status(200).send(allTeamMembers);
  } catch (error) {
    res.status(500).send({ message: "custom error" });
  }
};

export const getSingleMember = async (req: Request, res: Response) => {
  try {
    const teamMember = await Team.find({ _id: req.params.id });
    if (!teamMember) {
      return res.send({ message: "custom error" });
    }
    res.status(200).send({
      data: teamMember,
    });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const getTeamMember = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);
    const skip = (parsedPage - 1) * parsedLimit;
    const users = await Team.find({})
      .sort({ date: -1 })
      .skip(skip)
      .limit(parsedLimit);
    const totaluserCount = await Team.countDocuments();
    const totalPages = Math.ceil(totaluserCount / parsedLimit);
    res.status(200).send({
      users,
      totalPages,
      currentPage: parsedPage,
      totalProducts: totaluserCount,
    });
  } catch (e) {
    res.status(500).send({ message: "custom error" });
  }
};

export const searchMember = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.search;
    let keywordArray: any = [];

    if (searchQuery && typeof searchQuery === "string") {
      keywordArray = searchQuery.split(",");
    } else if (Array.isArray(searchQuery)) {
      keywordArray = searchQuery;
    }

    const keywordFilter = keywordArray.map((keyword: string) => ({
      $or: [
        { email: { $regex: keyword, $options: "i" } },
        { title: { $regex: keyword, $options: "i" } },
      ],
    }));

    const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
    const result = await Team.find(query).sort({ date: -1 });
    res.send(result);
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const result = await Team.deleteOne({ _id: req.query.id });
    if (result.deletedCount === 1) {
      res.send({ message: "success" });
    } else {
      res.send({ message: "something is wrong" });
    }
  } catch (err) {
    res.send({ message: "Error occurred while deleting user history" });
  }
};

// update team info

export const updateTeamInfo = async (req: Request, res: Response) => {
  try {
    const {
      id,
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
    } = req.body;
    await Team.updateOne(
      { _id: id },
      {
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
      }
    );

    

    res.send({ message: "success" });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const updateTeamBannerImage = async (req: Request, res: Response) => {
  try {
    const { id, img, imgTwo, imgThree } = req.body;
    await Team.updateOne(
      { _id: id },
      {
        $set: {
          img,
          imgTwo,
          imgThree,
        },
      }
    );

    res.send({ message: "success" });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};
