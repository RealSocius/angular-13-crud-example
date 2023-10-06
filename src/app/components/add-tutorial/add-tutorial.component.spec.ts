import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTutorialComponent } from './add-tutorial.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TutorialService } from 'src/app/services/tutorial.service';
import { of, throwError } from 'rxjs';

describe('AddTutorialComponent', () => {
  let component: AddTutorialComponent;
  let fixture: ComponentFixture<AddTutorialComponent>;
  let tutorialService: jasmine.SpyObj<TutorialService>;

  beforeEach(async () => {
    tutorialService = jasmine.createSpyObj('TutorialService', ['create']);

    await TestBed.configureTestingModule({
      declarations: [AddTutorialComponent],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: TutorialService, useValue: tutorialService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a tutorial', () => {
    tutorialService.create.and.returnValue(
      of({
        id: '1337',
        title: 'Test Title',
        description: 'Test Description',
        published: true,
      })
    );

    component.tutorial = {
      title: 'Test Title',
      description: 'Test Description',
      published: true,
    };

    component.saveTutorial();

    expect(component.submitted).toBeTrue();
    expect(tutorialService.create).toHaveBeenCalledWith({
      title: 'Test Title',
      description: 'Test Description',
      published: true,
    });
  });

  it('should log an error if creating a tutorial fails', () => {
    tutorialService.create.and.returnValue(
      throwError(() => new Error('saving tutorial failed'))
    );

    spyOn(console, 'error');

    component.saveTutorial();

    expect(component.submitted).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  });

  it('should reset the tutorial object and submitted flag when newTutorial() is called', () => {
    component.tutorial = {
      title: 'Test Title',
      description: 'Test Description',
      published: true,
    };
    component.submitted = true;

    component.newTutorial();

    expect(component.tutorial).toEqual({
      title: '',
      description: '',
      published: false,
    });
    expect(component.submitted).toBeFalse();
  });
});
