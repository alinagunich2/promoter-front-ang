import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ActiveParamsType } from 'src/types/active-params.type';
import { ArticleCardType } from 'src/types/article-card.type';
import { ActiveParamsUtil } from 'src/app/shared/utils/active-params.util';
import { debounceTime } from 'rxjs';
import { ArticleCategory } from 'src/types/article-categories.type';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit{

  articles:ArticleCardType[]=[];
  pages:number[] = []
  activeParams:ActiveParamsType={categories:[]}
  appliedFilters:any=[]
  sortingOpen = false
  categoriesArticles:ArticleCategory[]=[]
  statusSidebar:number=1



  constructor(private articleService:ArticleService,
    private router:Router,
    private activatedRoute:ActivatedRoute,){}

  ngOnInit(): void {

    this.activatedRoute.queryParams
    .pipe(
      debounceTime(500)
    )
    .subscribe(params=>{

      const activeParams:ActiveParamsType = {categories:[]}
      if(params.hasOwnProperty("categories")){
        activeParams.categories=Array.isArray(params['categories']) ? params['categories'] : [params['categories']]
      }
      if(params.hasOwnProperty("page")){
        this.activeParams.page=+params['page']
      }else{
        this.activeParams.page=1
      }
    


     
      this.articleService.getArticles(params)
      .subscribe(data=>{
        
        this.pages = []
        for(let i = 1; i<=data.pages;i++){
          this.pages.push(i)
        }
  
        this.articles = data.items
        this.statusSidebar = data.pages
    
      })
    })

      this.articleService.getCategoriesArticles()
      .subscribe(data=>{
        this.categoriesArticles = data
        
      })   
  }





  
  toggleSorting(){
    this.sortingOpen=!this.sortingOpen
  }
  openPage(page:number):void{
    this.activeParams.page=page

    this.router.navigate(['/blog'],{
      queryParams:this.activeParams
    })
    
  }
  
  openPrevPage(){
    if(this.activeParams.page&&this.activeParams.page>1){
      this.activeParams.page--
      this.router.navigate(['/blog'],{
      queryParams:this.activeParams
    })
    }
  }
  openNextPage(){
    if(this.activeParams.page&&this.activeParams.page<this.pages.length){
      this.activeParams.page++
      this.router.navigate(['/blog'],{
      queryParams:this.activeParams
    })
    }
  }

  nameFilterCardArry:any = []

  updateFilterParam(urlStatus:[string, boolean,string]){
    let url = urlStatus[0]
    let statusFilterType =  urlStatus[1]
    let nameFilterCard = [urlStatus[2]]


    if(this.activeParams.categories){
      const existingTypeInParams = this.activeParams.categories.find(item=>item===url)
    
      if(existingTypeInParams && !statusFilterType){
        this.activeParams.categories=this.activeParams.categories.filter(item=>item !== url)
        
      }else{
        this.activeParams.categories=[...this.activeParams.categories,url]
      }
    }else if(statusFilterType){
      this.activeParams.categories = [url]


      // this.nameFilterCardArry.push({
      //   name:nameFilterCard,
      //   url:url
      // })

    }

    this.router.navigate(['/blog'],{
      queryParams:this.activeParams
    })

  }
}
