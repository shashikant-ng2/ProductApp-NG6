export class Categories {
  CategoryId: number;
  Name: string;
}
export class Products {
  Url: string;
  Categories: Array<Categories>;
  ProductId: number;
  Name: string;
  Description: string;
}

export class CreateProductModel {
  Name: string;
  Description: string;
  Url: string;
  CategoryIds: Array<number>
}

