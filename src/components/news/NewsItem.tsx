import { News } from "@dts";
import React, { FC } from "react";
import { Box, Text } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import tw from "twin.macro";

const ItemContainer = styled(Box)`
  ${tw`space-y-2`}
`;

const Thumbnail = styled.img`
  ${tw`w-full h-32 object-cover rounded-lg`}
`;

export const NewsItem: FC<{ news: News }> = ({ news }) => {
  const navigate = useNavigate();
  return (
    <ItemContainer onClick={() => navigate(`/news/${news.id}`)}>
      <Thumbnail src={news.thumbnail} onError={(e: any) => e.target.src = 'https://placehold.co/600x400/CCCCCC/FFF?text=Error'} />
      <Text size="small" className="line-clamp-2">
        {news.title}
      </Text>
    </ItemContainer>
  );
};