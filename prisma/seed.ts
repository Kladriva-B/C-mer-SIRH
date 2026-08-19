import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PERMISSIONS, PERMISSION_LABELS, ROLE_DEFAULT_SCOPE, ROLE_DESCRIPTIONS, ROLE_PERMISSIONS } from "../lib/permissions";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL manquant");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const MINIMAL_PDF = Buffer.from(
  "%PDF-1.4\n1 0 obj<<>>endobj\n2 0 obj<< /Length 44 >>stream\nBT /F1 12 Tf 72 720 Td (Camer SIRH) Tj ET\nendstream\nendobj\ntrailer<<>>\n%%EOF\n",
);

async function writeSeedFile(key: string) {
  const fullPath = path.join(process.cwd(), "uploads", key);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, MINIMAL_PDF);
}

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.payrollItem.deleteMany();
  await prisma.payroll.deleteMany();
  await prisma.document.deleteMany();
  await prisma.sanction.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.explanationRequest.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.user.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.position.deleteMany();
  await prisma.department.deleteMany();
  await prisma.site.deleteMany();
  await prisma.sanctionType.deleteMany();
  await prisma.documentType.deleteMany();
  await prisma.organization.deleteMany();

  await prisma.organization.create({
    data: {
      name: "Camer SIRH",
      legalName: "Camer SIRH SARL",
      address: "Boulevard de la Liberté, Akwa",
      city: "Douala",
      country: "Cameroun",
      phone: "+237 233 42 10 10",
      email: "contact@camer-sirh.cm",
    },
  });

  const permissionRecords = await Promise.all(
    PERMISSIONS.map((key) => {
      const [resource, action] = key.split(".");
      return prisma.permission.create({
        data: {
          key,
          resource,
          action,
          description: PERMISSION_LABELS[key],
        },
      });
    }),
  );
  const permissionByKey = Object.fromEntries(permissionRecords.map((permission) => [permission.key, permission]));

  const roleNames = ["ADMIN", "HR_MANAGER", "HR_AGENT", "MANAGER", "EMPLOYEE"] as const;
  const roles = await Promise.all(
    roleNames.map((name) =>
      prisma.role.create({
        data: {
          name,
          description: ROLE_DESCRIPTIONS[name],
          defaultScope: ROLE_DEFAULT_SCOPE[name],
          isSystem: true,
          permissions: {
            create: ROLE_PERMISSIONS[name].map((key) => ({
              permissionId: permissionByKey[key].id,
            })),
          },
        },
      }),
    ),
  );
  const roleByName = Object.fromEntries(roles.map((role) => [role.name, role]));
  const passwordHash = await bcrypt.hash("Demo123!", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@camer-sirh.local",
      passwordHash,
      name: "Amina Ngo",
      roleId: roleByName.ADMIN.id,
      emailVerifiedAt: new Date("2026-01-10"),
      twoFactorEnabled: true,
    },
  });
  const hrManager = await prisma.user.create({
    data: {
      email: "rh.manager@camer-sirh.local",
      passwordHash,
      name: "Paul Mbarga",
      roleId: roleByName.HR_MANAGER.id,
      emailVerifiedAt: new Date("2026-02-01"),
    },
  });
  const employeeUser = await prisma.user.create({
    data: {
      email: "jean.dupont@camer-sirh.local",
      passwordHash,
      name: "Jean Dupont",
      roleId: roleByName.EMPLOYEE.id,
      emailVerifiedAt: new Date("2026-06-08"),
    },
  });

  const [rh, finance, it] = await Promise.all([
    prisma.department.create({ data: { name: "Ressources humaines", code: "RH" } }),
    prisma.department.create({ data: { name: "Finance", code: "FIN" } }),
    prisma.department.create({ data: { name: "Informatique", code: "IT" } }),
  ]);

  const [rhLead, payrollOfficer, developer, teamLead] = await Promise.all([
    prisma.position.create({ data: { name: "Responsable RH", code: "RH-01", departmentId: rh.id } }),
    prisma.position.create({ data: { name: "Chargé de paie", code: "RH-02", departmentId: finance.id } }),
    prisma.position.create({ data: { name: "Développeur frontend", code: "IT-01", departmentId: it.id } }),
    prisma.position.create({ data: { name: "Chef d'équipe informatique", code: "IT-00", departmentId: it.id } }),
  ]);

  const douala = await prisma.site.create({
    data: {
      name: "Siège Douala",
      code: "DLA",
      city: "Douala",
      email: "douala@camer-sirh.cm",
      phone: "+237 233 42 10 10",
      isActive: true,
    },
  });
  await prisma.site.create({
    data: {
      name: "Agence Yaoundé",
      code: "YDE",
      city: "Yaoundé",
      email: "yaounde@camer-sirh.cm",
      phone: "+237 222 20 20 20",
      isActive: true,
    },
  });
  await prisma.site.create({
    data: {
      name: "Agence Bafoussam",
      code: "BAF",
      city: "Bafoussam",
      email: "bafoussam@camer-sirh.cm",
      isActive: true,
    },
  });

  const sanctionTypes = await Promise.all(
    [
      { name: "Avertissement écrit", code: "AVERT" },
      { name: "Mise à pied", code: "MAP" },
    ].map((type) => prisma.sanctionType.create({ data: type })),
  );

  const [idType, contractType, diplomaType, photoType, payslipType] = await Promise.all(
    [
      { name: "Carte d'identité", code: "ID" },
      { name: "Contrat signé", code: "CONTRACT" },
      { name: "Diplôme", code: "DIPLOMA" },
      { name: "Photo", code: "PHOTO" },
      { name: "Bulletin de paie", code: "PAYSLIP" },
    ].map((type) => prisma.documentType.create({ data: type })),
  );

  const amina = await prisma.employee.create({
    data: {
      userId: admin.id,
      firstName: "Amina",
      lastName: "Ngo",
      email: admin.email,
      phone: "+237 690 10 20 30",
      dateOfBirth: new Date("1988-05-12"),
      gender: "FEMALE",
      address: "Bonanjo, Douala",
      matricule: "CS-00001",
      cnps: "221-1044102-1",
      departmentId: rh.id,
      positionId: rhLead.id,
      contractType: "CDI",
      hiredAt: new Date("2024-01-08"),
      salaryAmount: 720_000,
      status: "ACTIVE",
    },
  });

  const paul = await prisma.employee.create({
    data: {
      userId: hrManager.id,
      firstName: "Paul",
      lastName: "Mbarga",
      email: hrManager.email,
      phone: "+237 691 22 33 44",
      dateOfBirth: new Date("1990-11-03"),
      gender: "MALE",
      address: "Makepe, Douala",
      matricule: "CS-00002",
      cnps: "318-1099104-2",
      departmentId: finance.id,
      positionId: payrollOfficer.id,
      contractType: "CDI",
      hiredAt: new Date("2025-03-01"),
      salaryAmount: 480_000,
      status: "ACTIVE",
    },
  });

  const jean = await prisma.employee.create({
    data: {
      userId: employeeUser.id,
      firstName: "Jean",
      lastName: "Dupont",
      email: employeeUser.email,
      phone: "+237 690 78 95 36",
      dateOfBirth: new Date("1998-04-26"),
      gender: "MALE",
      address: "Ange Raphaël, Douala",
      matricule: "CS-00003",
      cnps: "357-1056107-4",
      departmentId: it.id,
      positionId: developer.id,
      contractType: "CDI",
      hiredAt: new Date("2026-06-08"),
      salaryAmount: 250_000,
      leaveBalance: 18,
      status: "ACTIVE",
    },
  });

  const claire = await prisma.employee.create({
    data: {
      firstName: "Claire",
      lastName: "Fotso",
      email: "claire.fotso@camer-sirh.local",
      phone: "+237 690 40 50 60",
      dateOfBirth: new Date("1989-09-18"),
      gender: "FEMALE",
      address: "Bonapriso, Douala",
      matricule: "CS-00004",
      cnps: "410-1088120-8",
      departmentId: it.id,
      positionId: teamLead.id,
      contractType: "CDI",
      hiredAt: new Date("2023-04-02"),
      salaryAmount: 520_000,
      status: "ACTIVE",
    },
  });

  const samuel = await prisma.employee.create({
    data: {
      firstName: "Samuel",
      lastName: "Ewane",
      email: "samuel.ewane@camer-sirh.local",
      phone: "+237 670 55 61 70",
      dateOfBirth: new Date("1995-01-22"),
      gender: "MALE",
      address: "Ndokotti, Douala",
      matricule: "CS-00005",
      cnps: "289-1022331-6",
      departmentId: it.id,
      positionId: developer.id,
      contractType: "CDI",
      hiredAt: new Date("2025-09-15"),
      salaryAmount: 280_000,
      managerId: claire.id,
      status: "ACTIVE",
    },
  });

  await prisma.employee.update({
    where: { id: jean.id },
    data: { managerId: claire.id },
  });

  await prisma.contract.createMany({
    data: [
      {
        employeeId: amina.id,
        type: "CDI",
        status: "ACTIVE",
        startDate: new Date("2024-01-08"),
        salaryAmount: 720_000,
        netAmount: 610_000,
        hourlyRate: 4_500,
        weeklyHours: 40,
      },
      {
        employeeId: paul.id,
        type: "CDI",
        status: "ACTIVE",
        startDate: new Date("2025-03-01"),
        salaryAmount: 480_000,
        netAmount: 410_000,
        hourlyRate: 3_000,
        weeklyHours: 40,
      },
      {
        employeeId: jean.id,
        type: "TRIAL",
        status: "ENDED",
        startDate: new Date("2026-06-08"),
        endDate: new Date("2026-11-30"),
        salaryAmount: 250_000,
        netAmount: 210_000,
        hourlyRate: 1_560,
        weeklyHours: 40,
      },
      {
        employeeId: jean.id,
        type: "CDI",
        status: "ACTIVE",
        startDate: new Date("2026-06-08"),
        endDate: new Date("2026-12-08"),
        salaryAmount: 250_000,
        netAmount: 210_000,
        hourlyRate: 1_560,
        weeklyHours: 40,
      },
    ],
  });

  await prisma.worker.create({
    data: {
      firstName: "Pierre",
      lastName: "Nkolo",
      phone: "+237 670 12 34 56",
      matricule: "OUV-2024-001",
      positionId: developer.id,
      siteId: douala.id,
      assignment: "Support chantier",
      contractType: "CDD",
      hiredAt: new Date("2024-04-05"),
      dailyRate: 12_000,
      status: "ACTIVE",
    },
  });

  await prisma.leaveRequest.createMany({
    data: [
      {
        employeeId: jean.id,
        kind: "ANNUAL",
        startDate: new Date("2026-08-18"),
        endDate: new Date("2026-08-20"),
        days: 3,
        reason: "Repos familial",
        status: "APPROVED",
      },
      {
        employeeId: jean.id,
        kind: "ABSENCE",
        startDate: new Date("2026-08-13"),
        endDate: new Date("2026-08-13"),
        days: 1,
        reason: "Rendez-vous administratif",
        status: "APPROVED",
      },
      {
        employeeId: jean.id,
        kind: "ANNUAL",
        startDate: new Date("2026-08-13"),
        endDate: new Date("2026-08-14"),
        days: 2,
        status: "APPROVED",
      },
      {
        employeeId: amina.id,
        kind: "PERMISSION",
        startDate: new Date("2026-08-01"),
        endDate: new Date("2026-08-01"),
        days: 1,
        status: "CANCELLED",
      },
    ],
  });

  await prisma.explanationRequest.create({
    data: {
      employeeId: jean.id,
      subject: "Retard sur livraison interne",
      message: "Merci d'expliquer le décalage constaté sur le planning de sprint.",
      status: "PENDING",
      dueDate: new Date("2026-08-22"),
    },
  });

  await prisma.evaluation.createMany({
    data: [
      {
        employeeId: jean.id,
        title: "Évaluation d'essai",
        score: 78,
        comment: "Bonne autonomie, à renforcer sur la documentation.",
        evaluatedAt: new Date("2026-08-01"),
      },
      {
        employeeId: paul.id,
        title: "Revue semestrielle",
        score: 88,
        evaluatedAt: new Date("2026-07-15"),
      },
      {
        employeeId: amina.id,
        title: "Revue annuelle",
        score: 94,
        evaluatedAt: new Date("2026-06-20"),
      },
    ],
  });

  await prisma.sanction.create({
    data: {
      reference: "SAN-2026-0001",
      employeeId: jean.id,
      typeId: sanctionTypes[0].id,
      reason: "Retard répété",
      description: "Deux retards constatés en juillet.",
      date: new Date("2026-07-12"),
      status: "PENDING",
      issuerId: hrManager.id,
    },
  });
  await prisma.sanction.create({
    data: {
      reference: "SAN-2026-0002",
      employeeId: jean.id,
      typeId: sanctionTypes[1].id,
      reason: "Absence non justifiée",
      date: new Date("2026-08-16"),
      status: "ACTIVE",
      issuerId: admin.id,
    },
  });

  for (const employee of [amina, paul, jean]) {
    const gross = employee.salaryAmount;
    const transport = 25_000;
    const cnps = Math.round(gross * 0.042);
    const irpp = Math.round((gross + transport - 50_000) * 0.1);
    const payroll = await prisma.payroll.create({
      data: {
        employeeId: employee.id,
        periodYear: 2026,
        periodMonth: 7,
        grossAmount: gross + transport,
        deductions: cnps + irpp,
        netAmount: gross + transport - cnps - irpp,
        status: "GENERATED",
        generatedAt: new Date("2026-07-31"),
        items: {
          create: [
            { label: "Salaire de base", amount: gross, kind: "earning" },
            { label: "Prime de transport", amount: transport, kind: "earning" },
            { label: "CNPS (4,2 %)", amount: -cnps, kind: "deduction" },
            { label: "IRPP (estimé)", amount: -irpp, kind: "deduction" },
          ],
        },
      },
    });
    await prisma.verification.create({
      data: {
        reference: `DOC-2026-${employee.matricule.slice(-3).padStart(6, "0")}`,
        payrollId: payroll.id,
        employeeId: employee.id,
        status: "VALID",
        issuedAt: new Date("2026-07-31"),
      },
    });
  }

  const files = [
    { key: "seed/cni-jean.pdf", name: "CNI", typeId: idType.id },
    { key: "seed/contrat-jean.pdf", name: "Contrat signé", typeId: contractType.id },
    { key: "seed/diplome-jean.pdf", name: "Diplôme", typeId: diplomaType.id },
    { key: "seed/photo-jean.pdf", name: "Photo", typeId: photoType.id },
  ];
  for (const file of files) {
    await writeSeedFile(file.key);
    await prisma.document.create({
      data: {
        name: file.name,
        typeId: file.typeId,
        employeeId: jean.id,
        uploaderId: admin.id,
        storageKey: file.key,
        mimeType: "application/pdf",
        sizeBytes: MINIMAL_PDF.byteLength,
        status: "ACTIVE",
      },
    });
  }

  await prisma.document.create({
    data: {
      name: "Bulletin juillet 2026",
      typeId: payslipType.id,
      employeeId: jean.id,
      uploaderId: admin.id,
      storageKey: "seed/cni-jean.pdf",
      mimeType: "application/pdf",
      sizeBytes: MINIMAL_PDF.byteLength,
      status: "ACTIVE",
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: admin.id,
        title: "Demande d'explication",
        message: "Une demande est en attente pour Jean Dupont.",
        type: "WARNING",
        href: "/performance",
      },
      {
        userId: admin.id,
        title: "Congé approuvé",
        message: "Le congé de Jean Dupont a été validé.",
        type: "SUCCESS",
        href: "/leaves",
      },
      {
        userId: employeeUser.id,
        title: "Documents disponibles",
        message: "Vos pièces personnelles sont consultables dans Mon espace.",
        type: "INFO",
        href: "/me",
      },
      {
        userId: hrManager.id,
        title: "Bulletin généré",
        message: "Les bulletins de juillet 2026 sont prêts.",
        type: "SUCCESS",
        href: "/payroll",
      },
    ],
  });

  console.log("Seed terminé. 3 comptes :");
  console.log("  admin@camer-sirh.local / Demo123!");
  console.log("  rh.manager@camer-sirh.local / Demo123!");
  console.log("  jean.dupont@camer-sirh.local / Demo123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
