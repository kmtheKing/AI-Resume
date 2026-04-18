<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $fields = [
            // ─── Technology & Digital Infrastructure ───
            ['category' => 'Technology & Digital Infrastructure', 'name' => 'Artificial Intelligence (AI) Development', 'description' => 'Creating generative models, LLMs, and specialized AI for business automation.'],
            ['category' => 'Technology & Digital Infrastructure', 'name' => 'Semiconductor Manufacturing', 'description' => 'Producing high-end chips and GPUs that power AI, EVs, and consumer electronics.'],
            ['category' => 'Technology & Digital Infrastructure', 'name' => 'Cloud Computing & Data Centers', 'description' => 'Managing the remote servers and massive storage required for global digital operations.'],
            ['category' => 'Technology & Digital Infrastructure', 'name' => 'Cybersecurity Services', 'description' => 'Protecting organizations from increasingly sophisticated AI-driven cyber threats and data breaches.'],
            ['category' => 'Technology & Digital Infrastructure', 'name' => 'Software as a Service (SaaS)', 'description' => 'Delivering subscription-based software solutions for enterprise and individual use.'],
            ['category' => 'Technology & Digital Infrastructure', 'name' => 'Edge Computing', 'description' => 'Processing data closer to its source to reduce latency for IoT and real-time applications.'],
            ['category' => 'Technology & Digital Infrastructure', 'name' => 'Robotics & Industrial Automation', 'description' => 'Designing machines for manufacturing, logistics, and precision tasks.'],
            ['category' => 'Technology & Digital Infrastructure', 'name' => 'Telecommunications (5G/6G)', 'description' => 'Building and maintaining high-speed network infrastructures for global connectivity.'],
            ['category' => 'Technology & Digital Infrastructure', 'name' => 'FinTech (Financial Technology)', 'description' => 'Innovating digital payments, blockchain, and decentralized finance (DeFi).'],
            ['category' => 'Technology & Digital Infrastructure', 'name' => 'Internet of Things (IoT)', 'description' => 'Connecting everyday devices to the internet for data collection and smart home/city control.'],

            // ─── Energy & Sustainability ───
            ['category' => 'Energy & Sustainability', 'name' => 'Renewable Energy (Solar & Wind)', 'description' => 'Generating power through sustainable natural resources to meet global net-zero targets.'],
            ['category' => 'Energy & Sustainability', 'name' => 'Electric Vehicle (EV) Manufacturing', 'description' => 'Designing and mass-producing battery-powered cars, trucks, and bikes.'],
            ['category' => 'Energy & Sustainability', 'name' => 'Battery Technology & Storage', 'description' => 'Developing high-capacity lithium-ion and solid-state batteries for EVs and power grids.'],
            ['category' => 'Energy & Sustainability', 'name' => 'Oil & Gas Exploration', 'description' => 'Extracting traditional fossil fuels, though increasingly focused on efficiency and carbon capture.'],
            ['category' => 'Energy & Sustainability', 'name' => 'Green Hydrogen Production', 'description' => 'Creating clean-burning fuel through electrolysis powered by renewables.'],
            ['category' => 'Energy & Sustainability', 'name' => 'Carbon Capture & Storage (CCS)', 'description' => 'Technologies designed to remove CO2 from the atmosphere or industrial emissions.'],
            ['category' => 'Energy & Sustainability', 'name' => 'Smart Grid Management', 'description' => 'Modernizing electrical grids to handle the fluctuating supply of renewable energy.'],
            ['category' => 'Energy & Sustainability', 'name' => 'Environmental, Social, and Governance (ESG) Consulting', 'description' => 'Helping firms meet sustainability regulations and climate goals.'],
            ['category' => 'Energy & Sustainability', 'name' => 'Water Treatment & Management', 'description' => 'Ensuring clean water supply through advanced filtration and desalination.'],
            ['category' => 'Energy & Sustainability', 'name' => 'Waste Management & Circular Economy', 'description' => 'Recycling and repurposing industrial and consumer waste into new materials.'],

            // ─── Healthcare & Life Sciences ───
            ['category' => 'Healthcare & Life Sciences', 'name' => 'Biotechnology', 'description' => 'Engineering biological systems for medicine, including gene editing and synthetic biology.'],
            ['category' => 'Healthcare & Life Sciences', 'name' => 'Pharmaceutical Manufacturing', 'description' => 'Developing and producing drugs, with a focus on personalized medicine and mRNA.'],
            ['category' => 'Healthcare & Life Sciences', 'name' => 'Digital Health & Telemedicine', 'description' => 'Providing remote medical consultations and health monitoring via apps.'],
            ['category' => 'Healthcare & Life Sciences', 'name' => 'Medical Device Manufacturing', 'description' => 'Creating high-tech equipment like robotic surgeons and wearable health trackers.'],
            ['category' => 'Healthcare & Life Sciences', 'name' => 'Geriatric Care & Senior Living', 'description' => 'Specialized services and housing for the rapidly aging global population.'],
            ['category' => 'Healthcare & Life Sciences', 'name' => 'Health Insurance', 'description' => 'Providing financial coverage for medical expenses and health-related risks.'],
            ['category' => 'Healthcare & Life Sciences', 'name' => 'Life Sciences Research', 'description' => 'Laboratory-based study of organisms to solve health and environmental issues.'],
            ['category' => 'Healthcare & Life Sciences', 'name' => 'Genomics', 'description' => 'Mapping and analyzing DNA to predict and treat hereditary diseases.'],
            ['category' => 'Healthcare & Life Sciences', 'name' => 'Mental Health Services', 'description' => 'Offering therapy and digital wellness tools to address rising global stress and anxiety.'],
            ['category' => 'Healthcare & Life Sciences', 'name' => 'Clinical Trial Operations', 'description' => 'Managing the rigorous testing phases required for new drugs and treatments.'],

            // ─── Finance & Professional Services ───
            ['category' => 'Finance & Professional Services', 'name' => 'Commercial Banking', 'description' => 'Providing loans, credit, and savings services to businesses and individuals.'],
            ['category' => 'Finance & Professional Services', 'name' => 'Investment Management', 'description' => 'Handling assets and portfolios for institutional and private investors.'],
            ['category' => 'Finance & Professional Services', 'name' => 'Real Estate (Commercial & Residential)', 'description' => 'The buying, selling, and management of physical property and land.'],
            ['category' => 'Finance & Professional Services', 'name' => 'Management Consulting', 'description' => 'Advising corporations on strategy, digital transformation, and efficiency.'],
            ['category' => 'Finance & Professional Services', 'name' => 'Legal Services', 'description' => 'Providing counsel on corporate law, intellectual property, and international regulations.'],
            ['category' => 'Finance & Professional Services', 'name' => 'Pension & Retirement Funds', 'description' => 'Managing long-term investment pools for retirees.'],
            ['category' => 'Finance & Professional Services', 'name' => 'Accounting & Auditing', 'description' => 'Ensuring financial transparency and compliance with tax and reporting laws.'],
            ['category' => 'Finance & Professional Services', 'name' => 'Engineering Services', 'description' => 'Designing infrastructure, machinery, and complex technical systems.'],
            ['category' => 'Finance & Professional Services', 'name' => 'Advertising & Digital Marketing', 'description' => 'Using data analytics to promote products across social and digital platforms.'],
            ['category' => 'Finance & Professional Services', 'name' => 'Human Resources & Staffing', 'description' => 'Recruiting and managing talent, particularly for high-demand tech and healthcare roles.'],

            // ─── Consumer, Logistics & Manufacturing ───
            ['category' => 'Consumer, Logistics & Manufacturing', 'name' => 'E-commerce & Digital Retail', 'description' => 'Selling goods directly to consumers through online marketplaces.'],
            ['category' => 'Consumer, Logistics & Manufacturing', 'name' => 'Logistics & Supply Chain Management', 'description' => 'Moving goods globally through complex shipping and trucking networks.'],
            ['category' => 'Consumer, Logistics & Manufacturing', 'name' => 'Automotive Parts & Accessories', 'description' => 'Manufacturing the components required for vehicle repair and assembly.'],
            ['category' => 'Consumer, Logistics & Manufacturing', 'name' => 'Fast-Moving Consumer Goods (FMCG)', 'description' => 'Producing daily essentials like packaged food, toiletries, and cleaning supplies.'],
            ['category' => 'Consumer, Logistics & Manufacturing', 'name' => 'Aerospace & Defense', 'description' => 'Developing commercial aircraft, satellites, and military technology.'],
            ['category' => 'Consumer, Logistics & Manufacturing', 'name' => 'Construction & Infrastructure', 'description' => 'Building the roads, bridges, and housing required for urbanization.'],
            ['category' => 'Consumer, Logistics & Manufacturing', 'name' => 'Media & Entertainment (Streaming)', 'description' => 'Producing and distributing digital content like movies, music, and games.'],
            ['category' => 'Consumer, Logistics & Manufacturing', 'name' => 'Hospitality & Tourism', 'description' => 'Providing travel experiences, hotels, and leisure services.'],
            ['category' => 'Consumer, Logistics & Manufacturing', 'name' => 'Advanced Manufacturing (3D Printing)', 'description' => 'Using additive manufacturing to create complex parts on demand.'],
            ['category' => 'Consumer, Logistics & Manufacturing', 'name' => 'Food Technology (AgTech)', 'description' => 'Innovating in agriculture through lab-grown meat and vertical farming.'],
        ];

        foreach ($fields as $field) {
            \App\Models\FieldOfWork::create($field);
        }
    }
}
