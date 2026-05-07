import "dotenv/config"
import {
  PrismaClient,
  DeviationCategory,
  DeviationStatus,
  Severity,
  CAPAStatus,
} from "../generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const sites = [
  { name: "ГКБ №1 им. Пирогова", code: "SITE-001", location: "Москва" },
  {
    name: "НИИ Онкологии им. Петрова",
    code: "SITE-002",
    location: "Санкт-Петербург",
  },
  { name: "РКБ Республики Татарстан", code: "SITE-003", location: "Казань" },
  { name: "НИИТО им. Цивьяна", code: "SITE-004", location: "Новосибирск" },
  {
    name: "Краевая клиническая больница №1",
    code: "SITE-005",
    location: "Краснодар",
  },
  {
    name: "Областная клиническая больница",
    code: "SITE-006",
    location: "Екатеринбург",
  },
  { name: "ГКБ №40", code: "SITE-007", location: "Нижний Новгород" },
  { name: "Клиническая больница №1", code: "SITE-008", location: "Самара" },
  { name: "МОНИКИ им. Владимирского", code: "SITE-009", location: "Москва" },
  { name: "ВМА им. Кирова", code: "SITE-010", location: "Санкт-Петербург" },
]

const categories = Object.values(DeviationCategory)
const allStatuses = Object.values(DeviationStatus)

const descriptions: Record<string, string[]> = {
  MISSED_VISIT: [
    "Patient missed Visit 4 (Week 12) due to hospitalization.",
    "Subject failed to attend Visit 6 (Week 24). Travel restrictions.",
    "Visit 3 (Week 8) missed — patient relocated temporarily.",
    "Patient did not attend Visit 5 (Week 16) — scheduling conflict.",
    "Subject missed Visit 2 (Week 4) — transportation issues.",
  ],
  WINDOW_VIOLATION: [
    "Blood draw for PK analysis performed 3 hours outside window.",
    "ECG assessment conducted 2 days after the allowed window.",
    "Vital signs taken 4 hours after dosing instead of 2-hour post-dose.",
    "Lab samples collected 1 day outside the visit window.",
    "Imaging procedure performed 5 days late due to equipment malfunction.",
  ],
  DOSING_ERROR: [
    "Patient received 150mg instead of 100mg due to pharmacy error.",
    "Double dose — patient took morning and evening dose simultaneously.",
    "IMP administered after meal instead of required fasting state.",
    "Wrong formulation dispensed: tablet instead of capsule.",
    "Dose delayed 48 hours due to supply chain issue.",
  ],
  ICF_ISSUE: [
    "Consent obtained after first study procedure was performed.",
    "Outdated ICF version (v2.0) used instead of current (v3.1).",
    "Consent obtained by unauthorized staff member.",
    "Patient not given adequate time for questions during consent.",
    "Amendment v2 consent not obtained before amendment procedures.",
  ],
  SAMPLE_HANDLING: [
    "Serum samples stored at room temp for 6 hours instead of -20°C.",
    "PK sample centrifugation delayed 4 hours past processing window.",
    "Specimen labeling error: patient ID mismatch on 2 of 4 tubes.",
    "Blood samples shipped without dry ice — temperature excursion.",
    "24-hour urine collection incomplete: patient discarded first void.",
  ],
  ELIGIBILITY: [
    "Subject enrolled with creatinine 2.1 mg/dL — exceeds criterion.",
    "Concurrent CYP3A4 inhibitor not identified at screening.",
    "Subject age 17 at enrollment — protocol requires ≥18.",
    "Baseline QTc 470ms exceeds exclusion criterion <450ms.",
    "Active malignancy not identified during screening review.",
  ],
  PROCEDURE_DEVIATION: [
    "MRI performed instead of CT scan as per protocol.",
    "Liver biopsy: fewer cores obtained (2 vs required 4).",
    "Physical exam performed by nurse instead of PI.",
    "Spirometry not performed due to equipment calibration issues.",
    "Randomization: IVRS not used; manual randomization performed.",
  ],
  DOCUMENTATION: [
    "Source documents completed 2 weeks late instead of 48 hours.",
    "AE onset date incorrectly recorded in CRF.",
    "E-signature missing for Visit 5; PI signature 30 days late.",
    "Concomitant medication log incomplete — 3 meds not recorded.",
    "Query resolution exceeded 14-day window for 8 queries.",
  ],
  OTHER: [
    "Unblinding occurred when pharmacy label was visible.",
    "Procedures initiated before IRB approval of Amendment 3.",
    "IMP storage excursion: 12°C for 8 hours vs required 2-8°C.",
    "Delegation log update delay — coordinator active 2 weeks early.",
    "SAE report submitted 5 days late, exceeding 24-hour requirement.",
  ],
}

const capaDescriptions = [
  "Retrain site staff on protocol visit schedule and window requirements",
  "Implement automated patient reminder system for upcoming visits",
  "Review and update pharmacy dispensing SOP with double-check verification",
  "Conduct re-consent using current IRB-approved ICF version",
  "Install temperature monitoring alarms for sample storage equipment",
  "Perform re-screening assessment and document eligibility re-evaluation",
  "Update delegation log and ensure staff complete protocol-specific training",
  "Implement real-time CRF completion policy with 48-hour deadline",
  "Review IMP storage procedures and install backup temperature monitoring",
  "Submit corrective CIOMS/MedWatch form with accurate event dates",
  "Conduct site-wide GCP refresher training with assessment",
  "Implement pre-visit checklist for protocol-required procedures",
  "Establish secondary review process for eligibility criteria",
  "Install IVRS training module for all randomization staff",
  "Deploy SOPs for sample processing timelines",
]
const assignees = [
  "Dr. Ivanova A.V.",
  "Dr. Petrov S.K.",
  "Coordinator Sidorova M.N.",
  "QA Manager Kozlov D.I.",
  "PI Dr. Smirnov V.A.",
  "CRA Volkov E.P.",
  "Dr. Kuznetsova O.L.",
  "Pharmacist Morozov A.S.",
]

const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const randDate = (s: Date, e: Date) =>
  new Date(s.getTime() + Math.random() * (e.getTime() - s.getTime()))

async function main() {
  console.log("🌱 Seeding database...")
  await prisma.aIClassification.deleteMany()
  await prisma.cAPA.deleteMany()
  await prisma.deviation.deleteMany()
  await prisma.site.deleteMany()
  await prisma.report.deleteMany()

  const createdSites = await Promise.all(
    sites.map((s) => prisma.site.create({ data: s }))
  )
  console.log(`✅ ${createdSites.length} sites`)

  const deviations = []
  let counter = 1
  const siteWeights = [8, 7, 15, 6, 7, 8, 14, 5, 6, 7]

  for (let si = 0; si < createdSites.length; si++) {
    const site = createdSites[si]
    for (let i = 0; i < siteWeights[si]; i++) {
      let cat = rand(categories)
      if (si === 2 && Math.random() < 0.5) cat = DeviationCategory.DOSING_ERROR
      if (si === 6 && Math.random() < 0.5)
        cat = DeviationCategory.WINDOW_VIOLATION

      const desc = rand(descriptions[cat] || descriptions.OTHER)
      const sev = Math.random() < 0.35 ? Severity.major : Severity.minor
      const statusWeights = [0.2, 0.2, 0.3, 0.3]
      const roll = Math.random()
      let cum = 0,
        status = allStatuses[0]
      for (let s = 0; s < allStatuses.length; s++) {
        cum += statusWeights[s]
        if (roll <= cum) {
          status = allStatuses[s]
          break
        }
      }

      const devDate = randDate(new Date("2025-01-01"), new Date("2026-05-01"))
      const dev = await prisma.deviation.create({
        data: {
          deviationNumber: `PD-2025-${String(counter++).padStart(4, "0")}`,
          siteId: site.id,
          patientId: `PAT-${String(site.id).padStart(2, "0")}-${String(Math.floor(Math.random() * 50) + 1).padStart(3, "0")}`,
          deviationDate: devDate,
          description: desc,
          category: cat,
          severity: sev,
          severityRationale:
            sev === Severity.major
              ? "Impacts patient safety / data integrity per ICH-GCP E6(R2)."
              : "Administrative; no patient safety / data impact.",
          status,
          reportedAt: new Date(devDate.getTime() + Math.random() * 7 * 864e5),
          createdAt: devDate,
        },
      })
      deviations.push(dev)
    }
  }
  console.log(`✅ ${deviations.length} deviations`)

  let capaCount = 0
  for (const d of deviations) {
    if (
      d.status === DeviationStatus.capa_assigned ||
      d.status === DeviationStatus.closed
    ) {
      const cs =
        d.status === DeviationStatus.closed
          ? CAPAStatus.completed
          : rand([
              CAPAStatus.pending,
              CAPAStatus.in_progress,
              CAPAStatus.overdue,
            ])
      const due = new Date(d.createdAt.getTime() + 30 * 864e5)
      await prisma.cAPA.create({
        data: {
          deviationId: d.id,
          description: rand(capaDescriptions),
          assignedTo: rand(assignees),
          dueDate: due,
          status: cs,
          completionNotes:
            cs === CAPAStatus.completed ? "Completed. Evidence in TMF." : null,
          completedAt:
            cs === CAPAStatus.completed ? randDate(d.createdAt, due) : null,
        },
      })
      capaCount++
    }
  }
  console.log(`✅ ${capaCount} CAPAs`)

  let aiCount = 0
  for (const d of deviations) {
    if (d.severity && Math.random() < 0.7) {
      await prisma.aIClassification.create({
        data: {
          deviationId: d.id,
          severity: d.severity,
          rationale:
            d.severity === Severity.major
              ? "Per ICH-GCP E6(R2), this deviation affects patient safety/data integrity."
              : "Per ICH-GCP E6(R2), this is procedural/administrative. No patient safety impact.",
          confidence: 0.75 + Math.random() * 0.2,
          riskFactors:
            d.severity === Severity.major
              ? ["Patient safety", "Data integrity", "Regulatory notification"]
              : ["Administrative", "No patient impact"],
          regulatoryRef: "ICH-GCP E6(R2) Section 4.5",
          modelUsed: "google/gemini-2.5-flash",
        },
      })
      aiCount++
    }
  }
  console.log(`✅ ${aiCount} AI Classifications`)
  console.log("\n🎉 Seed completed!")
}

main()
  .catch((e) => {
    console.error("❌", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
