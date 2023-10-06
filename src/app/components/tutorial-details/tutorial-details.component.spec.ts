import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialDetailsComponent } from './tutorial-details.component';
import { TutorialService } from 'src/app/services/tutorial.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

describe('TutorialDetailsComponent', () => {
  let component: TutorialDetailsComponent;
  let fixture: ComponentFixture<TutorialDetailsComponent>;
  let tutorialService: jasmine.SpyObj<TutorialService>;
  let router: jasmine.SpyObj<Router>;
  const mockTutorial = {
    id: '1',
    title: 'Tutorial 1',
    description: 'This is tutorial 1.',
    published: false,
  };

  beforeEach(async () => {
    tutorialService = jasmine.createSpyObj('TutorialService', [
      'get',
      'update',
      'delete',
    ]);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [TutorialDetailsComponent],
      providers: [
        { provide: TutorialService, useValue: tutorialService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                id: '1',
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    tutorialService.get.and.returnValue(of(mockTutorial));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get tutorial by id on init', () => {
    component.ngOnInit();

    expect(component.currentTutorial).toEqual(mockTutorial);
    expect(tutorialService.get).toHaveBeenCalledWith('1');
  });

  it('should throw an error if get tutorial by id fails', () => {
    tutorialService.get.and.returnValue(throwError(() => new Error('Error')));

    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalled();
    expect(tutorialService.get).toHaveBeenCalledWith('1');
  });

  it('should update tutorial published status', () => {
    tutorialService.update.and.returnValue(of(mockTutorial));

    expect(component.currentTutorial.published).toBe(false);

    component.ngOnInit();
    component.updatePublished(true);

    expect(component.currentTutorial.published).toBe(true);
  });

  it('should throw an error if update tutorial published status fails', () => {
    tutorialService.update.and.returnValue(
      throwError(() => new Error('Error'))
    );

    spyOn(console, 'error');

    component.ngOnInit();
    component.updatePublished(true);

    expect(console.error).toHaveBeenCalled();
    expect(tutorialService.get).toHaveBeenCalledWith('1');
  });

  it('should update tutorial', () => {
    tutorialService.update.and.returnValue(of(mockTutorial));

    component.ngOnInit();

    component.currentTutorial = Object.assign(component.currentTutorial, {
      description: 'This is tutorial 1 UPDATED.',
    });

    component.updateTutorial();

    expect(tutorialService.update).toHaveBeenCalledWith(
      '1',
      component.currentTutorial
    );
  });

  it('should throw an error if update tutorial fails', () => {
    tutorialService.update.and.returnValue(
      throwError(() => new Error('Error'))
    );

    spyOn(console, 'error');

    component.ngOnInit();

    component.currentTutorial = Object.assign(component.currentTutorial, {
      description: 'This is tutorial 1 UPDATED.',
    });

    component.updateTutorial();

    expect(tutorialService.update).toHaveBeenCalledWith(
      '1',
      component.currentTutorial
    );
    expect(console.error).toHaveBeenCalled();
  });

  it('should delete a tutorial', () => {
    tutorialService.delete.and.returnValue(of(mockTutorial));

    component.ngOnInit();
    component.deleteTutorial();

    expect(tutorialService.delete).toHaveBeenCalledWith('1');
    expect(router.navigate).toHaveBeenCalledWith(['/tutorials']);
  });

  it('should throw an error if delete tutorial fails', () => {
    tutorialService.delete.and.returnValue(
      throwError(() => new Error('Error'))
    );

    spyOn(console, 'error');

    component.ngOnInit();
    component.deleteTutorial();

    expect(tutorialService.delete).toHaveBeenCalledWith('1');
    expect(console.error).toHaveBeenCalled();
  });
});
