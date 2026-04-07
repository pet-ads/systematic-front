// Images
import Bean01 from "../assets/images/landing/collaboratorsPhotos/Bean01.jpg";
import Bean02 from "../assets/images/landing/collaboratorsPhotos/Bean.02jpg.jpg";
import Bean03 from "../assets/images/landing/collaboratorsPhotos/Bean.03.webp";
import Bean04 from "../assets/images/landing/collaboratorsPhotos/Bean.04.jpeg";

import Nick01 from "../assets/images/landing/collaboratorsPhotos/Nick01jpg.jpg";
import Nick02 from "../assets/images/landing/collaboratorsPhotos/Nick02.jpeg";
import Nick03 from "../assets/images/landing/collaboratorsPhotos/Nick03.jpg";
import Nick04 from "../assets/images/landing/collaboratorsPhotos/Nick04.jpeg";

import Sammy01 from "../assets/images/landing/collaboratorsPhotos/Sammy01.jpeg";
import Sammy02 from "../assets/images/landing/collaboratorsPhotos/Sammy02.jpg";
import Sammy03 from "../assets/images/landing/collaboratorsPhotos/Sammy03.webp";
import Sammy04 from "../assets/images/landing/collaboratorsPhotos/Sammy04.jpeg";

export type Collaborator = {
  name: string;
  photo: string;
  github: string;
  filiacao: string;
};

export const collaboratorsContent: Collaborator[] = [
  {
    name: "Dr. Banana Bean",
    photo: Bean02,
    github: "https://github.com/pet-ads",
    filiacao: "affiliations.ads_ifsp",
  },
  {
    name: "Sir Frijoles Bean III",
    photo: Bean03,
    github: "https://github.com/pet-ads",
    filiacao: "affiliations.software_unb",
  },
  {
    name: "Baron Von Beanstalk",
    photo: Bean04,
    github: "https://github.com/pet-ads",
    filiacao: "affiliations.msc_usp",
  },
  {
    name: "Countess Lima Bean",
    photo: Bean01,
    github: "https://github.com/pet-ads",
    filiacao: "affiliations.msc_usp",
  },
  {
    name: "Captain Nick Noodle",
    photo: Nick01,
    github: "https://github.com/pet-ads",
    filiacao: "affiliations.software_unb",
  },
  {
    name: "Sergeant Spaghetti Nick",
    photo: Nick02,
    github: "https://github.com/pet-ads",
    filiacao: "affiliations.software_unb",
  },
  {
    name: "Major Meatball Nick",
    photo: Nick03,
    github: "https://github.com/pet-ads",
    filiacao: "affiliations.ads_ifsp",
  },
  {
    name: "Doctor Linguine Nick",
    photo: Nick04,
    github: "https://github.com/pet-ads",
    filiacao: "affiliations.msc_usp",
  },
  {
    name: "Master Sammy Spork",
    photo: Sammy01,
    github: "https://github.com/pet-ads",
    filiacao: "affiliations.ads_ifsp",
  },
  {
    name: "Professor Sammy Spoon",
    photo: Sammy02,
    github: "https://github.com/pet-ads",
    filiacao: "affiliations.software_unb",
  },
  {
    name: "Miss Forky Sammy",
    photo: Sammy03,
    github: "https://github.com/pet-ads",
    filiacao: "affiliations.msc_usp",
  },
  {
    name: "Lady Spatula Sammy",
    photo: Sammy04,
    github: "https://github.com/pet-ads",
    filiacao: "affiliations.ads_ifsp",
  },
];

export default collaboratorsContent;
