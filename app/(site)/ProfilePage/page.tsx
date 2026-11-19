import Applications from "@/app/components/ProfileComps/Applications";
import Certifications from "@/app/components/ProfileComps/Certifications";
import Education from "@/app/components/ProfileComps/Education";
import Languages from "@/app/components/ProfileComps/Languages";
import PersonalInfo from "@/app/components/ProfileComps/PersonalInfo";
import ProfessionalSummary from "@/app/components/ProfileComps/ProfessionalSummary";
import Resume from "@/app/components/ProfileComps/Resume";
import SavedJobs from "@/app/components/ProfileComps/SavedJobs";
import Settings from "@/app/components/ProfileComps/Settings";
import Skills from "@/app/components/ProfileComps/Skills";
import UserDelete from "@/app/components/ProfileComps/UserDelete";
import WorkExperience from "@/app/components/ProfileComps/WorkExperience";

export default async function ProfilePage() {
  return (
    <main>
      <div>
        <PersonalInfo />
        <ProfessionalSummary />
        <WorkExperience />
        <Education />
        <Skills />
        <Certifications />
        <Languages />
        <UserDelete/>
        {/* <Resume /> */}
      </div>

      <div className="mt-4">
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
