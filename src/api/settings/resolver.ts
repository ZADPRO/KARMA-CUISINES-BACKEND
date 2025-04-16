import { SettingsPageRepo } from "./settings-repo";

export class SettingsResolver {
  public ProductRepository: any;
  constructor() {
    this.ProductRepository = new SettingsPageRepo();
  }
  public async AddFoodCategoryV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductRepository.AddSubFoodCategory(
      user_data,
      token_data
    );
  }

  public async GetFoodCategoryV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ProductRepository.GetFoodCategory(
      user_data,
      token_data,
      domain_code
    );
  }
}
