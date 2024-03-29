import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { JwtAuthGuard } from "src/core/auth/jwt.auth.guard";
import { DashboardService } from "src/services/dashboard.service";

@Controller("dashboard")
@ApiTags("dashboard")
@ApiBearerAuth("jwt")
export class DashboardController {
  constructor(private readonly dashboardServiceService: DashboardService) {}

  @Get("getVetAppointmentSummary")
  @ApiQuery({ name: "staffId", required: false })
  @ApiQuery({ name: "year", required: false })
  @UseGuards(JwtAuthGuard)
  async getVetAppointmentSummary(
    @Query("staffId") staffId = "",
    @Query("year") year = new Date().getFullYear()
  ) {
    const res: CustomResponse = {};
    try {
      // res.data =
      //   await this.dashboardServiceService.getVetYearlyAppointmentSummary(
      //     staffId,
      //     year
      //   );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getVetYearlyAppointmentGraph")
  @ApiQuery({ name: "staffId", required: false })
  @ApiQuery({ name: "appointmentStatusId", required: false })
  @ApiQuery({ name: "year", required: false })
  @UseGuards(JwtAuthGuard)
  async getVetYearlyClosedAppointmentGraph(
    @Query("staffId") staffId = "",
    @Query("appointmentStatusId") appointmentStatusId = "",
    @Query("year") year = new Date().getFullYear()
  ) {
    const res: CustomResponse = {};
    try {
      // res.data =
      //   await this.dashboardServiceService.getVetYearlyAppointmentGraph(
      //     staffId,
      //     appointmentStatusId,
      //     year
      //   );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getYearlyRevenue")
  @ApiQuery({ name: "year", required: false })
  @UseGuards(JwtAuthGuard)
  async getYearlyRevenue(@Query("year") year = new Date().getFullYear()) {
    const res: CustomResponse = {};
    try {
      // res.data = await this.dashboardServiceService.getYearlyRevenue(year);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getYearlyRevenueGraph")
  @ApiQuery({ name: "year", required: false })
  @UseGuards(JwtAuthGuard)
  async getYearlyRevenueGraph(@Query("year") year = new Date().getFullYear()) {
    const res: CustomResponse = {};
    try {
      // res.data = await this.dashboardServiceService.getYearlyRevenueGraph(year);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
