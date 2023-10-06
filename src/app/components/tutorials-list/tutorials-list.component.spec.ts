import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialsListComponent } from './tutorials-list.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TutorialService } from 'src/app/services/tutorial.service';
import { of, throwError } from 'rxjs';

describe('TutorialsListComponent', () => {
  let component: TutorialsListComponent;
  let fixture: ComponentFixture<TutorialsListComponent>;
  let tutorialService: jasmine.SpyObj<TutorialService>;

  beforeEach(async () => {
    tutorialService = jasmine.createSpyObj('TutorialService', [
      'getAll',
      'deleteAll',
      'findByTitle',
    ]);

    await TestBed.configureTestingModule({
      declarations: [TutorialsListComponent],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: TutorialService, useValue: tutorialService },
      ],
    }).compileComponents();

    tutorialService.getAll.and.returnValue(
      of([
        {
          id: '1',
          title: 'Tutorial 1',
          description: 'This is tutorial 1.',
          published: false,
        },
        {
          id: '2',
          title: 'Tutorial 2',
          description: 'This is tutorial 2.',
          published: true,
        },
      ])
    );
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log an error if retrieving tutorials fails', () => {
    tutorialService.getAll.and.returnValue(
      throwError(() => new Error('retrieving tutorials failed'))
    );
    spyOn(console, 'error');

    component.ngOnInit();

    expect(component).toBeTruthy();
    expect(tutorialService.getAll).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('should refresh list', () => {
    component.refreshList();

    expect(component.currentTutorial).toEqual({});
    expect(component.currentIndex).toEqual(-1);
  });

  it('should set active tutorial', () => {
    const mockTutorial = {
      id: '1',
      title: 'Tutorial 1',
      description: 'This is tutorial 1.',
      published: false,
    };

    component.setActiveTutorial(mockTutorial, 0);

    expect(component.currentTutorial).toEqual(mockTutorial);
    expect(component.currentIndex).toEqual(0);
  });

  it('should remove all tutorials', () => {
    tutorialService.deleteAll.and.returnValue(of({}));

    spyOn(component, 'retrieveTutorials');

    component.removeAllTutorials();

    expect(tutorialService.deleteAll).toHaveBeenCalled();
    expect(component.retrieveTutorials).toHaveBeenCalled();
  });

  it('should log an error if remove all tutorials throws an error', () => {
    tutorialService.deleteAll.and.returnValue(
      throwError(() => new Error('Error'))
    );

    spyOn(console, 'error');

    component.removeAllTutorials();

    expect(tutorialService.deleteAll).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('should search by title', () => {
    const mockTutorials = [
      {
        id: '1',
        title: 'Tutorial 1',
        description: 'This is tutorial 1.',
        published: false,
      },
    ];

    tutorialService.findByTitle.and.returnValue(of(mockTutorials));

    spyOn(console, 'log');

    component.title = 'Tutorial 1';
    component.searchTitle();

    expect(tutorialService.findByTitle).toHaveBeenCalledWith('Tutorial 1');
    expect(component.tutorials).toEqual(mockTutorials);
    expect(console.log).toHaveBeenCalledWith(mockTutorials);
  });

  it('should log an error if search by title fails', () => {
    const mockTutorials = [
      {
        id: '1',
        title: 'Tutorial 1',
        description: 'This is tutorial 1.',
        published: false,
      },
    ];

    tutorialService.findByTitle.and.returnValue(
      throwError(() => new Error('Error'))
    );

    spyOn(console, 'error');

    component.title = 'Tutorial 1';
    component.searchTitle();

    expect(tutorialService.findByTitle).toHaveBeenCalledWith('Tutorial 1');
    expect(console.error).toHaveBeenCalled();
  });
});
