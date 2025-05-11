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
  public async updateCategoryV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductComboRepository.updateCategoryV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async deleteCategoryV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductComboRepository.deleteCategoryV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async searchFoodV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductComboRepository.searchFoodV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async addFoodV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductComboRepository.addFoodV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async deleteFoodV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductComboRepository.deleteFoodV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async deleteComboV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductComboRepository.deleteComboV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async UpdateFoodV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductComboRepository.UpdateFoodV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async CreateComboV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductComboRepository.CreateComboV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async FoodImgV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductComboRepository.FoodImgV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async foodListV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductComboRepository.foodListV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async checkMenuIdV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductComboRepository.checkMenuIdV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async orderListV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductComboRepository.orderListV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async viewOrderDataV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductComboRepository.viewOrderDataV1(
      user_data,
      token_data,
      domain_code
    );
  }
}
