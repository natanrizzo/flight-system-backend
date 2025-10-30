import { Module } from "@nestjs/common";
import { FlightService } from "./flight.service";
import { FlightController } from "./flight.controller";
import { AdminFlightController } from "./admin-flight.controller";

@Module({
    controllers: [FlightController, AdminFlightController],
    providers: [FlightService],
    exports: [FlightService]
})
export class FlightModule {}