import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./componentes/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registrarse',
    loadChildren: () => import('./componentes/registrarse/registrarse.module').then( m => m.RegistrarsePageModule)
  },
  {
    path: 'explorar',
    loadChildren: () => import('./componentes/explorar/explorar.module').then( m => m.ExplorarPageModule)
  },
  {
    path: 'pescarhistorias',
    loadChildren: () => import('./componentes/pescarhistorias/pescarhistorias.module').then( m => m.PescarhistoriasPageModule)
  },
  {
    path: 'crearhistoria',
    loadChildren: () => import('./componentes/crearhistoria/crearhistoria.module').then( m => m.CrearhistoriaPageModule)
  },
  {
    path: 'mishistorias',
    loadChildren: () => import('./componentes/mishistorias/mishistorias.module').then( m => m.MishistoriasPageModule)
  },
  {
    path: 'realidadaumentada',
    loadChildren: () => import('./componentes/realidadaumentada/realidadaumentada.module').then( m => m.RealidadaumentadaPageModule)
  },
  {
    path: 'verhistoria',
    loadChildren: () => import('./componentes/verhistoria/verhistoria.module').then( m => m.VerhistoriaPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./componentes/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'editarusuario',
    loadChildren: () => import('./componentes/editarusuario/editarusuario.module').then( m => m.EditarusuarioPageModule)
  },
  {
    path: 'listahistorias',
    loadChildren: () => import('./componentes/listahistorias/listahistorias.module').then( m => m.ListahistoriasPageModule)
  },
  {
    path: 'subirhistoria',
    loadChildren: () => import('./componentes/subirhistoria/subirhistoria.module').then( m => m.SubirhistoriaPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./componentes/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'loginpass',
    loadChildren: () => import('./componentes/loginpass/loginpass.module').then( m => m.LoginpassPageModule)
  },
  {
    path: 'verfotos',
    loadChildren: () => import('./componentes/verfotos/verfotos.module').then( m => m.VerfotosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
