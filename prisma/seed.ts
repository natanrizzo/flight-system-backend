import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const prisma = new PrismaClient();

// Função para gerar assentos de uma aeronave
function generateSeats(seatCapacity: number, layout: string): string[] {
  const seats: string[] = [];
  const [leftSeats, rightSeats] = layout.split('-').map(Number);
  const seatsPerRow = leftSeats + rightSeats;
  const numRows = Math.ceil(seatCapacity / seatsPerRow);
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  for (let row = 1; row <= numRows; row++) {
    for (
      let i = 0;
      i < Math.min(seatsPerRow, seatCapacity - (row - 1) * seatsPerRow);
      i++
    ) {
      seats.push(`${row}${letters[i]}`);
    }
  }

  return seats.slice(0, seatCapacity);
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // ============================================
  // SEED DE AEROPORTOS BRASILEIROS
  // ============================================
  console.log('✈️  Criando aeroportos brasileiros...');

  const airports = await prisma.airport.createMany({
    data: [
      {
        code: 'GRU',
        name: 'Aeroporto Internacional de São Paulo',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
      },
      {
        code: 'CGH',
        name: 'Aeroporto de Congonhas',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
      },
      {
        code: 'LDB',
        name: 'Aeroporto de Londrina',
        city: 'Londrina',
        state: 'PR',
        country: 'Brasil',
      },
      {
        code: 'RIO',
        name: 'Aeroporto Internacional Tom Jobim',
        city: 'Rio de Janeiro',
        state: 'RJ',
        country: 'Brasil',
      },
      {
        code: 'MCP',
        name: 'Aeroporto de Minas Gerais',
        city: 'Confins',
        state: 'MG',
        country: 'Brasil',
      },
      {
        code: 'CWB',
        name: 'Aeroporto Afonso Pena',
        city: 'Curitiba',
        state: 'PR',
        country: 'Brasil',
      },
      {
        code: 'POA',
        name: 'Aeroporto de Porto Alegre',
        city: 'Porto Alegre',
        state: 'RS',
        country: 'Brasil',
      },
      {
        code: 'BSB',
        name: 'Aeroporto Internacional de Brasília',
        city: 'Brasília',
        state: 'DF',
        country: 'Brasil',
      },
      {
        code: 'SSA',
        name: 'Aeroporto de Salvador',
        city: 'Salvador',
        state: 'BA',
        country: 'Brasil',
      },
      {
        code: 'REC',
        name: 'Aeroporto de Recife',
        city: 'Recife',
        state: 'PE',
        country: 'Brasil',
      },
    ],
  });

  console.log(`✅ ${airports.count} aeroportos criados`);

  // ============================================
  // SEED DE TIPOS DE VOO
  // ============================================
  console.log('🛫 Criando tipos de voo...');

  const flightTypes = await prisma.flightType.createMany({
    data: [
      {
        code: 'DOM',
        description: 'Voo Doméstico',
      },
      {
        code: 'INT',
        description: 'Voo Internacional',
      },
    ],
  });

  console.log(`✅ ${flightTypes.count} tipos de voo criados`);

  // ============================================
  // SEED DE TIPOS DE AERONAVES
  // ============================================
  console.log('🛩️  Criando tipos de aeronaves...');

  const aircraftTypes = await prisma.aircraftType.createMany({
    data: [
      {
        model: 'Boeing 737',
        description: 'Aeronave de médio porte, bimotor',
        seatCapacity: 180,
        seatMap: {
          rows: 30,
          seatsPerRow: 6,
          layout: '3-3',
        },
      },
      {
        model: 'Airbus A320',
        description: 'Aeronave de médio porte, bimotor',
        seatCapacity: 194,
        seatMap: {
          rows: 32,
          seatsPerRow: 6,
          layout: '3-3',
        },
      },
      {
        model: 'Embraer E190',
        description: 'Aeronave regional, bimotor',
        seatCapacity: 124,
        seatMap: {
          rows: 20,
          seatsPerRow: 2,
          layout: '2-2',
        },
      },
    ],
  });

  console.log(`✅ ${aircraftTypes.count} tipos de aeronaves criados`);

  // ============================================
  // SEED DE AERONAVES
  // ============================================
  console.log('🚁 Criando aeronaves específicas...');

  const aircrafts = await prisma.aircraft.createMany({
    data: [
      {
        registrationNumber: 'PT-MVA',
        aircraftTypeId: 1,
      },
      {
        registrationNumber: 'PT-MVC',
        aircraftTypeId: 1,
      },
      {
        registrationNumber: 'PT-MVD',
        aircraftTypeId: 2,
      },
      {
        registrationNumber: 'PT-MVE',
        aircraftTypeId: 2,
      },
      {
        registrationNumber: 'PT-MVF',
        aircraftTypeId: 3,
      },
    ],
  });

  console.log(`✅ ${aircrafts.count} aeronaves criadas`);

  // ============================================
  // SEED DE FUNCIONÁRIOS
  // ============================================
  console.log('👨‍✈️ Criando funcionários...');

  const employees = await prisma.employee.createMany({
    data: [
      // Pilotos
      {
        fullName: 'Carlos Silva',
        dateOfBirth: new Date('1980-05-15'),
        mobilePhone: '11999887766',
        email: 'carlos.silva@airline.com',
        role: 'PILOT',
      },
      {
        fullName: 'Roberto Santos',
        dateOfBirth: new Date('1982-08-22'),
        mobilePhone: '11999887767',
        email: 'roberto.santos@airline.com',
        role: 'PILOT',
      },
      {
        fullName: 'Fernando Costa',
        dateOfBirth: new Date('1985-03-10'),
        mobilePhone: '11999887768',
        email: 'fernando.costa@airline.com',
        role: 'PILOT',
      },
      // Copilatos
      {
        fullName: 'João Oliveira',
        dateOfBirth: new Date('1990-06-18'),
        mobilePhone: '11999887769',
        email: 'joao.oliveira@airline.com',
        role: 'COPILOT',
      },
      {
        fullName: 'Paulo Gomes',
        dateOfBirth: new Date('1991-09-25'),
        mobilePhone: '11999887770',
        email: 'paulo.gomes@airline.com',
        role: 'COPILOT',
      },
      // Comissários de Bordo
      {
        fullName: 'Maria Santos',
        dateOfBirth: new Date('1992-01-30'),
        mobilePhone: '11999887771',
        email: 'maria.santos@airline.com',
        role: 'FLIGHT_ATTENDANT',
      },
      {
        fullName: 'Ana Paula',
        dateOfBirth: new Date('1993-04-12'),
        mobilePhone: '11999887772',
        email: 'ana.paula@airline.com',
        role: 'FLIGHT_ATTENDANT',
      },
      {
        fullName: 'Juliana Lima',
        dateOfBirth: new Date('1994-07-08'),
        mobilePhone: '11999887773',
        email: 'juliana.lima@airline.com',
        role: 'FLIGHT_ATTENDANT',
      },
      {
        fullName: 'Beatriz Ferreira',
        dateOfBirth: new Date('1995-11-14'),
        mobilePhone: '11999887774',
        email: 'beatriz.ferreira@airline.com',
        role: 'FLIGHT_ATTENDANT',
      },
      // Pessoal de Terra
      {
        fullName: 'Antonio Rodrigues',
        dateOfBirth: new Date('1975-02-28'),
        mobilePhone: '11999887775',
        email: 'antonio.rodrigues@airline.com',
        role: 'GROUND_STAFF',
      },
      {
        fullName: 'Daniel Martins',
        dateOfBirth: new Date('1978-10-05'),
        mobilePhone: '11999887776',
        email: 'daniel.martins@airline.com',
        role: 'GROUND_STAFF',
      },
    ],
  });

  console.log(`✅ ${employees.count} funcionários criados`);

  // ============================================
  // SEED DE VOOS PARA OUTUBRO DE 2025
  // ============================================
  console.log('📅 Criando voos para outubro de 2025...');

  const flightData = [
    // Semana 1
    {
      flightNumber: 'AA-001',
      departureDateTime: new Date('2025-10-01T08:00:00'),
      arrivalDateTime: new Date('2025-10-01T10:30:00'),
      estimatedDurationMinutes: 150,
      flightTypeId: 1, // Doméstico
      aircraftId: 1,
      originAirportId: 2, // CGH (São Paulo)
      destinationAirportId: 3, // LDB (Londrina)
    },
    {
      flightNumber: 'AA-002',
      departureDateTime: new Date('2025-10-01T14:00:00'),
      arrivalDateTime: new Date('2025-10-01T16:15:00'),
      estimatedDurationMinutes: 135,
      flightTypeId: 1,
      aircraftId: 2,
      originAirportId: 3, // LDB
      destinationAirportId: 2, // CGH
    },
    {
      flightNumber: 'AA-003',
      departureDateTime: new Date('2025-10-02T09:00:00'),
      arrivalDateTime: new Date('2025-10-02T13:45:00'),
      estimatedDurationMinutes: 285,
      flightTypeId: 1,
      aircraftId: 3,
      originAirportId: 1, // GRU
      destinationAirportId: 4, // RIO
    },
    {
      flightNumber: 'AA-004',
      departureDateTime: new Date('2025-10-02T15:30:00'),
      arrivalDateTime: new Date('2025-10-02T20:00:00'),
      estimatedDurationMinutes: 270,
      flightTypeId: 1,
      aircraftId: 4,
      originAirportId: 4, // RIO
      destinationAirportId: 1, // GRU
    },
    // Semana 2
    {
      flightNumber: 'AA-005',
      departureDateTime: new Date('2025-10-06T07:30:00'),
      arrivalDateTime: new Date('2025-10-06T09:45:00'),
      estimatedDurationMinutes: 135,
      flightTypeId: 1,
      aircraftId: 5,
      originAirportId: 2, // CGH
      destinationAirportId: 3, // LDB
    },
    {
      flightNumber: 'AA-006',
      departureDateTime: new Date('2025-10-06T11:00:00'),
      arrivalDateTime: new Date('2025-10-06T15:45:00'),
      estimatedDurationMinutes: 285,
      flightTypeId: 1,
      aircraftId: 1,
      originAirportId: 1, // GRU
      destinationAirportId: 5, // MCP (Confins)
    },
    {
      flightNumber: 'AA-007',
      departureDateTime: new Date('2025-10-07T08:15:00'),
      arrivalDateTime: new Date('2025-10-07T10:30:00'),
      estimatedDurationMinutes: 135,
      flightTypeId: 1,
      aircraftId: 2,
      originAirportId: 3, // LDB
      destinationAirportId: 6, // CWB (Curitiba)
    },
    {
      flightNumber: 'AA-008',
      departureDateTime: new Date('2025-10-07T13:00:00'),
      arrivalDateTime: new Date('2025-10-07T17:30:00'),
      estimatedDurationMinutes: 270,
      flightTypeId: 1,
      aircraftId: 3,
      originAirportId: 4, // RIO
      destinationAirportId: 7, // POA (Porto Alegre)
    },
    // Semana 3
    {
      flightNumber: 'AA-009',
      departureDateTime: new Date('2025-10-13T06:45:00'),
      arrivalDateTime: new Date('2025-10-13T10:15:00'),
      estimatedDurationMinutes: 210,
      flightTypeId: 1,
      aircraftId: 4,
      originAirportId: 2, // CGH
      destinationAirportId: 8, // BSB (Brasília)
    },
    {
      flightNumber: 'AA-010',
      departureDateTime: new Date('2025-10-13T12:30:00'),
      arrivalDateTime: new Date('2025-10-13T14:45:00'),
      estimatedDurationMinutes: 135,
      flightTypeId: 1,
      aircraftId: 5,
      originAirportId: 1, // GRU
      destinationAirportId: 3, // LDB
    },
    {
      flightNumber: 'AA-011',
      departureDateTime: new Date('2025-10-14T09:00:00'),
      arrivalDateTime: new Date('2025-10-14T13:30:00'),
      estimatedDurationMinutes: 270,
      flightTypeId: 1,
      aircraftId: 1,
      originAirportId: 5, // MCP
      destinationAirportId: 4, // RIO
    },
    {
      flightNumber: 'AA-012',
      departureDateTime: new Date('2025-10-14T15:15:00'),
      arrivalDateTime: new Date('2025-10-14T19:45:00'),
      estimatedDurationMinutes: 270,
      flightTypeId: 1,
      aircraftId: 2,
      originAirportId: 6, // CWB
      destinationAirportId: 1, // GRU
    },
    // Semana 4
    {
      flightNumber: 'AA-013',
      departureDateTime: new Date('2025-10-20T08:00:00'),
      arrivalDateTime: new Date('2025-10-20T12:30:00'),
      estimatedDurationMinutes: 270,
      flightTypeId: 1,
      aircraftId: 3,
      originAirportId: 2, // CGH
      destinationAirportId: 9, // SSA (Salvador)
    },
    {
      flightNumber: 'AA-014',
      departureDateTime: new Date('2025-10-20T14:00:00'),
      arrivalDateTime: new Date('2025-10-20T18:45:00'),
      estimatedDurationMinutes: 285,
      flightTypeId: 1,
      aircraftId: 4,
      originAirportId: 1, // GRU
      destinationAirportId: 10, // REC (Recife)
    },
    {
      flightNumber: 'AA-015',
      departureDateTime: new Date('2025-10-21T07:30:00'),
      arrivalDateTime: new Date('2025-10-21T09:45:00'),
      estimatedDurationMinutes: 135,
      flightTypeId: 1,
      aircraftId: 5,
      originAirportId: 3, // LDB
      destinationAirportId: 2, // CGH
    },
    {
      flightNumber: 'AA-016',
      departureDateTime: new Date('2025-10-21T11:00:00'),
      arrivalDateTime: new Date('2025-10-21T15:30:00'),
      estimatedDurationMinutes: 270,
      flightTypeId: 1,
      aircraftId: 1,
      originAirportId: 7, // POA
      destinationAirportId: 1, // GRU
    },
    // Semana 5
    {
      flightNumber: 'AA-017',
      departureDateTime: new Date('2025-10-27T09:00:00'),
      arrivalDateTime: new Date('2025-10-27T11:15:00'),
      estimatedDurationMinutes: 135,
      flightTypeId: 1,
      aircraftId: 2,
      originAirportId: 2, // CGH
      destinationAirportId: 3, // LDB
    },
    {
      flightNumber: 'AA-018',
      departureDateTime: new Date('2025-10-27T13:30:00'),
      arrivalDateTime: new Date('2025-10-27T18:15:00'),
      estimatedDurationMinutes: 285,
      flightTypeId: 1,
      aircraftId: 3,
      originAirportId: 1, // GRU
      destinationAirportId: 4, // RIO
    },
    {
      flightNumber: 'AA-019',
      departureDateTime: new Date('2025-10-28T08:15:00'),
      arrivalDateTime: new Date('2025-10-28T10:30:00'),
      estimatedDurationMinutes: 135,
      flightTypeId: 1,
      aircraftId: 4,
      originAirportId: 8, // BSB
      destinationAirportId: 2, // CGH
    },
    {
      flightNumber: 'AA-020',
      departureDateTime: new Date('2025-10-28T15:00:00'),
      arrivalDateTime: new Date('2025-10-28T17:30:00'),
      estimatedDurationMinutes: 150,
      flightTypeId: 1,
      aircraftId: 5,
      originAirportId: 5, // MCP
      destinationAirportId: 3, // LDB
    },
  ];

  let flightCount = 0;
  let crewAssignmentCount = 0;
  let seatCount = 0;

  // Criar voos e atribuir crew
  for (const flight of flightData) {
    const createdFlight = await prisma.flight.create({
      data: flight,
    });
    flightCount++;

    // Atribuir crew aleatório para cada voo
    // Mínimo 1 piloto, 1 copiloto, 2 comissários
    const pilotIds = [1, 2, 3]; // IDs dos pilotos
    const copilotIds = [4, 5]; // IDs dos copilatos
    const attendantIds = [6, 7, 8, 9]; // IDs dos comissários

    const selectedPilot = pilotIds[Math.floor(Math.random() * pilotIds.length)];
    const selectedCopilot =
      copilotIds[Math.floor(Math.random() * copilotIds.length)];
    const selectedAttendants = attendantIds
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    // Criar atribuições de crew
    await prisma.flightCrew.create({
      data: {
        flightId: createdFlight.id,
        employeeId: selectedPilot,
      },
    });
    crewAssignmentCount++;

    await prisma.flightCrew.create({
      data: {
        flightId: createdFlight.id,
        employeeId: selectedCopilot,
      },
    });
    crewAssignmentCount++;

    for (const attendantId of selectedAttendants) {
      await prisma.flightCrew.create({
        data: {
          flightId: createdFlight.id,
          employeeId: attendantId,
        },
      });
      crewAssignmentCount++;
    }

    // Buscar a aeronave para gerar assentos baseado na capacidade
    const aircraft = await prisma.aircraft.findUnique({
      where: { id: createdFlight.aircraftId },
      include: { aircraftType: true },
    });

    if (aircraft) {
      const seatMap = aircraft.aircraftType.seatMap as { layout: string };
      const seats = generateSeats(
        aircraft.aircraftType.seatCapacity,
        seatMap.layout,
      );

      // Criar assentos no banco de dados
      const seatsData = seats.map((seatNumber) => ({
        flightId: createdFlight.id,
        seatNumber,
        isAvailable: true,
      }));

      await prisma.seat.createMany({
        data: seatsData,
      });

      seatCount += seats.length;

      // Log dos assentos criados para este voo
      console.log(
        `  ↳ Voo ${createdFlight.flightNumber}: ${seats.length} assentos criados no banco`,
      );
    }
  }

  console.log(`✅ ${flightCount} voos criados`);
  console.log(`✅ ${crewAssignmentCount} atribuições de crew criadas`);
  console.log(`✅ ${seatCount} assentos criados no banco de dados`);

  // ============================================
  // RESUMO DO SEED
  // ============================================
  console.log('\n🎉 Seed concluído com sucesso!');
  console.log(`
  📊 Resumo:
  - ${airports.count} aeroportos adicionados
  - ${flightTypes.count} tipos de voo adicionados
  - ${aircraftTypes.count} tipos de aeronaves adicionados
  - ${aircrafts.count} aeronaves adicionadas
  - ${employees.count} funcionários adicionados
  - ${flightCount} voos adicionados para outubro de 2025
  - ${crewAssignmentCount} membros de crew atribuídos aos voos
  - ${seatCount} assentos criados em todos os voos
  `);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
