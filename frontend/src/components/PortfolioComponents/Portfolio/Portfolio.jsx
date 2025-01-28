import { useState } from "react";
import { useEffect } from "react";
import "./Portfolio.css";
import Header from "../header/Header";
import MainHeading from "../MainHeading/MainHeading";
import About from "../About/About";
import {
  faLinkedin,
  faGithub,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faCode, faCertificate } from "@fortawesome/free-solid-svg-icons";

function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [portfolioInfo, setPortfolioInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://portfolios-generator.onrender.com/api/data",
          {
            method: "POST",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          try {
            const fullData = await response.json();
            const data = fullData["data"];
            setPortfolioInfo({
              HEADERDATA: {
                links: [
                  { icon: faLinkedin, href: data["linkedin"] },
                  { icon: faGithub, href: data["github"] },
                  { icon: faYoutube, href: data["youtube"] },
                ],
                intro: {
                  name: data["name"],
                  title: data["job_title"],
                  links: {
                    cv: data["cv_link"],
                    email: `mailto:${data["email"]}`,
                  },
                },
                wordLogo: data["job_title_logo"],
              },
              ABOUTTEXT: data["about"],
              IMGDATA: [
                `https://portfolios-generator.onrender.com/${data["picture"]}`,
                data["name"],
              ],
              ABOUTCARDS: [
                {
                  icon: faCertificate,
                  title: data["card1title"],
                  info: data["card1info"],
                },
                {
                  icon: faCode,
                  title: data["card2title"],
                  info: data["card2info"],
                },
              ],
              ABOUTLINKS: [
                { name: "Let's talk", link: `mailto:${data["email"]}` },
                { name: data["aboutlinkonelabel"], link: data["aboutlinkone"] },
                { name: data["aboutlinktwolabel"], link: data["aboutlinktwo"] },
              ],
            });
            setLoading(false);
          } catch (e) {
            alert(`json`);
          }
        }
      } catch (e) {
        alert(`fetch`);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page">
      {!loading ? (
        <div className="container">
          <Header headerData={portfolioInfo.HEADERDATA} />
          <MainHeading subtitle="Get to know">About me</MainHeading>
          <About
            img={portfolioInfo.IMGDATA}
            cards={portfolioInfo.ABOUTCARDS}
            links={portfolioInfo.ABOUTLINKS}
          >
            {portfolioInfo.ABOUTTEXT}
          </About>
        </div>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
}

export default Portfolio;
