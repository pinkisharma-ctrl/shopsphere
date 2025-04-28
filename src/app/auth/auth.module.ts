import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';  // Import the routing module

@NgModule({
  imports: [CommonModule, AuthRoutingModule],  // No declarations array needed for standalone components
})
export class AuthModule {}
