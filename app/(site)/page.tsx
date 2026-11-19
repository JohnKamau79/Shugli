import MainLatestJobs from "../components/Home/MainLatestJobs";
import PlatformPricing from "../components/PlatformPricing";
import MainCategories from "../components/Home/MainCategories";
import MainTotals from "../components/Home/MainTotals";
import Main from "../components/Home/Main";
import MainCompanies from "../components/Home/MainCompanies";
import MainUserReviews from "../components/Home/MainUserReviews";
import MainWhyChoose from "../components/Home/MainWhyChoose";
import MainCto from "../components/Home/MainCto";

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
