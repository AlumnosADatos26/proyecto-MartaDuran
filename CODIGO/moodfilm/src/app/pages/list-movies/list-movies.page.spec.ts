import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListMoviesPage } from './list-movies.page';

describe('ListMoviesPage', () => {
  let component: ListMoviesPage;
  let fixture: ComponentFixture<ListMoviesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMoviesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
