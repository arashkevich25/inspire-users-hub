import { Controller, Get, Header, HttpStatus, Res } from '@nestjs/common';

@Controller('monitoring')
export class MonitoringController {
  @Get('check')
  @Header('Access-Control-Allow-Origin', '*')
  async checkHealth(@Res() res): Promise<any> {
    res
      .status(HttpStatus.OK)
      .json(`alive ${new Date().toLocaleString('pl-PL')}`);
  }
}
