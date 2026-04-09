// External library
import { useEffect, useState } from "react";
import { Box, Button, Circle, Flex, Menu, MenuButton, MenuItem, MenuList, SimpleGrid, Text } from "@chakra-ui/react";
import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import { FaCheckCircle } from "react-icons/fa";
import { FaPen } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

// Service
import useProfile from "@features/user/profile/services/useProfile";
import useUpdateProfile from "@features/user/profile/services/useUpdateProfile";

// Components
import FlexLayout from "@components/structure/Flex/Flex";
import Header from "@components/structure/Header/Header";
import SkeletonLoader from "@components/feedback/Skeleton";
import toaster from "@components/feedback/Toaster";
import InputText from "@components/common/inputs/InputText";
import CardDefault from "@components/common/cards";

// Guards
import { isLeft } from "@features/shared/errors/pattern/Either";

// Types
import type { Profile, UpdateProfileDTO, Mode } from "../../types";

// Utils
import { splitInitialCaracter } from "../../utils/helpers/formatters/SplitInitialCarater";
import useValidatorSQLInjection from "@features/shared/hooks/useValidatorSQLInjection";
import ReactCountryFlag from "react-country-flag";

// Constants
const defaultUserProfile: Profile = {
  userId: "",
  username: "",
  name: "",
  email: "",
  affiliation: "",
  country: "",
  authorities: [],
};

const defaultUpdateUserProfile: UpdateProfileDTO = {
  name: "",
  email: "",
  affiliation: "",
  country: "",
};

const languageOptions = [
  { lang: "pt", countryCode: "BR", label: "PT" },
  { lang: "en", countryCode: "US", label: "EN" },
];

export default function Profile() {
  const { t } = useTranslation("user/profile");
  const [userProfile, setUserProfile] = useState<Profile>(defaultUserProfile);
  const [updateProfile, setUpdateProfile] = useState<UpdateProfileDTO>(
    defaultUpdateUserProfile
  );
  const [isUpdateMode, setIsUpdateMode] = useState<Mode>("DEFAULT");

  const currentLanguage =
    languageOptions.find((opt) => opt.lang === i18n.language) ??
    languageOptions[0];

  const { profile, isLoading } = useProfile();
  const { update } = useUpdateProfile();
  const toast = toaster();
  const validator = useValidatorSQLInjection();

  useEffect(() => {
    if (!profile) return;

    if (isLeft(profile)) {
      toast({
        status: "error",
        title: "Failed to load profile",
        description:
          profile.value.message ||
          "We couldn’t load your profile data. Please check your connection or try again later.",
      });
      return;
    }

    setUserProfile(profile.value);

    const { name, email, affiliation, country } = profile.value;

    setUpdateProfile({
      name,
      email,
      affiliation,
      country,
    });
  }, [profile]);

  const handleChangeUserProfile = (
    key: keyof UpdateProfileDTO,
    value: string
  ) => {
    setUpdateProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSetModeScreen = () => {
    setIsUpdateMode((prev) => (prev === "DEFAULT" ? "UPDATE" : "DEFAULT"));
  };

  const hasInformationDifferent = () =>
    Object.keys(updateProfile).some(
      (key) =>
        updateProfile[key as keyof UpdateProfileDTO] !==
        userProfile[key as keyof UpdateProfileDTO]
    );

  const handleSubmitUpdate = async () => {
    if (!hasInformationDifferent()) {
      toast({
        status: "warning",
        title: "No changes detected",
        description: "Update at least one field to save the changes.",
      });
      return;
    }

    
    if(!validator({value: updateProfile.affiliation})) return false
    if(!validator({value: updateProfile.country})) return false
    if(!validator({value: updateProfile.email})) return false
    if(!validator({value: updateProfile.name})) return false
    
    const result = await update(updateProfile);

    if (!result) return;

    if (isLeft(result)) {
      toast({
        status: "warning",
        title: "Validation error",
        description: result.value.message,
      });
      return;
    }

    const { country, email, name, affiliation, invalidEntries } = result.value;

    if (invalidEntries.length > 0) {
      invalidEntries.forEach((entry) => {
        toast({
          status: "error",
          title: `Invalid ${entry.field}`,
          description:
            entry.message || `The value "${entry.entry}" is invalid.`,
        });
      });
      return;
    }

    setUserProfile((prev) => ({
      ...prev,
      name,
      country,
      email,
      affiliation,
    }));
    setUpdateProfile((prev) => ({
      ...prev,
      name,
      country,
      email,
      affiliation,
    }));
    toast({
      status: "success",
      title: "Profile updated",
      description: "Your changes were saved successfully.",
    });
    setIsUpdateMode("DEFAULT");
  };

  const { username, name, email, affiliation, country } = userProfile;
  const initialCaracter = splitInitialCaracter(name ?? username) || "U";
  const isActiveUpdateMode = isUpdateMode !== "DEFAULT";

  return (
    <FlexLayout navigationType="Default">
      <Flex alignItems="center" paddingRight="12px">
        <Header text={t("header.title")}/>
        <Menu>
          <MenuButton
            as={Button}
            color="white"
            bg="transparent"
            _hover={{ color: "black", backgroundColor: "white" }}
            _active={{ color: "black", backgroundColor: "white" }}
            _expanded={{ color: "black", backgroundColor: "white" }}
            px="0.75rem"
          >
            <Flex alignItems="center" gap="0.4rem">
              <ReactCountryFlag
                countryCode={currentLanguage.countryCode}
                svg
                style={{
                  width: "1.2em",
                  height: "1.2em",
                  borderRadius: "2px",
                }}
              />
              <Text fontSize="sm" fontWeight="semibold" color="#263C56">
                {currentLanguage.label}
              </Text>
              <ChevronDownIcon color="#263C56" />
            </Flex>
          </MenuButton>
          <MenuList minW="90px" w="90px">
            {languageOptions.map((opt) => (
              <MenuItem
                key={opt.lang}
                onClick={() => i18n.changeLanguage(opt.lang)}
                fontWeight={
                  i18n.language === opt.lang ? "bold" : "normal"
                }
                color={i18n.language === opt.lang ? "#2E4B6C" : "inherit"}
              >
                <Flex alignItems="center" gap="0.5rem">
                  <ReactCountryFlag
                    countryCode={opt.countryCode}
                    svg
                    style={{
                      width: "1.2em",
                      height: "1.2em",
                      borderRadius: "2px",
                    }}
                  />
                  <Text fontSize="sm">{opt.label}</Text>
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>
      <CardDefault backgroundColor="white" borderRadius="1rem" withShadow={false}>
        {isLoading ? (
          <SkeletonLoader width="100%" height="100%" />
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            gap="2rem"
            height="100%"
            padding="1rem"
          >
            <Box
              position="relative"
              bg="#a4d8f7"
              minHeight="10rem"
              borderRadius=".5rem"
            >
              <Circle
                size="8rem"
                bg="blue.500"
                color="white"
                fontSize="4xl"
                fontWeight="bold"
                shadow="md"
                border="5px solid white"
                position="absolute"
                top="5rem"
                left="1.5rem"
              >
                {initialCaracter}
              </Circle>
            </Box>
            <Box>
              <Flex width="100%" mt="1.25rem" justifyContent="space-between">
                <Box>
                  <Text fontSize="3xl" fontWeight="bold" lineHeight="short">
                    {name ?? username}
                  </Text>
                  <Text fontSize="large" color="gray.600">
                    @{username}
                  </Text>
                </Box>
                {isActiveUpdateMode ? (
                  <Button
                    onClick={handleSetModeScreen}
                    leftIcon={<CloseIcon fontSize=".75rem" />}
                    bgColor="transparent"
                    color="red.500"
                    border="1px solid"
                    borderColor="red.500"
                    borderRadius="8px"
                    boxShadow="0 2px 4px rgba(0, 0, 0, 0.05)"
                    _hover={{
                      bgColor: "red.500",
                      color: "white",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    transition="all 0.3s ease"
                    width="6.5rem"
                    gap={i18n.language === "pt" ? ".2rem" : ".5rem"}
                  >
                    {t("buttons.cancel")}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSetModeScreen}
                    leftIcon={<FaPen fontSize=".85rem" />}
                    bgColor="gray.100"
                    color="black.100"
                    borderRadius="8px"
                    boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                    _hover={{
                      bgColor: "#000000",
                      color: "#ffffff",
                      boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
                    }}
                    transition="all 0.3s ease"
                    width="6.5rem"
                    gap={i18n.language === "pt" ? ".2rem" : ".5rem"}
                  >
                    {t("buttons.edit")}
                  </Button>
                )}
              </Flex>

              <SimpleGrid
                columns={{ base: 1, md: 2 }}
                spacing="1.5rem"
                mt="2rem"
              >
                <InputText
                  width="100%"
                  label={t("inputs.name.label")}
                  nome="name"
                  type="text"
                  placeholder={t("inputs.name.placeholder")}
                  value={isActiveUpdateMode ? updateProfile.name : name}
                  onChange={(event) =>
                    handleChangeUserProfile("name", event.target.value)
                  }
                  isDisabled={!isActiveUpdateMode}
                />
                <InputText
                  width="100%"
                  label={t("inputs.email.label")}
                  nome="email"
                  type="email"
                  placeholder={t("inputs.email.placeholder")}
                  value={isActiveUpdateMode ? updateProfile.email : email}
                  onChange={(event) =>
                    handleChangeUserProfile("email", event.target.value)
                  }
                  isDisabled={!isActiveUpdateMode}
                />
                <InputText
                  width="100%"
                  label={t("inputs.affiliation.label")}
                  nome="affiliation"
                  type="text"
                  placeholder={t("inputs.affiliation.placeholder")}
                  value={
                    isActiveUpdateMode ? updateProfile.affiliation : affiliation
                  }
                  onChange={(event) =>
                    handleChangeUserProfile("affiliation", event.target.value)
                  }
                  isDisabled={!isActiveUpdateMode}
                />
                <InputText
                  width="100%"
                  label={t("inputs.country.label")}
                  nome="country"
                  type="text"
                  placeholder={t("inputs.country.placeholder")}
                  value={isActiveUpdateMode ? updateProfile.country : country}
                  onChange={(event) =>
                    handleChangeUserProfile("country", event.target.value)
                  }
                  isDisabled={!isActiveUpdateMode}
                />
              </SimpleGrid>

              {isActiveUpdateMode && (
                <Flex justifyContent="flex-end" mt="2rem">
                  <Button
                    onClick={handleSubmitUpdate}
                    leftIcon={<FaCheckCircle fontSize="1rem" />}
                    bgColor="#263C56"
                    color="#FFFFFF"
                    borderRadius="8px"
                    boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                    _hover={{
                      bgColor: "#C9D9E5",
                      color: "#263C56",
                      boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
                    }}
                    transition="all 0.3s ease"
                    width="6.5rem"
                    gap=".5rem"
                  >
                    {t("buttons.save")}
                  </Button>
                </Flex>
              )}
            </Box>
          </Box>
        )}
      </CardDefault>
    </FlexLayout>
  );
}
