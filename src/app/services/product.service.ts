import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { PageProduct, Product } from '../model/product.model'; // Adjust import path if necessary
import { UUID } from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products! : Array<Product>;
  constructor(){
  this.products= [
    { id:UUID.UUID(), name: 'Computer', price: 4500, promotion: false },
    { id:UUID.UUID(), name: 'Printer', price: 5500, promotion: true },
    { id:UUID.UUID(), name: 'Smart phone', price: 2500, promotion: false }
  ];
  for(let i=0;i<10;i++){
    this.products.push({id:UUID.UUID(),name:"Computer",price: 6500,promotion:true});
    this.products.push({id:UUID.UUID(), name: 'Printer', price: 5500, promotion: true});
    this.products.push({id:UUID.UUID(), name: 'Smart phone', price: 2500, promotion: false});
  }
}

  public getAllProducts(): Observable<Product[]> {
    return of(this.products);
  }
  public getPageProducts(page : number,size:number): Observable<PageProduct>{
    let index=page*size;
  let totalPages=~~(this.products.length/size);
  if(this.products.length % size!=0) 
    totalPages++;
  let pageProducts=this.products.slice(index,index+size);
  return of({page: page, size: size, totalPages: totalPages, products: pageProducts});
  
} 

  deleteProduct(productId:string): Observable<boolean> {
    const index = this.products.findIndex(p => p.id == productId);
    if (index !== -1) {
      this.products.splice(index, 1);
      return of(true);
    } else {
      return throwError(() => new Error('Product not found'));
    }
  }

  setPromotion(productId:string): Observable<boolean> {
    const product = this.products.find(p => p.id == productId);
    if (product) {
      product.promotion = !product.promotion; // Toggle promotion status
      return of(true);
    } else {
      return throwError(() => new Error('Product not found'));
    }
  }
  public searchProduct(keyword : string,page:number,size:number) : Observable<PageProduct>{
    let result=this.products.filter(p=>p.name.includes(keyword));
    let index=page*size;
  let totalPages=~~(result.length/size);
  if(this.products.length % size!=0) 
    totalPages++;
  let pageProducts=result.slice(index,index+size);
    return of({page: page, size: size, totalPages: totalPages, products: pageProducts});
  }
   public addNewProduct(product:Product):Observable<Product>{
    product.id=UUID.UUID();
    this.products.push(product);
    return of(product);
   }
   public getProducts(id:string):Observable<Product>{
    let product= this.products.find(p=> p.id==id  );
    if(product ==undefined) return throwError(()=>new Error("Product not Found !! "));
    return of(product);
   }

   getErrorMesssag(fieldName:string,error:any) {
    if(error['required']) {
      return fieldName+"is required";
    } 
    else if(error['minlength']){
      return fieldName+" should have at least "+error['minlength']['requiredLength']+" Characters";
    }
    else if(error['min']){
      return fieldName+" should have min value "+error['min']['min']+" ";
    }

    else return "";

  }
  public updateProduct(product:Product):Observable<Product>{
    this.products=this.products.map(p=>(p.id==product.id)?product:p);
    return of(product);
  }
}
