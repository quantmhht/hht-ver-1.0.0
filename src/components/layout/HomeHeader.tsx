import { TextItemSkeleton } from "@components/skeleton";
import { useStore } from "@store";
import React, { FC } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { Box, Text } from "zmp-ui";
import Logo from "@assets/logo.png";

const HeaderContainer = styled(Box)`
  ${tw`bg-gradient-to-r from-blue-500 to-purple-600 h-24 flex items-center p-4 gap-4`}
`;
const LogoWrapper = styled.div`
  ${tw`w-12 h-12 rounded-full overflow-hidden flex-shrink-0`}
`;
const Title = styled(Text.Title)`
  ${tw`text-black`}
`;
const StyledText = styled(Text)`
  ${tw`text-white opacity-80`}
`;

export interface HomeHeaderProps {
  title?: string;
  name?: string;
}

const HomeHeader: FC<HomeHeaderProps> = (props) => {
  const { name } = props;
  // Sửa lỗi: Lấy trực tiếp `loading` state từ store
   const { loading } = useStore((state) => ({
    loading: (state.organization as any)?.loading || false
}));

  return (
    <HeaderContainer>
      <LogoWrapper>
        <img src={Logo} alt="UBND Phường Hà Huy Tập" />
      </LogoWrapper>
      <Box flex flexDirection="column">
        <Title>UBND Phường Hà Huy Tập</Title>
        {loading ? (
          <TextItemSkeleton
            color="rgba(255,255,255,0.2)"
            height={16}
            width={180}
          />
        ) : (
          <StyledText>{name || "Tỉnh Hà Tĩnh"}</StyledText>
        )}
      </Box>
    </HeaderContainer>
  );
};

export default HomeHeader;
