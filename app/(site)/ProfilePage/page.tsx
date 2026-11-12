import Applications from "@/app/components/ProfileComps/Applications";
import Certifications from "@/app/components/ProfileComps/Certifications";
import Education from "@/app/components/ProfileComps/Education";
import PersonalInfo from "@/app/components/ProfileComps/PersonalInfo";
import ProfessionalSummary from "@/app/components/ProfileComps/ProfessionalSummary";
import Resume from "@/app/components/ProfileComps/Resume";
import SavedJobs from "@/app/components/ProfileComps/SavedJobs";
import Settings from "@/app/components/ProfileComps/Settings";
import Skills from "@/app/components/ProfileComps/Skills";
import WorkExperience from "@/app/components/ProfileComps/WorkExperience";

export default async function ProfilePage() {
  return (
    <main>
      <div>
        <PersonalInfo />
        <ProfessionalSummary profile={null} />
        <WorkExperience />
        <Education />
        <Skills />
        {/* <Resume /> */}
        <Certifications />
      </div>

      <div>
        <h1>My Activity</h1>
        <Applications />
        <SavedJobs />
      </div>

      <div>
        <Settings />
      </div>
    </main>
  );
}
