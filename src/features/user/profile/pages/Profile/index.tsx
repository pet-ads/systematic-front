// External library
import { useEffect, useState } from "react";
import { Box, Circle, Flex, SimpleGrid, Text, Tooltip } from "@chakra-ui/react";

// Service
import useProfile from "@features/user/profile/services/useProfile";

// Components
import FlexLayout from "@components/structure/Flex/Flex";
import Header from "@components/structure/Header/Header";
import SkeletonLoader from "@components/feedback/Skeleton";
import toaster from "@components/feedback/Toaster";

// Styles
import { conteiner } from "./styles";

// Guards
import { isLeft } from "@features/shared/errors/pattern/Either";

// Types
import type { Profile } from "../../types";
import InputText from "@components/common/inputs/InputText";
import { splitInitialCaracter } from "../../utils/helpers/formatters/SplitInitialCarater";
import { capitalize } from "@features/shared/utils/helpers/formatters/CapitalizeText";

// Constants
const defaultUserProfile = {
  userId: "",
  username: "",
  name: "",
  email: "",
  affiliation: "",
  country: "",
  authorities: [],
};

export default function Profile() {
  const [userProfile, setUserProfile] = useState<Profile>(defaultUserProfile);

  const { profile, isLoading } = useProfile();
  const toast = toaster();

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
  }, [profile]);

  const { userId, username, name, email, affiliation, country, authorities } =
    userProfile;

  const initialCaracter = splitInitialCaracter(name ?? username) || "U";
  const formatterAuthorites = capitalize(
    authorities.join(", ").toLocaleLowerCase()
  );

  return (
    <FlexLayout navigationType="Default">
      <Header text="My Profile" />
      <Flex sx={conteiner}>
        {isLoading ? (
          <SkeletonLoader width="100%" height="100%" />
        ) : (
          <Box
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            h="100%"
            padding="1rem"
          >
            <Flex
              width="100%"
              height="20%"
              alignItems="center"
              justifyContent="flex-start"
              gap="1rem"
            >
              <Circle
                size="10rem"
                bg="blue.500"
                color="white"
                fontSize="5xl"
                fontWeight="bold"
                shadow="md"
              >
                {initialCaracter}
              </Circle>
              <Box>
                <Text fontSize="4xl" fontWeight="bold">
                  {name ?? username}
                </Text>
                <Flex alignItems="center" gap=".5rem">
                  <Text>{username}</Text>
                  <Tooltip
                    label={userId}
                    placement="top"
                    hasArrow
                    borderRadius=".25rem"
                  >
                    <Circle
                      size="1.5rem"
                      bg="green.300"
                      fontWeight="bold"
                      justifyContent="center"
                      alignItems="center"
                    >
                      #
                    </Circle>
                  </Tooltip>
                </Flex>
              </Box>
            </Flex>
            <Box height="100%" gap="1rem">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="1rem" mb="2rem">
                <InputText
                  nome="username"
                  label="Username"
                  type="text"
                  placeholder="Username"
                  value={username}
                />
                <InputText
                  nome="name"
                  label="Full Name"
                  type="text"
                  placeholder="Name"
                  value={name}
                />
                <InputText
                  nome="email"
                  label="Email"
                  type="email"
                  placeholder="Email"
                  value={email}
                />
                <InputText
                  nome="affiliation"
                  label="Affiliation"
                  type="text"
                  placeholder="Affiliation"
                  value={affiliation}
                />
                <InputText
                  nome="country"
                  label="Country"
                  type="text"
                  placeholder="Country"
                  value={country}
                />
                <InputText
                  nome="authorities"
                  label="Authorities"
                  type="text"
                  placeholder="Authorities"
                  value={formatterAuthorites}
                />
              </SimpleGrid>
            </Box>
          </Box>
        )}
      </Flex>
    </FlexLayout>
  );
}
