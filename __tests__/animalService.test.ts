import {
  addAnimal,
  deleteAnimal,
  fetchAnimalDetails,
  loadAllAnimals,
  updateAnimal,
} from "../lib/animalService";
import { supabase } from "../lib/supabase";

const mockedSupabase = jest.mocked(supabase);

describe("animalService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addAnimal", () => {
    it("should add an animal successfully", async () => {
      const mockAnimal = {
        name: "Wuff",
        age: 3,
        origin: "Argentinien",
        type: "dog",
        size: "medium",
        sex: "male",
        character: "friendly",
      };

      const mockResponse = {
        data: [{ id: 1, ...mockAnimal, status: "open" }],
        error: null,
      };

      mockedSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue(mockResponse),
        }),
      } as any);

      const result = await addAnimal(mockAnimal);

      expect(mockedSupabase.from).toHaveBeenCalledWith("animals");
      expect(console.log).toHaveBeenCalledWith(
        "Animal added successfully:",
        expect.anything()
      );
    });

    it("should handle errors when adding an animal", async () => {
      const mockAnimal = { name: "Kitty" };
      const mockError = { message: "Database error" };

      mockedSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({ data: null, error: mockError }),
        }),
      } as any);

      const result = await addAnimal(mockAnimal);

      expect(result).toBeNull();
      expect(console.log).toHaveBeenCalledWith(
        "Error adding animal:",
        "Database error"
      );
    });
  });

  describe("loadAllAnimals", () => {
    it("should load all animals successfully", async () => {
      const mockAnimals = [
        { id: 1, name: "Wuffi", type: "dog" },
        { id: 2, name: "Kitty", type: "cat" },
      ];

      mockedSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: mockAnimals, error: null }),
      } as any);

      const result = await loadAllAnimals();

      expect(mockedSupabase.from).toHaveBeenCalledWith("animals");
      expect(result).toEqual(mockAnimals);
      expect(console.log).toHaveBeenCalledWith(
        "Loaded Animal data successfully"
      );
    });

    it("should handle supabase errors", async () => {
      const mockError = { message: "Supabase error #1" };

      mockedSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      } as any);

      const result = await loadAllAnimals();

      expect(result).toBeNull();
      expect(console.log).toHaveBeenCalledWith(
        "Supabase Error on fetching all animal ids:",
        "Supabase error #1"
      );
    });

    it("should handle unexpected errors", async () => {
      const mockError = new Error("Unexpected error");

      mockedSupabase.from.mockReturnValue({
        select: jest.fn().mockRejectedValue(mockError),
      } as any);

      const result = await loadAllAnimals();

      expect(result).toBeNull();
      expect(console.log).toHaveBeenCalledWith(
        "Error fetching Animal data: ",
        "Unexpected error"
      );
    });
  });

  describe("fetchAnimalDetails", () => {
    it("should fetch animal details successfully", async () => {
      const animalId = "123";
      const mockAnimal = { id: 123, name: "Bello", type: "dog" };

      mockedSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest
              .fn()
              .mockResolvedValue({ data: mockAnimal, error: null }),
          }),
        }),
      } as any);

      const result = await fetchAnimalDetails(animalId);

      expect(mockedSupabase.from).toHaveBeenCalledWith("animals");
      expect(result).toEqual(mockAnimal);
    });

    it("should handle supabase errors", async () => {
      const animalId = "123";
      const mockError = { message: "Supabase error #2" };

      mockedSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest
              .fn()
              .mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      } as any);

      const result = await fetchAnimalDetails(animalId);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Supabase Error on fetching animal details for 123:",
        "Supabase error #2"
      );
    });

    it("should handle animal not found", async () => {
      const animalId = "404";

      mockedSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      } as any);

      const result = await fetchAnimalDetails(animalId);

      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalledWith(
        "Animal with id 404 not found."
      );
    });

    it("should handle unexpected errors", async () => {
      const animalId = "500";
      const mockError = new Error("Unexpected error");

      mockedSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockRejectedValue(mockError),
          }),
        }),
      } as any);

      const result = await fetchAnimalDetails(animalId);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Unexpected error on fetchAnimalDetails:",
        mockError
      );
    });
  });

  describe("deleteAnimal", () => {
    it("should delete an animal successfully", async () => {
      const animalId = "123";

      mockedSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      } as any);

      const result = await deleteAnimal(animalId);

      expect(mockedSupabase.from).toHaveBeenCalledWith("animals");
      expect(result).toBe(true);
    });

    it("should handle delete errors", async () => {
      const animalId = "500";
      const mockError = { message: "Delete failed" };

      mockedSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: mockError }),
        }),
      } as any);

      const result = await deleteAnimal(animalId);

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Fehler beim Löschen des Tiers:",
        "Delete failed"
      );
    });
  });

  describe("updateAnimal", () => {
    it("should update an animal successfully", async () => {
      const animalId = "123";
      const updates = { name: "Updated Max", age: 4 };
      const mockUpdatedAnimal = { id: 123, ...updates };

      mockedSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest
                .fn()
                .mockResolvedValue({ data: mockUpdatedAnimal, error: null }),
            }),
          }),
        }),
      } as any);

      const result = await updateAnimal(animalId, updates);

      expect(mockedSupabase.from).toHaveBeenCalledWith("animals");
      expect(result).toEqual(mockUpdatedAnimal);
    });

    it("should handle supabase errors", async () => {
      const animalId = "123";
      const updates = { name: "Updated Max" };
      const mockError = { message: "Update failed" };

      mockedSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest
                .fn()
                .mockResolvedValue({ data: null, error: mockError }),
            }),
          }),
        }),
      } as any);

      const result = await updateAnimal(animalId, updates);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Supabase Error on updating animal data:",
        "Update failed"
      );
    });

    it("should handle unexpected errors", async () => {
      const animalId = "500";
      const updates = { name: "Updated Max" };
      const mockError = new Error("Unexpected error");

      mockedSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockRejectedValue(mockError),
            }),
          }),
        }),
      } as any);

      const result = await updateAnimal(animalId, updates);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Unexpected error in updateAnimal:",
        mockError
      );
    });

    it("should handle animal not found", async () => {
      const animalId = "404";

      mockedSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      } as any);

      const result = await fetchAnimalDetails(animalId);

      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalledWith(
        "Animal with id 404 not found."
      );
    });
  });
});
