import { VendorRepository } from "./vendor-repository";

export class VendorResolver {
  public VendorRepository: any;
  constructor() {
    this.VendorRepository = new VendorRepository();
  }
  public async VendorProfileV1(user_data: any, token_data: any): Promise<any> {
    return await this.VendorRepository.VendorProfileV1(user_data, token_data);
  }
  public async VendorprofilePageDataV1(user_data: any, token_data: any): Promise<any> {
    console.log('user_data', user_data)
    return await this.VendorRepository.VendorprofilePageDataV1(user_data, token_data);
  }
  public async UpdateBasicDetailV1(user_data: any, token_data: any): Promise<any> {
    return await this.VendorRepository.UpdateBasicDetailV1(user_data, token_data);
  }
  public async VendorBankDetailsV1(user_data: any, domain_code: any): Promise<any> {
    return await this.VendorRepository.VendorBankDetailsV1(user_data, domain_code);
  }
  public async RestaurentDocUplaodV1(user_data: any, domain_code: any): Promise<any> {
    return await this.VendorRepository.RestaurentDocUplaodV1(user_data, domain_code);
    console.log('user_data', user_data)
  }
  public async RestaurentDocUpdateV1(user_data: any, domain_code: any): Promise<any> {
    return await this.VendorRepository.RestaurentDocUpdateV1(user_data, domain_code);
  }
  public async deleteRestaurentDocV1(user_data: any, domain_code: any): Promise<any> {
    return await this.VendorRepository.deleteRestaurentDocV1(user_data, domain_code);
  }
  public async LogoUploadV1(user_data: any, domain_code: any): Promise<any> {
    return await this.VendorRepository.LogoUploadV1(user_data, domain_code);
  }
  public async LogoUpdateV1(user_data: any, domain_code: any): Promise<any> {
    return await this.VendorRepository.LogoUpdateV1(user_data, domain_code);
  }
  public async deleteLogoV1(user_data: any, domain_code: any): Promise<any> {
    return await this.VendorRepository.deleteLogoV1(user_data, domain_code);
  }

}