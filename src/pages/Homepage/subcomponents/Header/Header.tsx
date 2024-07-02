import { Box, Button, Flex } from "@chakra-ui/react";
import HeaderButton from "./subcomponents/HeaderButton";
import HeaderLink from "./subcomponents/HeaderLink";
import { HeaderTheme } from "./HeaterStyle";
import Logo from "../../../../../public/assets/StartLogos/startwhite.png";
import { Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import HomepageModal from "../../../../components/Modals/HomepageModal/Index";
import FormLogin from "../../../../components/Modals/HomepageModal/subcomponents/forms/formLogin/Index";
import FormSignup from "../../../../components/Modals/HomepageModal/subcomponents/forms/formSignup/Index";
import { color } from "chart.js/helpers";

interface IHeaderProps {
  show: boolean;
}

export default function Header({ show }: IHeaderProps) {
  enum LinkTypeEnum {
    GoToOtherPage = "GoToOtherPage",
    StayInSamePage = "StayInSamePage",
  }

  const showLinks = show;
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  function handleSignUpModal() {
    setIsLogin(false);
    setShowModal(true);
  }

  function handleLoginModal() {
    setIsLogin(true);
    setShowModal(true);
  }

  return (
    <>
      <HomepageModal show={showModal} onClose={() => setShowModal(false)}>
        {
          isLogin ? <FormLogin/> : <FormSignup redirectFormLogin={() => setIsLogin(true)}/>
        }
      </HomepageModal>

      <Flex sx={HeaderTheme}>
        <Flex width="auto" gap="10%" alignItems={"center"}>
          <Box>
            <Link to={"/"}>
              <Image src={Logo} alt="Start Logo" />
            </Link>
          </Box>
          {showLinks && (
            <Flex>
              <HeaderLink text="Sobre" id={"sobre"} type={LinkTypeEnum.StayInSamePage} />
              <HeaderLink text="Tutorias" id={"tutoriais"} type={LinkTypeEnum.StayInSamePage} />
              <HeaderLink text="Colaboradores" id={"colaboradores"} type={LinkTypeEnum.StayInSamePage} />
              <HeaderLink text="Contato" id={"contato"} type={LinkTypeEnum.StayInSamePage} />
              <HeaderLink text="Comunidade" id={"comuinidade"} type={LinkTypeEnum.StayInSamePage} />
            </Flex>
          )}
        </Flex>
        <Flex gap="5%">
          <Button
           _hover={{ color: "black", backgroundColor: "white" }}
            color={!isLogin && showModal ? "black" : "white"}
            bgColor={!isLogin && showModal ? "white" : "rgba(0,0,0,0)"}
            onClick={handleSignUpModal}
          >
            Sign Up
          </Button>

          <Button 
            _hover={{ color: "black", backgroundColor: "white" }}
            color={isLogin && showModal ? "black" : "white"}
            bgColor={isLogin && showModal ? "white" : "rgba(0,0,0,0)"}
            onClick={handleLoginModal}
          >
            Log In
          </Button>

          
        </Flex>
      </Flex>
    </>

  );
}
