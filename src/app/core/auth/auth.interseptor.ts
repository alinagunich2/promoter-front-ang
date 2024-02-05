import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, finalize, switchMap, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { DefaultResponseType } from "src/types/default-response.type";
import { LoginResponseType } from "src/types/login-response.type";
import { Router } from "@angular/router";
// import { LoaderService } from "src/app/shared/services/loager.service";

@Injectable()
export class AuthInterseptor implements HttpInterceptor{

    constructor(private authService:AuthService,
        private router:Router,
        // private loaderService:LoaderService
        ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // this.loaderService.show()

       const tokens = this.authService.getTokens()
       if(tokens&&tokens.accessToken){
        const authReg = req.clone({
            headers:req.headers.set('x-auth', tokens.accessToken)
        })
        return next.handle(authReg)
        .pipe(
            catchError((error)=>{
                if(error.status ===401&&!authReg.url.includes('/login')&&!authReg.url.includes('/refresh')){
                    this.handle401Error(authReg,next)
                }
                return throwError(()=>error)
            }),
            finalize(()=>{
                // this.loaderService.hide()
            })
        )
       }

       return next.handle(req)
        .pipe(
            finalize(()=>{
                // this.loaderService.hide()
            })
        )
    }

    handle401Error(req:HttpRequest<any>,next:HttpHandler){
       return this.authService.refresh()
        .pipe(
            switchMap((result:DefaultResponseType|LoginResponseType)=>{
                let error=''

                if((result as DefaultResponseType).error!==undefined){
                    error=(result as DefaultResponseType).message
                }

                const refreshResult = result as LoginResponseType
                if(!refreshResult.accessToken||!refreshResult.refreshToken||!refreshResult.userId){
                    error='Ошибка  авторизации'
                }

                if(error){
                    return throwError(()=> new Error(error))
                }

                this.authService.setTokens(refreshResult.accessToken,refreshResult.refreshToken)
            
            
                const authReg = req.clone({
                    headers:req.headers.set('x-auth', refreshResult.accessToken)
                })

                return next.handle(authReg)
            
            }),

            catchError(error=>{
                this.authService.removeTokens()
                this.router.navigate(['/'])
                return throwError(()=>error)
            })
        )
    }
}