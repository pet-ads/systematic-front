// External library
import { useState } from "react";
import { Link } from "react-router-dom";
import { Image } from "@chakra-ui/react";
import { Box, Button, Flex } from "@chakra-ui/react";

// Components
import HomepageModal from "@features/landing/components/modals/HomepageModal/Index";
import FormLogin from "@features/auth/components/forms/SignIn/Index";
import FormSignup from "@features/auth/components/forms/Signup/Index";
import ForgotPassword from "@features/auth/components/forms/ForgotPassword";
import HeaderLink from "./subcomponents/links/HeaderLink";

// Hooks
import useRecoverUserData from "@features/auth/hooks/useRecoverUserData";
import { useNavigation } from "@features/shared/hooks/useNavigation";

// Assets
import Logo from "../../../../../../assets/images/logos/startwhite.png";

// Styles
import { HeaderTheme } from "./styles";

// Types
interface IHeaderProps {
  show: boolean;
}

type IModal = "" | "login" | "signup" | "forgotPassword";

export default function Header({ show }: IHeaderProps) {
  enum LinkTypeEnum {
    GoToOtherPage = "GoToOtherPage",
    StayInSamePage = "StayInSamePage",
  }

  const showLinks = show;
  const [showModal, setShowModal] = useState(false);
  const [openModal, setOpenModal] = useState<IModal>("");
  const [username, setUsername] = useState<string | null>(null);

  const { toGo } = useNavigation();

  useRecoverUserData(setUsername);

  function handleSignUpModal() {
    setOpenModal("signup");
    setShowModal(true);
  }

  function handleLoginModal() {
    setOpenModal("login");
    setShowModal(true);
  }

  return (
    <>
      <HomepageModal show={showModal} onClose={() => setShowModal(false)}>
        {openModal == "login" && (
          <FormLogin
            redirectForgotPassword={() => setOpenModal("forgotPassword")}
          />
        )}
        {openModal == "signup" && (
          <FormSignup
            redirectFormLogin={() => setOpenModal("login")}
            closeModal={() => {
              setOpenModal("");
              setShowModal(false);
            }}
          />
        )}
        {openModal == "forgotPassword" && (
          <ForgotPassword redirectFormLogin={() => setOpenModal("login")} />
        )}
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
              <HeaderLink
                text="Sobre"
                id={"sobre"}
                type={LinkTypeEnum.StayInSamePage}
              />
              <HeaderLink
                text="Tutorias"
                id={"tutoriais"}
                type={LinkTypeEnum.StayInSamePage}
              />
              <HeaderLink
                text="Colaboradores"
                id={"colaboradores"}
                type={LinkTypeEnum.StayInSamePage}
              />
              <HeaderLink
                text="Contato"
                id={"contato"}
                type={LinkTypeEnum.StayInSamePage}
              />
              <HeaderLink
                text="Comunidade"
                id={"comuinidade"}
                type={LinkTypeEnum.StayInSamePage}
              />
            </Flex>
          )}
        </Flex>
        <Flex gap="5%">
          {!username && (
            <Button
              _hover={{ color: "black", backgroundColor: "white" }}
              color={openModal == "signup" && showModal ? "black" : "white"}
              bgColor={
                openModal == "signup" && showModal ? "white" : "rgba(0,0,0,0)"
              }
              onClick={handleSignUpModal}
            >
              Sign Up
            </Button>
          )}
          {username ? (
            <Button
              _hover={{ color: "black", backgroundColor: "white" }}
              color={openModal == "login" && showModal ? "black" : "white"}
              bgColor={openModal == "login" && showModal ? "white" : "green"}
              onClick={() => toGo("/user")}
            >
              Bem vindo, {username}
            </Button>
          ) : (
            <Button
              _hover={{ color: "black", backgroundColor: "white" }}
              color={openModal == "login" && showModal ? "black" : "white"}
              bgColor={
                openModal == "login" && showModal ? "white" : "rgba(0,0,0,0)"
              }
              onClick={handleLoginModal}
            >
              Log In
            </Button>
          )}
        </Flex>
      </Flex>
    </>
  );
}
