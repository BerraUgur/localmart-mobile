import { ComponentFixture, TestBed } from '@angular/core/testing';
import { productsPage } from './products.page';

describe('productsPage', () => {
  let component: productsPage;
  let fixture: ComponentFixture<productsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(productsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
