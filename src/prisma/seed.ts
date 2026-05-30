import { PrismaClient, UserRole, EmployeeStatus, OrderStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing records to ensure idempotent seed
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderTimeline.deleteMany();
  await prisma.order.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.measurement.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.user.deleteMany();
  await prisma.business.deleteMany();

  console.log('🧹 Cleaned existing database tables.');

  // 1. Create Business
  const business = await prisma.business.create({
    data: {
      name: 'TailorFlow Premium Atelier',
      phone: '+15550199',
      email: 'atelier@tailorflow.com',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      currency: 'USD',
      language: 'en',
    },
  });
  console.log(`🏢 Seeded Business: ${business.name}`);

  // 2. Create Business Settings
  await prisma.settings.create({
    data: {
      businessId: business.id,
      workflowSettings: {
        stages: [
          'PENDING',
          'MEASURING',
          'CUTTING',
          'STITCHING',
          'EMBROIDERY',
          'IRONING',
          'QUALITY_CHECK',
          'READY',
          'DELIVERED',
        ],
      },
      currency: 'USD',
      language: 'en',
      theme: 'dark',
      notificationSettings: { sms: true, email: true, whatsapp: true },
      businessPreferences: { enableInvoicePdf: true, defaultTaxRate: 0.08 },
    },
  });
  console.log('⚙️ Seeded Business Settings');

  // 3. Hash password for users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 4. Create Users (Admin, Manager, Tailor, Receptionist, Cashier)
  const adminUser = await prisma.user.create({
    data: {
      name: 'Tayyab Admin',
      email: 'admin@tailorflow.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      businessId: business.id,
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      name: 'Sarah Manager',
      email: 'manager@tailorflow.com',
      password: hashedPassword,
      role: UserRole.MANAGER,
      businessId: business.id,
    },
  });

  const tailorUser = await prisma.user.create({
    data: {
      name: 'Master Ahmed',
      email: 'tailor@tailorflow.com',
      password: hashedPassword,
      role: UserRole.TAILOR,
      businessId: business.id,
    },
  });

  const recepUser = await prisma.user.create({
    data: {
      name: 'Lisa Receptionist',
      email: 'recep@tailorflow.com',
      password: hashedPassword,
      role: UserRole.RECEPTIONIST,
      businessId: business.id,
    },
  });

  const cashierUser = await prisma.user.create({
    data: {
      name: 'Ken Cashier',
      email: 'cashier@tailorflow.com',
      password: hashedPassword,
      role: UserRole.CASHIER,
      businessId: business.id,
    },
  });
  console.log('👥 Seeded Users (Admin, Manager, Tailor, Receptionist, Cashier)');

  // 5. Create corresponding Employee Records
  await prisma.employee.create({
    data: {
      businessId: business.id,
      userId: adminUser.id,
      name: adminUser.name,
      phone: '+15551001',
      role: UserRole.ADMIN,
      status: EmployeeStatus.ACTIVE,
    },
  });

  await prisma.employee.create({
    data: {
      businessId: business.id,
      userId: managerUser.id,
      name: managerUser.name,
      phone: '+15551002',
      role: UserRole.MANAGER,
      status: EmployeeStatus.ACTIVE,
    },
  });

  const tailorEmp = await prisma.employee.create({
    data: {
      businessId: business.id,
      userId: tailorUser.id,
      name: tailorUser.name,
      phone: '+15551003',
      role: UserRole.TAILOR,
      status: EmployeeStatus.ACTIVE,
    },
  });

  await prisma.employee.create({
    data: {
      businessId: business.id,
      userId: recepUser.id,
      name: recepUser.name,
      phone: '+15551004',
      role: UserRole.RECEPTIONIST,
      status: EmployeeStatus.ACTIVE,
    },
  });

  await prisma.employee.create({
    data: {
      businessId: business.id,
      userId: cashierUser.id,
      name: cashierUser.name,
      phone: '+15551005',
      role: UserRole.CASHIER,
      status: EmployeeStatus.ACTIVE,
    },
  });
  console.log('💼 Seeded Employee records linked to users');

  // Add another Tailor employee record (who does not have a user login)
  const assistantTailorEmp = await prisma.employee.create({
    data: {
      businessId: business.id,
      name: 'Sajid Assistant',
      phone: '+15551006',
      role: UserRole.TAILOR,
      status: EmployeeStatus.ACTIVE,
    },
  });
  console.log('🧵 Seeded Assistant Tailor employee');

  // 6. Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      businessId: business.id,
      name: 'John Doe',
      phone: '+15552001',
      email: 'john.doe@gmail.com',
      gender: 'Male',
      address: '123 Elm Street',
      notes: 'Prefers loose fitting for shirts, regular fit for suits.',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      businessId: business.id,
      name: 'Jane Smith',
      phone: '+15552002',
      email: 'jane.smith@yahoo.com',
      gender: 'Female',
      address: '456 Oak Avenue',
      notes: 'Prefers high necklines.',
    },
  });
  console.log('👤 Seeded Customers');

  // 7. Create Measurements
  const m1 = await prisma.measurement.create({
    data: {
      customerId: customer1.id,
      templateName: 'Standard Suit',
      gender: 'Male',
      measurementData: {
        neck: 16.0,
        chest: 42.0,
        waist: 36.0,
        hips: 44.0,
        shoulder: 19.5,
        sleeve: 25.0,
        inseam: 31.5,
      },
      notes: 'Measured with light shirt on.',
    },
  });

  const m2 = await prisma.measurement.create({
    data: {
      customerId: customer2.id,
      templateName: 'Classic Dress',
      gender: 'Female',
      measurementData: {
        bust: 36.0,
        waist: 28.0,
        hips: 38.0,
        shoulder: 15.0,
        dressLength: 40.0,
      },
    },
  });
  console.log('📐 Seeded Measurements');

  // 8. Create Orders
  // Order 1: Completed & Delivered
  const order1 = await prisma.order.create({
    data: {
      businessId: business.id,
      customerId: customer1.id,
      measurementId: m1.id,
      assignedTailorId: tailorEmp.id,
      dressType: 'Three-Piece Suit',
      fabricDetails: 'Navy Blue Italian Wool',
      quantity: 1,
      price: 850.0,
      advanceAmount: 400.0,
      remainingAmount: 450.0,
      status: OrderStatus.DELIVERED,
      deliveryDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Delivered 3 days ago
      notes: 'Double-breasted jacket, slim fit trousers.',
    },
  });

  // Order 2: Active / Stitching
  const order2 = await prisma.order.create({
    data: {
      businessId: business.id,
      customerId: customer2.id,
      measurementId: m2.id,
      assignedTailorId: assistantTailorEmp.id,
      dressType: 'Evening Gown',
      fabricDetails: 'Red Silk Satin',
      quantity: 1,
      price: 600.0,
      advanceAmount: 200.0,
      remainingAmount: 400.0,
      status: OrderStatus.STITCHING,
      deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Due in 5 days
      notes: 'Floor length with matching belt.',
    },
  });

  // Order 3: Active / Delayed
  const order3 = await prisma.order.create({
    data: {
      businessId: business.id,
      customerId: customer1.id,
      measurementId: m1.id,
      assignedTailorId: tailorEmp.id,
      dressType: 'Oxford Cotton Shirt',
      fabricDetails: 'White Egyptian Cotton',
      quantity: 2,
      price: 150.0,
      advanceAmount: 300.0, // Fully paid
      remainingAmount: 0.0,
      status: OrderStatus.CUTTING,
      deliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Due 2 days ago (Delayed!)
    },
  });
  console.log('📦 Seeded Orders');

  // 9. Order Timelines
  // Order 1 Timeline
  await prisma.orderTimeline.createMany({
    data: [
      { orderId: order1.id, previousStatus: null, newStatus: OrderStatus.PENDING, updatedBy: adminUser.id, createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { orderId: order1.id, previousStatus: OrderStatus.PENDING, newStatus: OrderStatus.MEASURING, updatedBy: recepUser.id, createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) },
      { orderId: order1.id, previousStatus: OrderStatus.MEASURING, newStatus: OrderStatus.CUTTING, updatedBy: tailorUser.id, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { orderId: order1.id, previousStatus: OrderStatus.CUTTING, newStatus: OrderStatus.STITCHING, updatedBy: tailorUser.id, createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
      { orderId: order1.id, previousStatus: OrderStatus.STITCHING, newStatus: OrderStatus.QUALITY_CHECK, updatedBy: managerUser.id, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      { orderId: order1.id, previousStatus: OrderStatus.QUALITY_CHECK, newStatus: OrderStatus.READY, updatedBy: managerUser.id, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      { orderId: order1.id, previousStatus: OrderStatus.READY, newStatus: OrderStatus.DELIVERED, updatedBy: cashierUser.id, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    ],
  });

  // Order 2 Timeline
  await prisma.orderTimeline.createMany({
    data: [
      { orderId: order2.id, previousStatus: null, newStatus: OrderStatus.PENDING, updatedBy: recepUser.id, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { orderId: order2.id, previousStatus: OrderStatus.PENDING, newStatus: OrderStatus.STITCHING, updatedBy: managerUser.id, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ],
  });
  console.log('⏰ Seeded Order Timelines history log');

  // 10. Seed Payments
  // Order 1: Advance of 400 + Final of 450
  await prisma.payment.createMany({
    data: [
      { orderId: order1.id, amount: 400.0, paymentMethod: PaymentMethod.CASH, notes: 'Advance Deposit', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { orderId: order1.id, amount: 450.0, paymentMethod: PaymentMethod.CARD, notes: 'Final settlement on delivery', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    ],
  });

  // Order 2: Advance of 200
  await prisma.payment.create({
    data: {
      orderId: order2.id,
      amount: 200.0,
      paymentMethod: PaymentMethod.EASYPAISA,
      transactionReference: 'EP-9988123',
      notes: 'Mobile money transfer',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // Order 3: Full Payment of 300
  await prisma.payment.create({
    data: {
      orderId: order3.id,
      amount: 300.0,
      paymentMethod: PaymentMethod.BANK,
      transactionReference: 'TXN-BK-9188',
      notes: 'Bank deposit payment',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  });
  console.log('💳 Seeded Payment logs');

  // 11. Seed Notifications
  await prisma.notification.createMany({
    data: [
      { userId: adminUser.id, title: 'New Order Received', message: 'Order for Three-Piece Suit has been submitted.', isRead: true },
      { userId: adminUser.id, title: 'Order Delayed Alert', message: 'Oxford Cotton Shirt order is past its delivery date.', isRead: false },
      { userId: tailorUser.id, title: 'New Job Assigned', message: 'You have been assigned to construct a Three-Piece Suit.', isRead: false },
    ],
  });
  console.log('🔔 Seeded Notifications alert messages');

  console.log('🏁 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Seed file end
