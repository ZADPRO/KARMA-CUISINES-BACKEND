import { ProductsDetailsRepository } from "./products-update-repo";

export class ProductsResolver {
  public ProductRepository: any;
  constructor() {
    this.ProductRepository = new ProductsDetailsRepository();
  }
  public async ProductAddV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductRepository.ProductsAddRepo(
      user_data,
      token_data,
      domain_code
    );
  }
}
