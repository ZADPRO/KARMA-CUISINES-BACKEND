import { adminRepository } from "./admin-repository";

export class adminResolver {
  public adminRepository: any;
  constructor() {
    this.adminRepository = new adminRepository();
  }
  public async adminloginV1(user_data: any, token_data: any): Promise<any> {
    return await this.adminRepository.adminloginV1(user_data, token_data);
  }
}
