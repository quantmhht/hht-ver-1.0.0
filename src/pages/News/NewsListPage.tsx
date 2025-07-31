    import React from "react";
    import { NewsList, PageLayout } from "@components";
    import { useStore } from "@store";

    const NewsListPage: React.FC = () => {
      const { news, loadingNews } = useStore();

      return (
        <PageLayout title="Tin tức" showBackIcon>
          <NewsList news={news} loading={loadingNews} />
        </PageLayout>
      );
    };

    export default NewsListPage;
    