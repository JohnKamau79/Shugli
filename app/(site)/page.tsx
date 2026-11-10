import MainLatestJobs from "../components/MainLatestJobs";
import PlatformPricing from "../components/PlatformPricing";
import MainCategories from "../components/MainCategories";
import MainTotals from "../components/MainTotals";
import Main from "../components/Main";
import MainCompanies from "../components/MainCompanies";
import MainUserReviews from "../components/MainUserReviews";
import MainWhyChoose from "../components/MainWhyChoose";
import MainCto from "../components/MainCto";

export default async function Home() {
  return (
    <main>
      <Main />
      <MainTotals />
      <MainLatestJobs className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16 lg:py-24 bg-primary/5" />
      <MainCategories />
      <MainCompanies />
      <MainWhyChoose />
      <MainCto />

      {/* <PlatformPricing /> */}

      {/* <MainUserReviews /> */}
    </main>
  );
}
