import { PrinterRepository } from "./printer-repo";

export class PrinterResolver {
  public PrinterRepo: any;
  constructor() {
    this.PrinterRepo = new PrinterRepository();
  }

  public async viewRestroAssign(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.PrinterRepo.viewRestroAssign(
      user_data,
      token_data,
      domain_code
    );
  }
}
