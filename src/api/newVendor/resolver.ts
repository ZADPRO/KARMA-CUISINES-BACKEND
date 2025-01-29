import { NewVendorRepository } from "./newVendor-repository";

export class NewVendorResolver {
  public NewVendorRepository: any;
  constructor() {
    this.NewVendorRepository = new NewVendorRepository();
  }
  public async addNewVendorV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.NewVendorRepository.addNewVendorV1(user_data, token_data, domain_code);
  }
  public async viewProfileV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.NewVendorRepository.viewProfileV1(user_data, token_data, domain_code);
  }
  public async updateProfileV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.NewVendorRepository.updateProfileV1(user_data, token_data, domain_code);
  }
}