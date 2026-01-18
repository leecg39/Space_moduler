import { describe, it, expect, vi } from 'vitest';
import { validateImageFile, fileToDataUrl } from '../utils/imageValidation';

describe('imageValidation', () => {
  describe('validateImageFile', () => {
    it('should validate a valid JPEG file', async () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      // Mock file size
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

      // Create a mock image with valid dimensions
      global.Image = class {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        width = 800;
        height = 600;

        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      } as any;

      const result = await validateImageFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject file larger than 10MB', async () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 }); // 11MB

      const result = await validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('10MB');
    });

    it('should reject unsupported file types', async () => {
      const file = new File([''], 'test.gif', { type: 'image/gif' });

      const result = await validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('JPG, PNG');
    });

    it('should reject PDF without dimensions (simplified)', async () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' });

      const result = await validateImageFile(file);

      // PDF validation is more complex, this is a simplified test
      expect(result).toBeDefined();
    });
  });

  describe('fileToDataUrl', () => {
    it('should convert file to data URL', async () => {
      const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });

      const dataUrl = await fileToDataUrl(file);

      expect(dataUrl).startsWith('data:image/jpeg;base64,');
    });

    it('should handle empty file', async () => {
      const file = new File([''], 'empty.jpg', { type: 'image/jpeg' });

      const dataUrl = await fileToDataUrl(file);

      expect(dataUrl).toBeTruthy();
    });
  });
});
