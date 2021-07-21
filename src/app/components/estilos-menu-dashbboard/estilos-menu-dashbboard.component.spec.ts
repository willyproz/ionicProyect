import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstilosMenuDashbboardComponent } from './estilos-menu-dashbboard.component';

describe('EstilosMenuDashbboardComponent', () => {
  let component: EstilosMenuDashbboardComponent;
  let fixture: ComponentFixture<EstilosMenuDashbboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstilosMenuDashbboardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstilosMenuDashbboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
