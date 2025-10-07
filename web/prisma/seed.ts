import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin if not exists
  const adminEmail = "admin@example.com";
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      fullName: "Admin User",
      phoneNumber: "",
      role: "ADMIN",
      passwordHash: await hash("admin123", 10),
    },
  });

  // Services
  const services = [
    { name: "Import Compliance Service", description: "Compliance, engineering, and registration assistance.", estimatedPrice: "Starts from $1,500" },
    { name: "Detailing & Delivery", description: "Full detail and secure transport across Australia.", estimatedPrice: "Quote on request" },
  ];
  for (const s of services) {
    await prisma.service.upsert({ where: { name: s.name }, update: {}, create: s });
  }

  // Example car
  await prisma.carListing.create({
    data: {
      make: "Toyota",
      model: "Supra",
      year: 1998,
      priceAud: 89990,
      mileageKm: 120000,
      vin: "JZA80-1234567",
      description: "Iconic JDM legend in excellent condition.",
      mainImageUrl: "https://images.unsplash.com/photo-1616567612823-5a50ed7f4a5f?q=80&w=1600&auto=format&fit=crop",
      photoUrls: [
        "https://images.unsplash.com/photo-1616567612823-5a50ed7f4a5f?q=80&w=1200&auto=format&fit=crop",
      ],
      engineSize: "3.0L",
      transmission: "Manual",
      fuelType: "Petrol",
    },
  });

  console.log({ adminCreated: admin.email });
}

main().finally(async () => {
  await prisma.$disconnect();
});
