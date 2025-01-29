import { VendorRepository } from "./vendor-repository";

export class VendorResolver {
  public VendorRepository: any;
  constructor() {
    this.VendorRepository = new VendorRepository();
  }
  public async VendorProfileV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    console.log('token_data', token_data)
    return await this.VendorRepository.VendorProfileV1(user_data, token_data, domain_code);
  }
  public async VendorprofilePageDataV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    console.log('user_data', user_data)
    return await this.VendorRepository.VendorprofilePageDataV1(user_data, token_data, domain_code);
  }
  public async UpdateBasicDetailV1(user_data: any, token_data: any, domain_code: any): Promise<any> {
    return await this.VendorRepository.UpdateBasicDetailV1(user_data, token_data, domain_code);
  }
  public async VendorBankDetailsV1(user_data: any,token_data:any, domain_code: any,): Promise<any> {
    return await this.VendorRepository.VendorBankDetailsV1(user_data, token_data, domain_code);
  }
  public async RestaurentDocUplaodV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.VendorRepository.RestaurentDocUplaodV1(user_data, token_data, domain_code);
  }
  public async RestaurentDocUpdateV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.VendorRepository.RestaurentDocUpdateV1(user_data, token_data, domain_code);
  }
  public async deleteRestaurentDocV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.VendorRepository.deleteRestaurentDocV1(user_data, token_data, domain_code);
  }
  public async LogoUploadV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.VendorRepository.LogoUploadV1(user_data, token_data, domain_code);
  }
  public async LogoUpdateV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.VendorRepository.LogoUpdateV1(user_data, token_data, domain_code);
  }
  public async deleteLogoV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    console.log('token_data', token_data)
    return await this.VendorRepository.deleteLogoV1(user_data, token_data, domain_code);
  }
  public async addProductV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.VendorRepository.addProductV1(user_data, token_data, domain_code);
  }
  public async ViewaddedProductV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.VendorRepository.ViewaddedProductV1(user_data, token_data, domain_code);
  }
  public async offersAppliedV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.VendorRepository.offersAppliedV1(user_data, token_data, domain_code);
  }
  public async getOffersV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.VendorRepository.getOffersV1(user_data, token_data, domain_code);
  }
  public async getDocumentsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.VendorRepository.getDocumentsV1(user_data, token_data, domain_code);
  }
  public async addDocumentsV1(user_data: any, token_data: any, domain_code: any): Promise<any> {
    return await this.VendorRepository.addDocumentsV1(user_data, token_data, domain_code);
  }
  public async UpdateDocumentsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.VendorRepository.UpdateDocumentsV1(user_data, token_data, domain_code);
  }
  public async visibilityV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.VendorRepository.visibilityV1(user_data, token_data, domain_code);
  }
  public async getPayementV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.VendorRepository.getPayementV1(user_data, token_data, domain_code);
  }
  public async addPaymentV1(user_data: any, token_data: any, domain_code: any): Promise<any> {
    return await this.VendorRepository.addPaymentV1(user_data, token_data, domain_code);
  }
  public async UpdatePaymentV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.VendorRepository.UpdatePaymentV1(user_data, token_data, domain_code);
  }
  public async paymentVisibilityV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.VendorRepository.paymentVisibilityV1(user_data, token_data, domain_code);
  }
  public async VendorAuditListV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.VendorRepository.VendorAuditListV1(user_data,token_data, domain_code);
  }
}