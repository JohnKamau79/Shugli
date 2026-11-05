import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config"

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL as string }),
});
async function main() {
    await prisma.category.createMany({
        data: [
            {
                name: "Information Technology",
                description: "Jobs involving software development, IT support, cybersecurity, networking, database administration, cloud computing, and technology infrastructure."
            },
            {
                name: "Accounting & Finance",
                description: "Roles in bookkeeping, auditing, taxation, financial analysis, payroll management, banking, budgeting, and financial planning."
            },
            {
                name: "Administration",
                description: "Jobs involving office management, reception, clerical work, scheduling, record keeping, data entry, and general administrative support."
            },
            {
                name: "Agriculture",
                description: "Opportunities in crop farming, livestock production, horticulture, agribusiness, agricultural research, and farm management."
            },
            {
                name: "Construction",
                description: "Jobs in building, civil works, site supervision, masonry, plumbing, electrical installation, quantity surveying, and construction management."
            },
            {
                name: "Banking & Insurance",
                description: "Roles in banking operations, lending, credit analysis, insurance underwriting, claims processing, risk management, and financial services."
            },
            {
                name: "Business Management",
                description: "Positions involving business operations, strategic planning, project management, business analysis, consultancy, and organizational development."
            },
            {
                name: "Customer Service",
                description: "Jobs focused on assisting customers, handling enquiries, resolving complaints, managing client relationships, and providing product or service support."
            },
            {
                name: "Education",
                description: "Opportunities in teaching, lecturing, tutoring, academic administration, curriculum development, vocational training, and educational management."
            },
            {
                name: "Engineering",
                description: "Roles in civil, mechanical, electrical, chemical, industrial, and other engineering fields, including design, maintenance, development, and technical operations."
            },
            {
                name: "Healthcare",
                description: "Jobs in medicine, nursing, pharmacy, clinical services, medical laboratories, public health, patient care, and healthcare administration."
            },
            {
                name: "Hospitality & Tourism",
                description: "Employment in hotels, restaurants, travel agencies, tour operations, guest services, food and beverage management, and tourism."
            },
            {
                name: "Human Resources",
                description: "Roles involving recruitment, employee relations, payroll administration, staff development, performance management, and workforce planning."
            },
            {
                name: "Legal Services",
                description: "Opportunities in legal practice, litigation, legal research, contract management, corporate law, regulatory compliance, and legal advisory services."
            },
            {
                name: "Logistics & Supply Chain",
                description: "Jobs in procurement, transportation, warehousing, freight forwarding, inventory management, distribution, and supply chain operations."
            },
            {
                name: "Manufacturing",
                description: "Roles in factory operations, production planning, machine operation, assembly, quality control, product development, and industrial processing."
            },
            {
                name: "Marketing & Communications",
                description: "Jobs in digital marketing, advertising, public relations, brand management, market research, content strategy, and corporate communications."
            },
            {
                name: "Media & Journalism",
                description: "Opportunities in journalism, broadcasting, editing, publishing, photography, video production, reporting, and content creation."
            },
            {
                name: "NGO & Development",
                description: "Roles in community development, humanitarian assistance, project coordination, advocacy, fundraising, monitoring and evaluation, and development programmes."
            },
            {
                name: "Retail & Sales",
                description: "Jobs in retail operations, shop management, merchandising, sales assistance, product promotion, customer acquisition, and account management."
            },
            {
                name: "Security",
                description: "Employment in private security, surveillance, access control, investigations, security operations, emergency response, and public safety."
            },
            {
                name: "Science & Research",
                description: "Positions involving scientific research, laboratory testing, data analysis, biotechnology, environmental studies, and academic research."
            },
            {
                name: "Design & Creative Arts",
                description: "Opportunities in graphic design, illustration, animation, fashion design, interior design, photography, and other creative disciplines."
            },
            {
                name: "Skilled Trades",
                description: "Jobs requiring practical technical expertise, including plumbing, welding, carpentry, electrical work, masonry, equipment repair, and installation."
            },
            {
                name: "Telecommunications",
                description: "Roles in mobile networks, fibre optics, network installation, telecommunications engineering, infrastructure maintenance, and technical support."
            },
            {
                name: "Real Estate",
                description: "Jobs in property sales, real estate brokerage, property management, leasing, valuation, facilities management, and property development."
            },
            {
                name: "Environment & Conservation",
                description: "Opportunities in environmental protection, wildlife conservation, forestry, climate change programmes, waste management, and natural resource management."
            },
            {
                name: "Transport & Driving",
                description: "Jobs involving commercial driving, passenger transportation, courier services, delivery operations, fleet management, and vehicle operations."
            },
            {
                name: "Government & Public Service",
                description: "Employment in national and county government institutions, public administration, policy implementation, regulatory agencies, and public service delivery."
            },
            {
                name: "Energy & Utilities",
                description: "Roles in electricity generation, renewable energy, power distribution, water supply, sanitation, utility maintenance, and energy infrastructure."
            }
        ],
        skipDuplicates: true,
    });

    await prisma.city.createMany({
        data: [
            { name: "Mombasa" },
            { name: "Kwale" },
            { name: "Kilifi" },
            { name: "Tana River" },
            { name: "Lamu" },
            { name: "Taita/Taveta" },
            { name: "Garissa" },
            { name: "Wajir" },
            { name: "Mandera" },
            { name: "Marsabit" },
            { name: "Isiolo" },
            { name: "Meru" },
            { name: "Tharaka-Nithi" },
            { name: "Embu" },
            { name: "Kitui" },
            { name: "Machakos" },
            { name: "Makueni" },
            { name: "Nyandarua" },
            { name: "Nyeri" },
            { name: "Kirinyaga" },
            { name: "Murang'a" },
            { name: "Kiambu" },
            { name: "Turkana" },
            { name: "West Pokot" },
            { name: "Samburu" },
            { name: "Trans Nzoia" },
            { name: "Uasin Gishu" },
            { name: "Elgeyo/Marakwet" },
            { name: "Nandi" },
            { name: "Baringo" },
            { name: "Laikipia" },
            { name: "Nakuru" },
            { name: "Narok" },
            { name: "Kajiado" },
            { name: "Kericho" },
            { name: "Bomet" },
            { name: "Kakamega" },
            { name: "Vihiga" },
            { name: "Bungoma" },
            { name: "Busia" },
            { name: "Siaya" },
            { name: "Kisumu" },
            { name: "Homa Bay" },
            { name: "Migori" },
            { name: "Kisii" },
            { name: "Nyamira" },
            { name: "Nairobi City" },
        ],
        skipDuplicates: true,
    });

    await prisma.skills.createMany({
        data: [
            { name: "Communication" },
            { name: "Leadership" },
            { name: "Customer Service" },
            { name: "Project Management" },
            { name: "Problem Solving" },
            { name: "Teamwork" },
            { name: "Time Management" },
            { name: "Sales" },
            { name: "Marketing" },
            { name: "Accounting" },
            { name: "Data Analysis" },
            { name: "Microsoft Office" },
            { name: "Digital Marketing" },
            { name: "Graphic Design" },
            { name: "Content Writing" },
            { name: "Human Resource Management" },
            { name: "Teaching" },
            { name: "Negotiation" },
            { name: "Financial Management" },
            { name: "Inventory Management" },
            { name: "Public Speaking" },
            { name: "Research" },
            { name: "Administration" },
            { name: "Driving" },
            { name: "Cooking" },
            { name: "First Aid" },
            { name: "Data Entry" },
            { name: "Conflict Resolution" },
            { name: "Critical Thinking" },
            { name: "Adaptability" },
        ],
        skipDuplicates: true,
    })
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect);