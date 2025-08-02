    import React , { useEffect } from "react";
    import { HomeHeader, Utinities, NewsSection } from "@components";
    import PageLayout from "@components/layout/PageLayout";
    import { APP_UTINITIES } from "@constants/utinities";
    import { useStore } from "@store";


    const HomePage: React.FunctionComponent = () => {
      const [organization, getNews] = useStore((state) => [
        state.organization,
        state.getNews,
      ]);
  useEffect(() => {
    if (organization?.id) {
      getNews({ organizationId: organization.id });
    }
  }, [organization, getNews]);

      return (
        <PageLayout
          id="home-page"
          customHeader={
            <HomeHeader
              title="UBND Phường Hà Huy Tập"
              name={organization?.name || "Tỉnh Hà Tĩnh"}
            />
          }
        >
          <Utinities utinities={APP_UTINITIES} />
          <NewsSection  />
        </PageLayout>
      );
    };

    export default HomePage;
    