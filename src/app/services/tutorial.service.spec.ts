import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TutorialService } from './tutorial.service';

const baseUrl = 'http://localhost:8080/api/tutorials';

describe('Test TutorialService', () => {
  let service: TutorialService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TutorialService],
    });
    service = TestBed.inject(TutorialService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all tutorials from the API via GET', () => {
    const mockTutorials = [
      { id: 1, title: 'Tutorial 1', description: 'This is tutorial 1.' },
      { id: 2, title: 'Tutorial 2', description: 'This is tutorial 2.' },
      { id: 3, title: 'Tutorial 3', description: 'This is tutorial 3.' },
    ];

    service.getAll().subscribe((tutorials) => {
      expect(tutorials.length).toBe(3);
      expect(tutorials).toEqual(mockTutorials);
    });

    const request = httpMock.expectOne(`${baseUrl}`);
    expect(request.request.method).toBe('GET');
    request.flush(mockTutorials);
  });

  it('should retrieve a tutorial by id from the API via GET', () => {
    const mockTutorial = {
      id: 1,
      title: 'Tutorial 1',
      description: 'This is tutorial 1.',
    };

    service.get(1).subscribe((tutorial) => {
      expect(tutorial).toEqual(mockTutorial);
    });

    const request = httpMock.expectOne(`${baseUrl}/1`);
    expect(request.request.method).toBe('GET');
    request.flush(mockTutorial);
  });

  it('should create a new tutorial via POST', () => {
    const mockTutorial = {
      title: 'New Tutorial',
      description: 'This is a new tutorial.',
    };

    service.create(mockTutorial).subscribe((tutorial) => {
      expect(tutorial).toEqual(mockTutorial);
    });

    const request = httpMock.expectOne(`${baseUrl}`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(mockTutorial);
    request.flush(mockTutorial);
  });

  it('should update an existing tutorial via PUT', () => {
    const mockTutorial = {
      id: 1,
      title: 'Updated Tutorial',
      description: 'This is an updated tutorial.',
    };

    service.update(1, mockTutorial).subscribe((tutorial) => {
      expect(tutorial).toEqual(mockTutorial);
    });

    const request = httpMock.expectOne(`${baseUrl}/1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(mockTutorial);
    request.flush(mockTutorial);
  });

  it('should delete an existing tutorial via DELETE', () => {
    const mockTutorial = {
      id: 1,
      title: 'Tutorial 1',
      description: 'This is tutorial 1.',
    };

    service.delete(1).subscribe((tutorial) => {
      expect(tutorial).toEqual(mockTutorial);
    });

    const request = httpMock.expectOne(`${baseUrl}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush(mockTutorial);
  });

  it('should delete all existing tutorials via DELETE', () => {
    const mockTutorials = [
      { id: 1, title: 'Tutorial 1', description: 'This is tutorial 1.' },
      { id: 2, title: 'Tutorial 2', description: 'This is tutorial 2.' },
      { id: 3, title: 'Tutorial 3', description: 'This is tutorial 3.' },
    ];

    service.deleteAll().subscribe((tutorial) => {
      expect(tutorial).toEqual([]);
    });

    const request = httpMock.expectOne(`${baseUrl}`);
    expect(request.request.method).toBe('DELETE');
    request.flush([]);
  });

  it('should retrieve tutorials by title from the API via GET', () => {
    const mockTutorials = [
      { id: 1, title: 'Tutorial 1', description: 'This is tutorial 1.' },
      { id: 2, title: 'Tutorial 2', description: 'This is tutorial 2.' },
      { id: 3, title: 'Tutorial 3', description: 'This is tutorial 3.' },
    ];
    const searchTerm = 'Tutorial';

    service.findByTitle(searchTerm).subscribe((tutorials) => {
      expect(tutorials.length).toBe(3);
      expect(tutorials).toEqual(mockTutorials);
    });

    const request = httpMock.expectOne(`${baseUrl}?title=${searchTerm}`);
    expect(request.request.method).toBe('GET');
    request.flush(mockTutorials);
  });
});
