import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { AuthorController } from '../../controllers/author.controller';
import { Author, Book } from '../../models';
import { ResponseHelper } from '../../helpers';
import { AppError } from '../../helpers/error.helper';

// Mock the models and helpers
jest.mock('../../models', () => ({
  Author: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  Book: {
    count: jest.fn(),
  },
}));

jest.mock('../../helpers', () => ({
  ResponseHelper: {
    success: jest.fn(),
  },
}));

describe('AuthorController', () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: any;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('addAuthor', () => {
    it('should add a new author successfully', async () => {
      const authorData = { name: 'John Doe', bio: 'A great writer' };
      mockRequest.body = authorData;
      (Author.create as any).mockResolvedValue({ id: '1', ...authorData });

      await AuthorController.addAuthor(mockRequest, mockResponse, mockNext);

      expect(Author.create).toHaveBeenCalledWith(authorData);
      expect(ResponseHelper.success).toHaveBeenCalledWith(
        mockResponse,
        expect.any(Object),
        'Author added successfully',
        201
      );
    });

    it('should call next with error if creation fails', async () => {
      const error = new Error('Database error');
      (Author.create as any).mockRejectedValue(error);

      await AuthorController.addAuthor(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAuthor', () => {
    it('should return an author if found', async () => {
      const authorId = '1';
      mockRequest.params.id = authorId;
      const authorData = { id: authorId, name: 'John Doe' };
      (Author.findByPk as any).mockResolvedValue(authorData);

      await AuthorController.getAuthor(mockRequest, mockResponse, mockNext);

      expect(Author.findByPk).toHaveBeenCalledWith(authorId, expect.any(Object));
      expect(ResponseHelper.success).toHaveBeenCalledWith(
        mockResponse,
        authorData,
        'Author retrieved successfully'
      );
    });

    it('should throw AppError if author not found', async () => {
      const authorId = '999';
      mockRequest.params.id = authorId;
      (Author.findByPk as any).mockResolvedValue(null);

      await AuthorController.getAuthor(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = mockNext.mock.calls[0][0];
      expect(error.message).toBe('Author not found');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('deleteAuthor', () => {
    it('should delete author if no books are associated', async () => {
      const authorId = '1';
      mockRequest.params.id = authorId;
      const mockAuthor = { 
        id: authorId, 
        name: 'John Doe', 
        destroy: (jest.fn() as any).mockResolvedValue(true) 
      };
      
      (Author.findByPk as any).mockResolvedValue(mockAuthor);
      (Book.count as any).mockResolvedValue(0);

      await AuthorController.deleteAuthor(mockRequest, mockResponse, mockNext);

      expect(mockAuthor.destroy).toHaveBeenCalled();
      expect(ResponseHelper.success).toHaveBeenCalledWith(
        mockResponse,
        null,
        'Author deleted successfully'
      );
    });

    it('should throw error if author has associated books', async () => {
      const authorId = '1';
      mockRequest.params.id = authorId;
      const mockAuthor = { id: authorId, name: 'John Doe' };
      
      (Author.findByPk as any).mockResolvedValue(mockAuthor);
      (Book.count as any).mockResolvedValue(5);

      await AuthorController.deleteAuthor(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = mockNext.mock.calls[0][0];
      expect(error.message).toContain('associated 5 books');
      expect(error.statusCode).toBe(400);
    });
  });
});
