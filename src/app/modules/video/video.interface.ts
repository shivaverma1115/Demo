export interface TeamMember {
    title: string;
    subTitle: string;
    img: string;
    imgTwo: string;
    imgThree: string;
    date: string;
    aboutMe: string;
    phone: string;
    email: string;
    location: string;
    skills: Skill[];
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  }
export interface IVideo {
    url: string;
    title: string;
    isExpired: boolean;
    createdAt: Date;
  }
  
  export interface Skill {
    skillName: string;
    precent: string;
  }