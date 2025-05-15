import { ComponentFixture, TestBed } from '@angular/core/testing';
import { productDetailPage } from './product-detail.page';

describe('productDetailPage', () => {
  let component: productDetailPage;
  let fixture: ComponentFixture<productDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(productDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
