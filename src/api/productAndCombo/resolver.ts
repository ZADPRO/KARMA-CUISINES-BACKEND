import { ProductsComboRepository } from "./productComboRepository";

export class ProductsComboResolver {
  public ProductComboRepository: any;
  constructor() {
    this.ProductComboRepository = new ProductsComboRepository();
  }
  public async addCategoryV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductComboRepository.addCategoryV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async getCategoryV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductComboRepository.getCategoryV1(
      user_data,
      token_data,
      domain_code
    );
  }

}
