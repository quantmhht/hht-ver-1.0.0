    import React, { FC } from "react";
    import { Box } from "zmp-ui";
    import { News } from "@dts";
    import { NewsItem } from "./NewsItem";
    import { NewsItemSkeleton } from "@components/skeleton";

    export const NewsList: FC<{ news: News[]; loading: boolean }> = ({ news, loading }) => {
      if (loading) {
        return (
          <Box className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <NewsItemSkeleton key={i} />
            ))}
          </Box>
        );
      }

      return (
        <Box className="grid grid-cols-2 gap-4">
          {news.map((item) => (
            <NewsItem key={item.id} news={item} />
          ))}
        </Box>
      );
    };
    