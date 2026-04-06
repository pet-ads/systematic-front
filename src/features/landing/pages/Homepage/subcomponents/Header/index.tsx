// External library
import { useState } from "react";
import { Link } from "react-router-dom";
import { Image } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

// Components
import HomepageModal from "@features/landing/components/modals/HomepageModal/Index";
import FormLogin from "@features/auth/components/forms/SignIn/Index";
import FormSignup from "@features/auth/components/forms/Signup/Index";
import ForgotPassword from "@features/auth/components/forms/ForgotPassword";
import HeaderLink from "./subcomponents/links/HeaderLink";

// Hooks
import { useNavigation } from "@features/shared/hooks/useNavigation";

// Assets
import Logo from "../../../../../../assets/images/logos/startwhite.png";

// Styles
import { HeaderTheme } from "./styles";

// Guards
import { useAuthStore } from "@features/auth/store/useAuthStore";

// Types
interface IHeaderProps {
  show: boolean;
}

type IModal = "" | "login" | "signup" | "forgotPassword";

export default function Header({ show }: IHeaderProps) {
  const { t } = useTranslation("landing/homepage");
  enum LinkTypeEnum {
    GoToOtherPage = "GoToOtherPage",
    StayInSamePage = "StayInSamePage",
  }

  const showLinks = show;
  const [showModal, setShowModal] = useState(false);
  const [openModal, setOpenModal] = useState<IModal>("");

  const { toGo } = useNavigation();

  const { user, _hasHydrated } = useAuthStore();

  console.log("dados usuario", user);

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
                text={t("header.about")}
                id={"sobre"}
                type={LinkTypeEnum.StayInSamePage}
              />
              <HeaderLink
                text={t("header.tutorials")}
                id={"tutoriais"}
                type={LinkTypeEnum.StayInSamePage}
              />
              <HeaderLink
                text={t("header.collaborators")}
                id={"colaboradores"}
                type={LinkTypeEnum.StayInSamePage}
              />
              <HeaderLink
                text={t("header.contact")}
                id={"contato"}
                type={LinkTypeEnum.StayInSamePage}
              />
              <HeaderLink
                text={t("header.community")}
                id={"comuinidade"}
                type={LinkTypeEnum.StayInSamePage}
              />
            </Flex>
          )}
        </Flex>
        <Flex gap="5%">
          {_hasHydrated && (
            <>
              <Menu>
                <MenuButton
                  as={Button}
                  color="white"
                  bg="#301E1A"
                  _hover={{ bg: "white", color: "black" }}
                  w="70px"
                  minW="70px"
                >
                  🌐{i18n.language.toLowerCase()}
                </MenuButton>
                <MenuList w="70px" minW="70px">
                  <MenuItem onClick={() => i18n.changeLanguage("pt")}>
                    pt
                  </MenuItem>
                  <MenuItem onClick={() => i18n.changeLanguage("en")}>
                    en
                  </MenuItem>
                </MenuList>
              </Menu>

              {user ? (
                <Button
                  _hover={{ color: "black", backgroundColor: "white" }}
                  color={openModal == "login" && showModal ? "black" : "white"}
                  bgColor={
                    openModal == "login" && showModal ? "white" : "green"
                  }
                  onClick={() => toGo("/home")}
                >
                  {t("header.welcome", { name: user.sub })}
                </Button>
              ) : (
                <>
                  <Button
                    _hover={{ color: "black", backgroundColor: "white" }}
                    color={
                      openModal == "signup" && showModal ? "black" : "white"
                    }
                    bgColor={
                      openModal == "signup" && showModal
                        ? "white"
                        : "rgba(0,0,0,0)"
                    }
                    onClick={handleSignUpModal}
                  >
                    {t("header.signUp")}
                  </Button>
                  <Button
                    _hover={{ color: "black", backgroundColor: "white" }}
                    color={
                      openModal == "login" && showModal ? "black" : "white"
                    }
                    bgColor={
                      openModal == "login" && showModal
                        ? "white"
                        : "rgba(0,0,0,0)"
                    }
                    onClick={handleLoginModal}
                  >
                    {t("header.login")}
                  </Button>
                </>
              )}
            </>
          )}
        </Flex>
      </Flex>
    </>
  );
}
