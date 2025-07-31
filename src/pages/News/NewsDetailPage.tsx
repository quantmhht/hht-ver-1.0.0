    import React from "react";
    import { PageLayout } from "@components";
    import { useStore } from "@store";
    import { useParams } from "react-router-dom";
    import { Box, Text, Swiper, ImageViewer } from "zmp-ui";
    import styled from "styled-components";
    import tw from "twin.macro";

    const NewsImage = styled.img`
      ${tw`w-full h-48 object-cover rounded-lg`}
    `;

    const NewsDetailPage: React.FC = () => {
      const { id } = useParams();
      const { news } = useStore();
      const article = news.find((item) => item.id.toString() === id);
      const [visible, setVisible] = React.useState(false);
      const [activeIndex, setActiveIndex] = React.useState(0);

      if (!article) {
        return (
          <PageLayout title="Không tìm thấy tin" showBackIcon>
            <Box p={4}><Text>Không tìm thấy bài viết.</Text></Box>
          </PageLayout>
        );
      }

      return (
        <PageLayout title={article.title} showBackIcon>
          <Box p={4}>
            <NewsImage src={article.thumbnail} />
            <Text.Title className="mt-4">{article.title}</Text.Title>
            <Text className="mt-2">{article.content}</Text>
            {article.images && article.images.length > 0 && (
              <Box mt={4}>
                <Swiper>
                  {article.images.map((img, index) => (
                    <Swiper.Slide key={index}>
                      <img
                        src={img}
                        alt={`image-${index}`}
                        className="w-full h-auto rounded-lg"
                        onClick={() => {
                          setActiveIndex(index);
                          setVisible(true);
                        }}
                      />
                    </Swiper.Slide>
                  ))}
                </Swiper>
              </Box>
            )}
          </Box>
          <ImageViewer
            images={article.images.map(img => ({ src: img }))}
            activeIndex={activeIndex}
            visible={visible}
            onClose={() => setVisible(false)}
          />
        </PageLayout>
      );
    };

    export default NewsDetailPage;
    