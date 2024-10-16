import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { PageProduct, Product } from '../model/product.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  currentPage : number=0;
  pageSize : number=5;
  totalPages : number=0;
  errorMessage: string = '';

  searchFormGroup! : FormGroup;
  currentAction : string="all";

  constructor(private productService: ProductService,private fb : FormBuilder,
    public authService : AuthenticationService ,private router:Router
  ) { }

  ngOnInit(): void {
 this.searchFormGroup=this.fb.group({
  keyword : this.fb.control(null)
 });
    this.handleGetPageProducts();
  }

  handleGetPageProducts(): void {
    this.productService.getPageProducts(this.currentPage,this.pageSize).subscribe({
      next: (data: PageProduct) => {
        this.products = data.products;
        this.totalPages=data.totalPages;
        console.log(this.totalPages);
      },
      error: (err: any) => {
        this.errorMessage = err?.message || 'An error occurred';
      }
    });
  }
  handleGetAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (err: any) => {
        this.errorMessage = err?.message || 'An error occurred';
      }
    });
  }

  handleDeleteProduct(p: Product){
    let conf=confirm("Are you sure !");
    if(conf ==false) return;
    this.productService.deleteProduct(p.id).subscribe({
      next: (data: boolean) => {
        //this.handleGetAllProducts();
        let index=this.products.indexOf(p);
        this.products.splice(index, 0);
      }
    });
  }
  handleSetPromotion(p: Product){
    let promo=p.promotion;
    this.productService.setPromotion(p.id).subscribe({
      next: (data: boolean) => {
        p.promotion = !promo ; // Toggle promotion locally on success
      },
      error: (err: any) => {
        this.errorMessage = err;
      }
    })
  }
  handleSearchProducts(): void {
    this.currentAction = "search";
    this.currentPage = 0; // Reset to the first page for new search
    let keyword = this.searchFormGroup.value.keyword;
    this.productService.searchProduct(keyword, this.currentPage, this.pageSize).subscribe({
      next: (data: PageProduct) => {
        this.products = data.products;
        this.totalPages = data.totalPages; // Update totalPages based on search results
      }
    });
  }

  gotoPage(i: number): void {
    this.currentPage = i;
    if (this.currentAction === "all") {
      this.handleGetPageProducts();
    } else {
      let keyword = this.searchFormGroup.value.keyword;
      this.productService.searchProduct(keyword, this.currentPage, this.pageSize).subscribe({
        next: (data: PageProduct) => {
          this.products = data.products;
          this.totalPages = data.totalPages; // Update totalPages based on search results
        }
      });
    }
  }
  handleNewProduct(){
    this.router.navigateByUrl("/admin/newProduct");
  }
  handleEditProduct(p:Product){
 this.router.navigateByUrl("/admin/editProduct/"+p.id);
  }
  }
